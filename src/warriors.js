/**
 * Warriors for Chakravyuh — The 8 Maharathis at the Centre
 * Standing in a circle on a raised platform, each with a distinct
 * colour-coded glow, floating name label, and Drona's cyan-blue energy shield.
 */

import * as THREE from 'three';
import { CONFIG } from './config.js';

function createWarrior(options) {
  const { position, color, name, weapon } = options;

  const group = new THREE.Group();
  group.name = name;
  group.position.copy(position);

  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.65, 2.0, 4, 8),
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.45,
      metalness: 0.5,
      roughness: 0.4
    })
  );
  body.position.y = 1.65;
  group.add(body);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 14, 14),
    new THREE.MeshStandardMaterial({ color: 0xe8b88a, metalness: 0.1, roughness: 0.7 })
  );
  head.position.y = 3.1;
  group.add(head);

  const crown = new THREE.Mesh(
    new THREE.ConeGeometry(0.46, 0.75, 8),
    new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffaa00,
      emissiveIntensity: 0.5,
      metalness: 0.85,
      roughness: 0.2
    })
  );
  crown.position.y = 3.72;
  group.add(crown);

  if (weapon === 'bow') {
    const bow = new THREE.Mesh(
      new THREE.TorusGeometry(0.65, 0.055, 6, 16, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: color, emissiveIntensity: 0.4 })
    );
    bow.position.set(0.95, 2.15, 0);
    bow.rotation.z = Math.PI / 2;
    group.add(bow);
  } else if (weapon === 'sword') {
    const sword = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 2.0, 0.14),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, emissive: color, emissiveIntensity: 0.35, metalness: 0.9, roughness: 0.15 })
    );
    sword.position.set(0.95, 2.3, 0);
    group.add(sword);
  } else {
    const maceMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, emissive: color, emissiveIntensity: 0.4, metalness: 0.8, roughness: 0.25 });
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.5, 8), maceMat);
    handle.position.set(0.95, 1.8, 0);
    const maceHead = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 10), maceMat);
    maceHead.position.set(0.95, 2.65, 0);
    group.add(handle, maceHead);
  }

  // Drona's cyan-blue palm energy shield (Netflix Kurukshetra climax)
  let energyShield = null;
  if (name === 'Drona') {
    energyShield = new THREE.Mesh(
      new THREE.CircleGeometry(1.5, 24),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      })
    );
    energyShield.position.set(0, 2.4, 1.6);
    energyShield.visible = false;
    group.add(energyShield);
  }

  const auraRing = new THREE.Mesh(
    new THREE.RingGeometry(1.0, 1.35, 24),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  auraRing.rotation.x = -Math.PI / 2;
  auraRing.position.y = 0.06;
  group.add(auraRing);

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(1.75, 14, 14),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.14,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  glow.position.y = 2.0;
  group.add(glow);

  group.userData = { name, color, glow, auraRing, energyShield };
  return group;
}

export function createWarriors() {
  const warriorGroup = new THREE.Group();
  warriorGroup.name = 'maharathis-sanctum';

  const platformRadius = 12.5;
  const platformHeight = 1.0;
  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(platformRadius, platformRadius + 1.4, platformHeight, 48),
    new THREE.MeshStandardMaterial({ color: 0x240e08, metalness: 0.35, roughness: 0.75 })
  );
  platform.position.y = platformHeight / 2;
  warriorGroup.add(platform);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(platformRadius, 0.14, 8, 64),
    new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xd4af37, emissiveIntensity: 1.4 })
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = platformHeight;
  warriorGroup.add(rim);

  const circleRadius = 8.8;
  const warriorMeshes = [];
  const labelEntries = [];
  const labelsContainer = document.getElementById('labels-container');

  CONFIG.maharathis.forEach((data, index) => {
    const angle = (index / CONFIG.maharathis.length) * Math.PI * 2;
    const x = Math.cos(angle) * circleRadius;
    const z = Math.sin(angle) * circleRadius;

    const warrior = createWarrior({
      position: new THREE.Vector3(x, platformHeight, z),
      color: data.color,
      name: data.name,
      weapon: data.weapon
    });

    warrior.lookAt(0, platformHeight + 1.5, 0);
    warriorGroup.add(warrior);
    warriorMeshes.push(warrior);

    if (labelsContainer) {
      const labelEl = document.createElement('div');
      labelEl.className = 'warrior-label';
      labelEl.textContent = data.name;
      const hex = '#' + data.color.toString(16).padStart(6, '0');
      labelEl.style.borderColor = hex;
      labelsContainer.appendChild(labelEl);
      labelEntries.push({
        el: labelEl,
        anchor: new THREE.Vector3(x, platformHeight + 4.7, z)
      });
    }
  });

  const projVec = new THREE.Vector3();

  return {
    group: warriorGroup,
    warriors: warriorMeshes,
    update: (time, camera, scrollProgress) => {
      // Dynamic encirclement: Maharathis close in from 8.8m to 4.9m in the final stand
      const currentRadius = scrollProgress >= 0.88
        ? THREE.MathUtils.lerp(8.8, 4.9, Math.min(1, (scrollProgress - 0.88) / 0.12))
        : 8.8;

      warriorMeshes.forEach((w, idx) => {
        const angle = (idx / CONFIG.maharathis.length) * Math.PI * 2;
        const wx = Math.cos(angle) * currentRadius;
        const wz = Math.sin(angle) * currentRadius;
        w.position.set(wx, platformHeight, wz);
        w.lookAt(0, platformHeight + 1.5, 0);

        if (labelEntries[idx]) {
          labelEntries[idx].anchor.set(wx, platformHeight + 4.7, wz);
        }

        const pulse = 1 + Math.sin(time * 2.2 + idx * 0.8) * 0.08;
        w.userData.glow.scale.setScalar(pulse);
        if (w.userData.energyShield) {
          w.userData.energyShield.visible = scrollProgress >= 0.88;
          w.userData.energyShield.scale.setScalar(1 + Math.sin(time * 8) * 0.08);
        }
      });

      const showLabels = scrollProgress > 0.78;
      const width = window.innerWidth;
      const height = window.innerHeight;

      labelEntries.forEach(({ el, anchor }) => {
        if (!showLabels || !camera) {
          el.style.opacity = '0';
          return;
        }
        projVec.copy(anchor).project(camera);
        if (projVec.z > 1) {
          el.style.opacity = '0';
          return;
        }
        el.style.left = `${(projVec.x * 0.5 + 0.5) * width}px`;
        el.style.top = `${(-projVec.y * 0.5 + 0.5) * height}px`;
        el.style.opacity = '1';
      });
    }
  };
}

export default { createWarriors };
