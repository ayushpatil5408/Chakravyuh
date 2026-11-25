/**
 * Camera setup for Chakravyuh
 * Flies along a smooth CatmullRomCurve3 spline driven by scroll progress.
 */

import * as THREE from 'three';
import { CONFIG } from './config.js';

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    CONFIG.camera.fov,
    window.innerWidth / window.innerHeight,
    CONFIG.camera.near,
    CONFIG.camera.far
  );

  const cameraPathPoints = CONFIG.camera.pathPoints.map(
    (p) => new THREE.Vector3(p[0], p[1], p[2])
  );
  const targetPathPoints = CONFIG.camera.targetPathPoints.map(
    (p) => new THREE.Vector3(p[0], p[1], p[2])
  );

  const cameraCurve = new THREE.CatmullRomCurve3(
    cameraPathPoints,
    false,
    'centripetal',
    0.5
  );

  const targetCurve = new THREE.CatmullRomCurve3(
    targetPathPoints,
    false,
    'centripetal',
    0.5
  );

  const currentLookAt = new THREE.Vector3();
  const desiredPos = new THREE.Vector3();
  const desiredTarget = new THREE.Vector3();

  // Set initial pose
  camera.position.copy(cameraCurve.getPointAt(0));
  currentLookAt.copy(targetCurve.getPointAt(0));
  camera.lookAt(currentLookAt);

  return {
    camera,
    cameraCurve,
    targetCurve,

    /**
     * Smoothly update camera along the spline based on scroll progress [0..1]
     */
    update: (progress) => {
      const t = THREE.MathUtils.clamp(progress, 0, 1);
      cameraCurve.getPointAt(t, desiredPos);
      targetCurve.getPointAt(t, desiredTarget);

      camera.position.lerp(desiredPos, 0.18);
      currentLookAt.lerp(desiredTarget, 0.18);
      camera.lookAt(currentLookAt);
    },

    onResize: () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
  };
}

export default { createCamera };
