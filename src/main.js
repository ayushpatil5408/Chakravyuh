/**
 * Main entry point for Chakravyuh — Day 13, Kurukshetra (3D Experience)
 * Integrates Vite + Three.js (UnrealBloomPass) + GSAP ScrollTrigger + Lenis Smooth Scroll.
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { CONFIG } from './config.js';
import { createScene } from './scene.js';
import { createCamera } from './camera.js';
import { createRings } from './rings.js';
import { createWarriors } from './warriors.js';
import { createAbhimanyu } from './abhimanyu.js';
import { createUI } from './ui.js';
import { createMasterTimeline } from './timeline.js';

gsap.registerPlugin(ScrollTrigger);

let renderer, sceneData, cameraControls, rings, warriors, abhimanyu, ui, lenis;
let scrollProgress = 0;
let lastTime = performance.now();
let startTime = performance.now();

async function init() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches || navigator.hardwareConcurrency <= 4;

  // 1. Initialize UI & Loading Screen
  ui = createUI();
  ui.setLoadProgress(20);

  // 2. WebGL Renderer (capped pixel ratio at 2 for 60fps)
  const canvas = document.getElementById('webgl-canvas');
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile && CONFIG.renderer.antialias,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, CONFIG.renderer.maxPixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  ui.setLoadProgress(40);

  // 3. Camera along CatmullRomCurve3 spline
  cameraControls = createCamera();

  // 4. Kurukshetra Dusk Scene + Bloom Post-Processing
  sceneData = createScene(renderer, cameraControls.camera, isMobile);
  ui.setLoadProgress(60);

  // 5. 7 Concentric Chakravyuh Rings (InstancedMesh)
  rings = createRings();
  sceneData.scene.add(rings.group);
  ui.setLoadProgress(78);

  // 6. Abhimanyu Golden Chariot, Crimson Cape & Chariot-Wheel Last Stand
  abhimanyu = createAbhimanyu();
  sceneData.scene.add(abhimanyu.group);

  // 7. 8 Maharathis on Central Raised Platform + Floating Labels
  warriors = createWarriors();
  sceneData.scene.add(warriors.group);
  ui.setLoadProgress(92);

  // 8. Lenis Smooth Scroll + GSAP ScrollTrigger sync
  lenis = new Lenis({
    duration: 1.35,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 9. Master GSAP Scroll Timeline (13 stages)
  createMasterTimeline({
    rings,
    ui,
    onProgress: (p) => {
      scrollProgress = p;
    }
  });

  // 10. Resize handler
  window.addEventListener('resize', onResize);

  // 11. Dismiss loader and start render loop
  ui.hideLoader();
  startTime = performance.now();
  lastTime = startTime;
  requestAnimationFrame(animate);
}

function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, CONFIG.renderer.maxPixelRatio));
  cameraControls.onResize();
  sceneData.onResize(width, height);
}

function animate(now) {
  requestAnimationFrame(animate);

  const time = (now - startTime) / 1000;
  const deltaTime = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  cameraControls.update(scrollProgress);
  rings.update(deltaTime);
  abhimanyu.update(scrollProgress, time);
  warriors.update(time, cameraControls.camera, scrollProgress);
  sceneData.update(time, deltaTime);

  if (sceneData.composer) {
    sceneData.composer.render();
  } else {
    renderer.render(sceneData.scene, cameraControls.camera);
  }
}

init().catch(console.error);
