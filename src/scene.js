/**
 * Scene setup for Chakravyuh — Terraced Labyrinth & Textured Kurukshetra Terrain
 * Matches the architectural 3D Chakravyuh reference:
 * - Sculpted & procedurally textured dusty Kurukshetra earth (no flat plain ground)
 * - 7 physical stepped stone/earth rampart walls with golden rim trim & entry corridor
 * - Central vertical golden light pillar rising from the sanctum
 * - Storm-indigo to burnt-amber dusk sky, sunbeams, embers & banners
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { CONFIG } from './config.js';

export function createScene(renderer, camera, isMobile = false) {
  const scene = new THREE.Scene();

  scene.fog = new THREE.FogExp2(CONFIG.scene.fogColor, CONFIG.scene.fogDensity);

  // 1. Storm-Indigo to Burnt-Amber Dusk Sky
  scene.add(createDuskSky());

  // 2. Sculpted & Procedurally Textured Kurukshetra Battlefield Terrain
  scene.add(createBattlefieldTerrain());

  // 3. Physical Stepped Concentric Labyrinth Ramparts (Chakravyuh Walls)
  scene.add(createChakravyuhRamparts());

  // 4. Subtle Glowing Orbital Guides & Lotus Mandala
  const lotus = createLotusPattern();
  lotus.rotation.x = -Math.PI / 2;
  lotus.position.y = 0.04;
  scene.add(lotus);

  // 5. Central Vertical Golden Light Pillar (Core Beacon)
  const coreBeam = createCoreBeam();
  scene.add(coreBeam);

  // 6. Lighting
  const hemiLight = new THREE.HemisphereLight(0x283b66, 0x4a1c0b, 0.95);
  scene.add(hemiLight);

  const duskSun = new THREE.DirectionalLight(0xff9442, 2.0);
  duskSun.position.set(-130, 56, -120);
  scene.add(duskSun);

  const stormRim = new THREE.DirectionalLight(0x4b6fa8, 0.8);
  stormRim.position.set(110, 80, 90);
  scene.add(stormRim);

  const centerLight = new THREE.PointLight(0xffb84d, 2.8, 170);
  centerLight.position.set(0, 16, 0);
  scene.add(centerLight);

  // 7. Slanting Dusk Sunbeams
  const sunbeams = createSunbeams();
  scene.add(sunbeams);

  // 8. Floating Ember & Dust Motes
  const embers = createEmberParticles(isMobile ? CONFIG.scene.emberCountMobile : CONFIG.scene.emberCountDesktop);
  scene.add(embers.points);

  // 9. Waving War Banners
  const banners = createBanners(CONFIG.scene.bannerCount);
  scene.add(banners.group);

  // 10. Distant Arjuna Beacon
  const arjunaBeacon = createArjunaBeacon();
  scene.add(arjunaBeacon);

  // 11. UnrealBloomPass Post-Processing
  let composer = null;
  let bloomPass = null;
  if (!isMobile) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      CONFIG.renderer.bloomStrength,
      CONFIG.renderer.bloomRadius,
      CONFIG.renderer.bloomThreshold
    );
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());
  }

  return {
    scene,
    lotus,
    embers,
    banners,
    arjunaBeacon,
    composer,
    bloomPass,
    update: (time, deltaTime) => {
      if (lotus && lotus.updateLotus) {
        lotus.updateLotus(deltaTime);
      }
      embers.update(time, deltaTime);
      banners.update(time);

      sunbeams.children.forEach((beam, idx) => {
        beam.material.opacity = 0.04 + Math.sin(time * 0.7 + idx * 1.3) * 0.014;
      });
      coreBeam.material.opacity = 0.28 + Math.sin(time * 1.8) * 0.08;
      const pulse = 1 + Math.sin(time * 2.2) * 0.14;
      arjunaBeacon.userData.halo.scale.setScalar(pulse);
    },
    onResize: (width, height) => {
      if (composer) composer.setSize(width, height);
      if (bloomPass) bloomPass.resolution.set(width, height);
    }
  };
}

/**
 * Procedural sandy/ochre terrain with subtle dunes outside the Chakravyuh
 */
function createBattlefieldTerrain() {
  const size = CONFIG.scene.groundSize;
  const geo = new THREE.PlaneGeometry(size, size, 96, 96);
  geo.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const dist = Math.sqrt(x * x + z * z);

    // Keep the inner 100-unit Chakravyuh arena level, add subtle dunes & ridges outside
    if (dist > 102) {
      const blend = Math.min(1, (dist - 102) / 45);
      const ridge =
        Math.sin(x * 0.045) * Math.cos(z * 0.04) * 3.2 +
        Math.sin(x * 0.11 + z * 0.09) * 1.1;
      pos.setY(i, ridge * blend - 0.1);
    } else {
      pos.setY(i, -0.08 + Math.sin(x * 0.3) * Math.cos(z * 0.3) * 0.05);
    }
  }
  geo.computeVertexNormals();

  // Procedural canvas texture for dusty Kurukshetra soil
  const texCanvas = document.createElement('canvas');
  texCanvas.width = 256;
  texCanvas.height = 256;
  const ctx = texCanvas.getContext('2d');
  ctx.fillStyle = '#2d140b';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 4200; i++) {
    const px = Math.random() * 256;
    const py = Math.random() * 256;
    const r = Math.random() * 2.5 + 0.5;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(92, 42, 20, 0.35)' : 'rgba(18, 7, 4, 0.4)';
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(texCanvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(24, 24);

  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.95,
    metalness: 0.04
  });

  return new THREE.Mesh(geo, mat);
}

/**
 * Physical stepped concentric stone/earth rampart walls between each ring
 * with an open entry corridor along +X (angle = 0) and glowing golden rim trim.
 */
function createChakravyuhRamparts() {
  const group = new THREE.Group();
  group.name = 'chakravyuh-ramparts';

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x3b1f12,
    roughness: 0.88,
    metalness: 0.12
  });

  const rimMat = new THREE.MeshBasicMaterial({
    color: 0xd4af37,
    transparent: true,
    opacity: 0.55,
    side: THREE.DoubleSide
  });

  // Place rampart walls between the 7 soldier rings (at midpoints)
  const wallRadii = [97.5, 86, 74, 62, 50, 38, 26];
  const gapAngle = 0.24; // Clear entry corridor at angle = 0

  wallRadii.forEach((r, idx) => {
    const height = 1.6 + (6 - idx) * 0.12;
    const thickness = 1.6;

    // Extruded arc wall with gap at angle = 0 (+X)
    const shape = new THREE.Shape();
    const startAngle = gapAngle;
    const endAngle = Math.PI * 2 - gapAngle;

    shape.absarc(0, 0, r + thickness / 2, startAngle, endAngle, false);
    shape.absarc(0, 0, r - thickness / 2, endAngle, startAngle, true);
    shape.closePath();

    const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: true,
      bevelThickness: 0.18,
      bevelSize: 0.18,
      bevelSegments: 1,
      curveSegments: 64
    });
    extrudeGeo.rotateX(-Math.PI / 2);

    const wallMesh = new THREE.Mesh(extrudeGeo, wallMat);
    wallMesh.position.y = -0.1;
    group.add(wallMesh);

    // Glowing golden architectural rim on top of each wall
    const rimGeo = new THREE.RingGeometry(
      r - 0.18,
      r + 0.18,
      72,
      1,
      gapAngle,
      Math.PI * 2 - gapAngle * 2
    );
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = -Math.PI / 2;
    rimMesh.position.y = height + 0.1;
    group.add(rimMesh);
  });

  // Radial sector guide lines (matching the 3D blueprint reference)
  const spokeMat = new THREE.MeshBasicMaterial({
    color: 0xd4af37,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  for (let s = 0; s < 6; s++) {
    const angle = (s / 6) * Math.PI * 2 + Math.PI / 6;
    const spokeGeo = new THREE.PlaneGeometry(0.22, 86);
    const spoke = new THREE.Mesh(spokeGeo, spokeMat);
    spoke.rotation.x = -Math.PI / 2;
    spoke.rotation.z = -angle;
    spoke.position.set(Math.cos(angle) * 56, 0.05, Math.sin(angle) * 56);
    group.add(spoke);
  }

  return group;
}

/**
 * Vertical golden light pillar rising from the centre sanctum
 */
function createCoreBeam() {
  const geo = new THREE.CylinderGeometry(0.25, 0.9, 65, 16, 1, true);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(0, 32.5, 0);
  return mesh;
}

function createDuskSky() {
  const skyGeo = new THREE.SphereGeometry(480, 32, 24);
  const skyMat = new THREE.ShaderMaterial({
    uniforms: {
      topColor: { value: new THREE.Color(CONFIG.scene.skyColorTop) },
      horizonColor: { value: new THREE.Color(CONFIG.scene.skyColorHorizon) },
      bottomColor: { value: new THREE.Color(CONFIG.scene.skyColorBottom) }
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 horizonColor;
      uniform vec3 bottomColor;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition).y;
        vec3 col = mix(horizonColor, topColor, pow(max(h, 0.0), 0.42));
        col = mix(col, bottomColor, smoothstep(0.0, -0.22, h));
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    side: THREE.BackSide,
    depthWrite: false
  });
  return new THREE.Mesh(skyGeo, skyMat);
}

function createSunbeams() {
  const group = new THREE.Group();
  const beamConfigs = [
    { pos: [0, 44, 0], topR: 3, botR: 22, h: 92, rotZ: 0.24 },
    { pos: [-14, 40, -10], topR: 2, botR: 15, h: 86, rotZ: 0.28 }
  ];
  beamConfigs.forEach((cfg) => {
    const geo = new THREE.CylinderGeometry(cfg.topR, cfg.botR, cfg.h, 20, 1, true);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffb35c,
      transparent: true,
      opacity: 0.045,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const beam = new THREE.Mesh(geo, mat);
    beam.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
    beam.rotation.z = cfg.rotZ;
    group.add(beam);
  });
  return group;
}

function createLotusPattern() {
  const lotusConfig = CONFIG.scene.lotus;
  const group = new THREE.Group();
  const color = new THREE.Color(lotusConfig.color);
  const petals = [];
  for (let i = 0; i < lotusConfig.petals; i++) {
    const petalGeo = new THREE.RingGeometry(
      lotusConfig.radius * 0.14,
      lotusConfig.radius,
      1,
      4,
      (i / lotusConfig.petals) * Math.PI * 2,
      Math.PI / lotusConfig.petals
    );
    const petalMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: lotusConfig.opacity * 0.35,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const petal = new THREE.Mesh(petalGeo, petalMat);
    petal.userData = {
      baseOpacity: lotusConfig.opacity * 0.35,
      phase: (i / lotusConfig.petals) * Math.PI * 2
    };
    petals.push(petal);
    group.add(petal);
  }
  group.userData = { petals, time: 0, config: lotusConfig };
  group.updateLotus = (dt) => {
    const d = group.userData;
    d.time += dt;
    d.petals.forEach((p) => {
      const wave = Math.sin(d.time * d.config.pulseSpeed + p.userData.phase) * d.config.pulseAmount + 1.0;
      p.material.opacity = p.userData.baseOpacity * wave;
    });
  };
  return group;
}

function createEmberParticles(count) {
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  const phases = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const radius = Math.random() * 145;
    const angle = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.random() * 44 + 0.3;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
    speeds[i] = 0.5 + Math.random() * 1.3;
    phases[i] = Math.random() * Math.PI * 2;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xffa64d,
    size: 0.72,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const points = new THREE.Points(geometry, material);
  return {
    points,
    update: (time, dt) => {
      const posAttr = geometry.attributes.position;
      const arr = posAttr.array;
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        arr[idx + 1] += speeds[i] * dt;
        arr[idx] += Math.sin(time * 0.6 + phases[i]) * 0.018;
        arr[idx + 2] += Math.cos(time * 0.5 + phases[i]) * 0.018;
        if (arr[idx + 1] > 46) arr[idx + 1] = 0.3;
      }
      posAttr.needsUpdate = true;
    }
  };
}

function createBanners(count) {
  const group = new THREE.Group();
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x3b2314, roughness: 0.8 });
  const flagMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b,
    emissive: 0x380800,
    roughness: 0.65,
    side: THREE.DoubleSide
  });
  const flags = [];
  const poleGeo = new THREE.CylinderGeometry(0.1, 0.14, 12, 6);
  const flagGeo = new THREE.PlaneGeometry(3.4, 1.6, 8, 2);
  const basePos = flagGeo.attributes.position.array.slice();
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + 0.18;
    const radius = 104 + (i % 2) * 8;
    const banner = new THREE.Group();
    banner.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    banner.rotation.y = -angle + Math.PI / 2;
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 6.0;
    banner.add(pole);
    const clonedFlagGeo = flagGeo.clone();
    const flag = new THREE.Mesh(clonedFlagGeo, flagMat);
    flag.position.set(1.7, 10.7, 0);
    flag.userData = { phase: i * 0.7, basePos };
    banner.add(flag);
    flags.push(flag);
    group.add(banner);
  }
  return {
    group,
    update: (time) => {
      flags.forEach((flag) => {
        const pos = flag.geometry.attributes.position;
        const arr = pos.array;
        const base = flag.userData.basePos;
        const phase = flag.userData.phase;
        for (let v = 0; v < pos.count; v++) {
          const bx = base[v * 3];
          const factor = Math.max(0, (bx + 1.7) / 3.4);
          arr[v * 3 + 2] = Math.sin(time * 2.1 + phase + bx * 1.4) * 0.38 * factor;
        }
        pos.needsUpdate = true;
      });
    }
  };
}

function createArjunaBeacon() {
  const group = new THREE.Group();
  group.position.set(-140, 0, -120);
  const pillar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 1.3, 24, 8),
    new THREE.MeshBasicMaterial({ color: 0xffe699, transparent: true, opacity: 0.7 })
  );
  pillar.position.y = 12;
  group.add(pillar);
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(5.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending })
  );
  halo.position.y = 17;
  group.add(halo);
  group.userData = { halo };
  return group;
}

export default { createScene };
