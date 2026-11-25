/**
 * Rings for Chakravyuh - InstancedMesh Units
 * Creates 7 rings of procedural low-poly units using THREE.InstancedMesh
 * Ring 1: Elephants (large boxes with smaller box head)
 * Ring 2: Cavalry (horse + rider)
 * Ring 3: Chariots (platform + wheels)
 * Ring 4: Archers (figure + bow)
 * Ring 5: Spearmen (figure + spear)
 * Ring 6: Elite Guards (ornate armor)
 * Ring 7: Heavy Infantry (shield + spear)
 * 
 * Each ring rotates slowly in alternating directions.
 * Units face outward. Gap opening for Abhimanyu's passage.
 */

import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { CONFIG } from './config.js';

// Unit geometry cache to avoid recreating
const geometryCache = new Map();

/**
 * Get or create a geometry for a unit type
 */
function getUnitGeometry(type) {
  if (geometryCache.has(type)) {
    return geometryCache.get(type);
  }

  let geometry;

  switch (type) {
    case 'shieldwall':
      geometry = createShieldWallGeometry();
      break;
    case 'elephant':
      // Elephant: large body box + smaller head box + 4 leg cylinders
      geometry = createElephantGeometry();
      break;
    case 'cavalry':
      // Cavalry: horse body + rider
      geometry = createCavalryGeometry();
      break;
    case 'chariot':
      // Chariot: platform + 2 wheels + pole
      geometry = createChariotGeometry();
      break;
    case 'archer':
      // Archer: body + head + bow
      geometry = createArcherGeometry();
      break;
    case 'spearman':
      // Spearman: body + head + long spear
      geometry = createSpearmanGeometry();
      break;
    case 'elite':
      // Elite: ornate body + helmet + weapon
      geometry = createEliteGeometry();
      break;
    case 'infantry':
      // Infantry: body + shield + spear
      geometry = createInfantryGeometry();
      break;
    default:
      geometry = new THREE.BoxGeometry(1, 2, 1);
  }

  geometryCache.set(type, geometry);
  return geometry;
}

/**
 * Elephant: Large body box + head box + 4 legs
 */
function createElephantGeometry() {
  const group = new THREE.Group();

  // Body - large box
  const bodyGeo = new THREE.BoxGeometry(2.5, 1.8, 1.2);
  const bodyMesh = new THREE.Mesh(bodyGeo);
  bodyMesh.position.y = 1.0;
  group.add(bodyMesh);

  // Head - smaller box forward
  const headGeo = new THREE.BoxGeometry(1.0, 0.9, 0.8);
  const headMesh = new THREE.Mesh(headGeo);
  headMesh.position.set(1.6, 1.3, 0);
  group.add(headMesh);

  // Trunk - thin cylinder
  const trunkGeo = new THREE.CylinderGeometry(0.15, 0.08, 1.2, 6);
  const trunkMesh = new THREE.Mesh(trunkGeo);
  trunkMesh.position.set(2.0, 1.0, 0);
  trunkMesh.rotation.x = Math.PI / 3;
  group.add(trunkMesh);

  // 4 Legs
  const legGeo = new THREE.CylinderGeometry(0.25, 0.3, 1.5, 6);
  const legPositions = [
    [-1.0, -0.7, -0.5], [1.0, -0.7, -0.5],
    [-1.0, -0.7, 0.5], [1.0, -0.7, 0.5]
  ];
  legPositions.forEach(pos => {
    const legMesh = new THREE.Mesh(legGeo);
    legMesh.position.set(pos[0], pos[1], pos[2]);
    group.add(legMesh);
  });

  // Tusks
  const tuskGeo = new THREE.ConeGeometry(0.08, 0.8, 6);
  const tuskPositions = [[1.8, 1.1, -0.25], [1.8, 1.1, 0.25]];
  tuskPositions.forEach(pos => {
    const tusk = new THREE.Mesh(tuskGeo);
    tusk.position.set(pos[0], pos[1], pos[2]);
    tusk.rotation.x = -Math.PI / 4;
    group.add(tusk);
  });

  // Merge into single geometry for InstancedMesh
  const merged = new THREE.BufferGeometry();
  const meshes = [];
  group.traverse(child => {
    if (child.isMesh) {
      child.updateMatrix();
      meshes.push(child);
    }
  });
  mergeGeometries(
    meshes.map(m => m.geometry.applyMatrix4(m.matrix)),
    false
  ).copy(merged);

  return merged;
}

/**
 * Tower-Shield Wall (Netflix Kurukshetra Chakravyuh):
 * Tall rectangular shield + circular chakra boss + spear tip above
 */
function createShieldWallGeometry() {
  const group = new THREE.Group();

  // Tall curved-feel tower shield slab
  const shieldMesh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.8, 2.2));
  shieldMesh.position.y = 1.9;
  group.add(shieldMesh);

  // Circular Chakra boss on outer face
  const bossMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.16, 12));
  bossMesh.rotation.z = Math.PI / 2;
  bossMesh.position.set(0.22, 2.1, 0);
  group.add(bossMesh);

  // Bristling spear shaft + tip above the shield
  const spearShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.4, 6));
  spearShaft.position.set(-0.2, 4.2, 0.5);
  group.add(spearShaft);

  const spearTip = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.45, 6));
  spearTip.position.set(-0.2, 5.5, 0.5);
  group.add(spearTip);

  const meshes = [];
  group.traverse(child => {
    if (child.isMesh) {
      child.updateMatrix();
      meshes.push(child);
    }
  });
  return mergeGeometries(
    meshes.map(m => m.geometry.applyMatrix4(m.matrix)),
    false
  );
}

/**
 * Cavalry: Horse body + rider
 */
function createCavalryGeometry() {
  const group = new THREE.Group();

  // Horse body
  const bodyGeo = new THREE.BoxGeometry(1.8, 1.2, 0.7);
  const bodyMesh = new THREE.Mesh(bodyGeo);
  bodyMesh.position.y = 0.9;
  group.add(bodyMesh);

  // Horse head/neck
  const headGeo = new THREE.BoxGeometry(0.6, 0.7, 0.4);
  const headMesh = new THREE.Mesh(headGeo);
  headMesh.position.set(1.1, 1.3, 0);
  group.add(headMesh);

  // Horse legs (4)
  const legGeo = new THREE.CylinderGeometry(0.1, 0.12, 1.0, 5);
  const legPositions = [
    [-0.6, -0.4, -0.3], [0.6, -0.4, -0.3],
    [-0.6, -0.4, 0.3], [0.6, -0.4, 0.3]
  ];
  legPositions.forEach(pos => {
    const leg = new THREE.Mesh(legGeo);
    leg.position.set(pos[0], pos[1], pos[2]);
    group.add(leg);
  });

  // Rider torso
  const torsoGeo = new THREE.BoxGeometry(0.5, 0.9, 0.35);
  const torsoMesh = new THREE.Mesh(torsoGeo);
  torsoMesh.position.set(-0.1, 1.9, 0);
  group.add(torsoMesh);

  // Rider head
  const headRiderGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
  const headRiderMesh = new THREE.Mesh(headRiderGeo);
  headRiderMesh.position.set(-0.1, 2.5, 0);
  group.add(headRiderMesh);

  // Rider lance/spear
  const spearGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.5, 4);
  const spearMesh = new THREE.Mesh(spearGeo);
  spearMesh.position.set(-0.5, 2.2, 0.3);
  spearMesh.rotation.z = -Math.PI / 6;
  group.add(spearMesh);

  // Merge
  const merged = new THREE.BufferGeometry();
  const meshes = [];
  group.traverse(child => {
    if (child.isMesh) {
      child.updateMatrix();
      meshes.push(child.geometry.applyMatrix4(child.matrix));
    }
  });
  mergeGeometries(meshes, false).copy(merged);
  return merged;
}

/**
 * Chariot: Platform + 2 wheels + pole + rider
 */
function createChariotGeometry() {
  const group = new THREE.Group();

  // Platform
  const platformGeo = new THREE.BoxGeometry(1.6, 0.3, 1.0);
  const platformMesh = new THREE.Mesh(platformGeo);
  platformMesh.position.y = 0.7;
  group.add(platformMesh);

  // Wheels (2)
  const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 8);
  const wheelPositions = [[-0.7, 0.5, -0.6], [0.7, 0.5, -0.6]];
  wheelPositions.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeo);
    wheel.position.set(pos[0], pos[1], pos[2]);
    wheel.rotation.z = Math.PI / 2;
    group.add(wheel);
  });

  // Wheel spokes (simple)
  const spokeGeo = new THREE.BoxGeometry(0.05, 0.5, 0.05);
  for (let i = 0; i < 4; i++) {
    const spoke = new THREE.Mesh(spokeGeo);
    spoke.position.set(-0.7, 0.5, -0.6);
    spoke.rotation.z = Math.PI / 2 + (i * Math.PI / 4);
    group.add(spoke);
    const spoke2 = spoke.clone();
    spoke2.position.set(0.7, 0.5, -0.6);
    group.add(spoke2);
  }

  // Pole
  const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 6);
  const poleMesh = new THREE.Mesh(poleGeo);
  poleMesh.position.set(-1.0, 1.5, 0);
  group.add(poleMesh);

  // Driver
  const driverGeo = new THREE.BoxGeometry(0.4, 1.0, 0.3);
  const driverMesh = new THREE.Mesh(driverGeo);
  driverMesh.position.set(0, 1.4, 0);
  group.add(driverMesh);

  // Archer in chariot
  const archerGeo = new THREE.BoxGeometry(0.35, 1.0, 0.25);
  const archerMesh = new THREE.Mesh(archerGeo);
  archerMesh.position.set(0.4, 1.4, 0);
  group.add(archerMesh);

  // Bow
  const bowGeo = new THREE.TorusGeometry(0.35, 0.02, 4, 12, Math.PI);
  const bowMesh = new THREE.Mesh(bowGeo);
  bowMesh.position.set(0.7, 1.5, 0);
  bowMesh.rotation.y = Math.PI / 2;
  group.add(bowMesh);

  // Merge
  const merged = new THREE.BufferGeometry();
  const meshes = [];
  group.traverse(child => {
    if (child.isMesh) {
      child.updateMatrix();
      meshes.push(child.geometry.applyMatrix4(child.matrix));
    }
  });
  mergeGeometries(meshes, false).copy(merged);
  return merged;
}

/**
 * Archer: Body + head + bow
 */
function createArcherGeometry() {
  const group = new THREE.Group();

  // Body
  const bodyGeo = new THREE.BoxGeometry(0.4, 1.0, 0.25);
  const bodyMesh = new THREE.Mesh(bodyGeo);
  bodyMesh.position.y = 1.0;
  group.add(bodyMesh);

  // Head
  const headGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
  const headMesh = new THREE.Mesh(headGeo);
  headMesh.position.y = 1.75;
  group.add(headMesh);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.9, 5);
  const legPositions = [[-0.12, 0.55, 0], [0.12, 0.55, 0]];
  legPositions.forEach(pos => {
    const leg = new THREE.Mesh(legGeo);
    leg.position.set(pos[0], pos[1], pos[2]);
    group.add(leg);
  });

  // Bow
  const bowGeo = new THREE.TorusGeometry(0.4, 0.02, 4, 16, Math.PI);
  const bowMesh = new THREE.Mesh(bowGeo);
  bowMesh.position.set(0.45, 1.2, 0);
  bowMesh.rotation.y = Math.PI / 2;
  group.add(bowMesh);

  // Quiver
  const quiverGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 6);
  const quiverMesh = new THREE.Mesh(quiverGeo);
  quiverMesh.position.set(-0.3, 1.0, 0.2);
  group.add(quiverMesh);

  // Merge
  const merged = new THREE.BufferGeometry();
  const meshes = [];
  group.traverse(child => {
    if (child.isMesh) {
      child.updateMatrix();
      meshes.push(child.geometry.applyMatrix4(child.matrix));
    }
  });
  mergeGeometries(meshes, false).copy(merged);
  return merged;
}

/**
 * Spearman: Body + head + long spear
 */
function createSpearmanGeometry() {
  const group = new THREE.Group();

  // Body
  const bodyGeo = new THREE.BoxGeometry(0.4, 1.0, 0.25);
  const bodyMesh = new THREE.Mesh(bodyGeo);
  bodyMesh.position.y = 1.0;
  group.add(bodyMesh);

  // Head
  const headGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
  const headMesh = new THREE.Mesh(headGeo);
  headMesh.position.y = 1.75;
  group.add(headMesh);

  // Helmet crest
  const crestGeo = new THREE.ConeGeometry(0.12, 0.3, 6);
  const crestMesh = new THREE.Mesh(crestGeo);
  crestMesh.position.set(0, 2.0, 0);
  crestMesh.rotation.x = Math.PI;
  group.add(crestMesh);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.9, 5);
  const legPositions = [[-0.12, 0.55, 0], [0.12, 0.55, 0]];
  legPositions.forEach(pos => {
    const leg = new THREE.Mesh(legGeo);
    leg.position.set(pos[0], pos[1], pos[2]);
    group.add(leg);
  });

  // Long spear
  const spearGeo = new THREE.CylinderGeometry(0.025, 0.025, 3.0, 4);
  const spearMesh = new THREE.Mesh(spearGeo);
  spearMesh.position.set(0.35, 2.2, 0);
  spearMesh.rotation.x = -Math.PI / 12;
  group.add(spearMesh);

  // Shield on back
  const shieldGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.05, 12);
  const shieldMesh = new THREE.Mesh(shieldGeo);
  shieldMesh.position.set(-0.3, 1.2, 0);
  shieldMesh.rotation.x = Math.PI / 2;
  group.add(shieldMesh);

  // Merge
  const merged = new THREE.BufferGeometry();
  const meshes = [];
  group.traverse(child => {
    if (child.isMesh) {
      child.updateMatrix();
      meshes.push(child.geometry.applyMatrix4(child.matrix));
    }
  });
  mergeGeometries(meshes, false).copy(merged);
  return merged;
}

/**
 * Elite Guard: Ornate armor + helmet + decorative weapon
 */
function createEliteGeometry() {
  const group = new THREE.Group();

  // Body (wider for armor)
  const bodyGeo = new THREE.BoxGeometry(0.55, 1.1, 0.3);
  const bodyMesh = new THREE.Mesh(bodyGeo);
  bodyMesh.position.y = 1.05;
  group.add(bodyMesh);

  // Shoulder pauldrons
  const pauldronGeo = new THREE.SphereGeometry(0.2, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
  const pauldronL = new THREE.Mesh(pauldronGeo);
  pauldronL.position.set(-0.35, 1.6, 0);
  pauldronL.scale.set(1, 0.7, 1);
  group.add(pauldronL);
  const pauldronR = pauldronL.clone();
  pauldronR.position.set(0.35, 1.6, 0);
  group.add(pauldronR);

  // Head with ornate helmet
  const headGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
  const headMesh = new THREE.Mesh(headGeo);
  headMesh.position.y = 1.85;
  group.add(headMesh);

  // Helmet plume
  const plumeGeo = new THREE.ConeGeometry(0.08, 0.5, 6);
  const plumeMesh = new THREE.Mesh(plumeGeo);
  plumeMesh.position.set(0, 2.25, 0);
  plumeMesh.rotation.x = Math.PI;
  group.add(plumeMesh);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.07, 0.08, 0.9, 5);
  const legPositions = [[-0.15, 0.6, 0], [0.15, 0.6, 0]];
  legPositions.forEach(pos => {
    const leg = new THREE.Mesh(legGeo);
    leg.position.set(pos[0], pos[1], pos[2]);
    group.add(leg);
  });

  // Ornate sword
  const swordGeo = new THREE.BoxGeometry(0.06, 1.5, 0.03);
  const swordMesh = new THREE.Mesh(swordGeo);
  swordMesh.position.set(0.4, 1.5, 0.2);
  group.add(swordMesh);

  // Shield
  const shieldGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 16);
  const shieldMesh = new THREE.Mesh(shieldGeo);
  shieldMesh.position.set(-0.4, 1.3, 0);
  shieldMesh.rotation.x = Math.PI / 2;
  group.add(shieldMesh);

  // Merge
  const merged = new THREE.BufferGeometry();
  const meshes = [];
  group.traverse(child => {
    if (child.isMesh) {
      child.updateMatrix();
      meshes.push(child.geometry.applyMatrix4(child.matrix));
    }
  });
  mergeGeometries(meshes, false).copy(merged);
  return merged;
}

/**
 * Heavy Infantry: Shield + spear + simple armor
 */
function createInfantryGeometry() {
  const group = new THREE.Group();

  // Body
  const bodyGeo = new THREE.BoxGeometry(0.45, 1.0, 0.25);
  const bodyMesh = new THREE.Mesh(bodyGeo);
  bodyMesh.position.y = 1.0;
  group.add(bodyMesh);

  // Head
  const headGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
  const headMesh = new THREE.Mesh(headGeo);
  headMesh.position.y = 1.75;
  group.add(headMesh);

  // Simple helmet
  const helmetGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.15, 12);
  const helmetMesh = new THREE.Mesh(helmetGeo);
  helmetMesh.position.y = 1.88;
  group.add(helmetMesh);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.9, 5);
  const legPositions = [[-0.13, 0.55, 0], [0.13, 0.55, 0]];
  legPositions.forEach(pos => {
    const leg = new THREE.Mesh(legGeo);
    leg.position.set(pos[0], pos[1], pos[2]);
    group.add(leg);
  });

  // Large shield
  const shieldGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 16);
  const shieldMesh = new THREE.Mesh(shieldGeo);
  shieldMesh.position.set(-0.45, 1.2, 0);
  shieldMesh.rotation.x = Math.PI / 2;
  group.add(shieldMesh);

  // Spear
  const spearGeo = new THREE.CylinderGeometry(0.025, 0.025, 2.5, 4);
  const spearMesh = new THREE.Mesh(spearGeo);
  spearMesh.position.set(0.35, 2.0, 0);
  spearMesh.rotation.x = -Math.PI / 16;
  group.add(spearMesh);

  // Merge
  const merged = new THREE.BufferGeometry();
  const meshes = [];
  group.traverse(child => {
    if (child.isMesh) {
      child.updateMatrix();
      meshes.push(child.geometry.applyMatrix4(child.matrix));
    }
  });
  mergeGeometries(meshes, false).copy(merged);
  return merged;
}

/**
 * Create material for a ring with its color
 */
function createRingMaterial(color) {
  return new THREE.MeshStandardMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: 0.15,
    metalness: 0.25,
    roughness: 0.65,
    flatShading: true
  });
}

/**
 * Create all 7 rings as InstancedMesh
 */
export function createRings() {
  const ringGroup = new THREE.Group();
  ringGroup.name = 'chakravyuh-rings';

  const ringData = [];
  const unitConfigs = CONFIG.rings.units;
  const radii = CONFIG.rings.radii;
  const colors = CONFIG.rings.colors;
  const directions = CONFIG.rings.rotationDirections;
  const baseSpeed = CONFIG.rings.rotationSpeed;

  let totalInstances = 0;

  for (let ringIndex = 0; ringIndex < CONFIG.rings.count; ringIndex++) {
    const unitConfig = unitConfigs[ringIndex];
    const radius = radii[ringIndex];
    const color = colors[ringIndex];
    const direction = directions[ringIndex];
    const count = unitConfig.count;
    const scale = unitConfig.scale;

    totalInstances += count;

    // Get geometry for this unit type
    const geometry = getUnitGeometry(unitConfig.type);
    const material = createRingMaterial(color);

    // Create InstancedMesh
    const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
    instancedMesh.name = `ring-${ringIndex + 1}-${unitConfig.type}`;
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // Will update for gap
    instancedMesh.castShadow = false;
    instancedMesh.receiveShadow = false;
    instancedMesh.frustumCulled = false; // Ensure all instances render

    // Store base positions and rotations for each instance
    const baseMatrices = new Float32Array(count * 16);
    const basePositions = new Float32Array(count * 3);
    const baseRotations = new Float32Array(count * 4); // quaternion
    const gapOffsets = new Float32Array(count); // Current gap push amount per instance

    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      // Evenly distributed around the ring
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Position at ring radius, facing outward (away from center)
      dummy.position.set(x, 0, z);
      // Face outward: look away from center
      dummy.lookAt(x * 2, 0, z * 2);
      dummy.rotation.x = 0;
      dummy.rotation.z = 0;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();

      // Store base matrix
      dummy.matrix.toArray(baseMatrices, i * 16);
      // Store base position
      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = 0;
      basePositions[i * 3 + 2] = z;
      // Store base rotation (quaternion)
      dummy.quaternion.toArray(baseRotations, i * 4);
      // Gap offset starts at 0
      gapOffsets[i] = 0;

      // Set initial matrix
      instancedMesh.setMatrixAt(i, dummy.matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;

    ringData.push({
      index: ringIndex,
      mesh: instancedMesh,
      count: count,
      radius: radius,
      color: color,
      direction: direction,
      speed: baseSpeed,
      unitType: unitConfig.type,
      scale: scale,
      baseMatrices: baseMatrices,
      basePositions: basePositions,
      baseRotations: baseRotations,
      gapOffsets: gapOffsets,
      gapTargetOffsets: new Float32Array(count), // Target gap offset for animation
      gapAngle: 0,          // Current gap center angle
      gapWidth: 0,          // Current gap angular width
      gapOpening: false,    // Is gap currently opening
      dummy: new THREE.Object3D()
    });

    ringGroup.add(instancedMesh);
  }

  console.log(`Total unit instances: ${totalInstances}`);

  return {
    rings: ringData,
    group: ringGroup,
    ringData: ringData,

    /**
     * Update all rings - call each frame with deltaTime in seconds
     * @param {number} deltaTime - Elapsed frame time in seconds
     */
    update: (deltaTime) => {
      const dt = Math.min(deltaTime, 0.05);
      ringData.forEach((ring, idx) => {
        // Rotate each ring horizontally around the Y axis, alternating directions
        const ringSpeedFactor = 1 + idx * 0.08;
        ring.mesh.rotation.y += ring.direction * ring.speed * ringSpeedFactor * dt;

        // Animate gap offsets toward targets
        let needsMatrixUpdate = false;
        for (let i = 0; i < ring.count; i++) {
          const currentOffset = ring.gapOffsets[i];
          const targetOffset = ring.gapTargetOffsets[i];
          if (Math.abs(currentOffset - targetOffset) > 0.01) {
            ring.gapOffsets[i] += (targetOffset - currentOffset) * 0.14;
            needsMatrixUpdate = true;
          } else if (currentOffset !== targetOffset) {
            ring.gapOffsets[i] = targetOffset;
            needsMatrixUpdate = true;
          }
        }

        if (needsMatrixUpdate) {
          updateRingMatrices(ring);
        }
      });
    },

    /**
     * Open a gap in a specific ring at a given world-space angle
     * @param {number} ringIndex - Ring index (0-6)
     * @param {number} angle - Angle in radians where gap should open (world space)
     * @param {number} width - Angular width of gap (optional)
     */
    openGap: (ringIndex, angle, width) => {
      const ring = ringData[ringIndex];
      if (!ring) return;

      const gapWidth = width || CONFIG.rings.gap.maxAngle;
      const pushDist = CONFIG.rings.gap.pushDistance;

      // Convert world angle to ring's local rotation space around Y
      const localAngle = angle + ring.mesh.rotation.y;

      ring.gapAngle = localAngle;
      ring.gapWidth = gapWidth;
      ring.gapOpening = true;

      for (let i = 0; i < ring.count; i++) {
        const instanceAngle = (i / ring.count) * Math.PI * 2;
        const signedDiff = normalizeAngle(instanceAngle - localAngle);
        const diff = Math.abs(signedDiff);

        if (diff < gapWidth / 2) {
          const pushFactor = 1.0 - (diff / (gapWidth / 2));
          // Encode sign in gapTargetOffsets so units part left/right + outward
          const sign = signedDiff >= 0 ? 1 : -1;
          ring.gapTargetOffsets[i] = sign * pushDist * (0.4 + 0.6 * pushFactor);
        } else {
          ring.gapTargetOffsets[i] = 0;
        }
      }
    },

    /**
     * Close gap in a specific ring
     * @param {number} ringIndex - Ring index (0-6)
     */
    closeGap: (ringIndex) => {
      const ring = ringData[ringIndex];
      if (!ring) return;

      ring.gapOpening = false;
      ring.gapWidth = 0;

      for (let i = 0; i < ring.count; i++) {
        ring.gapTargetOffsets[i] = 0;
      }
    },

    /**
     * Close all ring gaps (used when Jayadratha seals the path)
     */
    closeAllGaps: () => {
      for (let r = 0; r < ringData.length; r++) {
        ringData[r].gapOpening = false;
        ringData[r].gapWidth = 0;
        ringData[r].gapTargetOffsets.fill(0);
      }
    },

    /**
     * Get ring data by index
     */
    getRing: (index) => ringData[index],

    /**
     * Get all rings
     */
    getAll: () => ringData,

    /**
     * Get total instance count
     */
    getTotalInstances: () => totalInstances
  };
}

/**
 * Update instance matrices for a ring based on current gap offsets
 */
function updateRingMatrices(ring) {
  const { count, basePositions, baseRotations, gapOffsets, dummy, mesh } = ring;

  for (let i = 0; i < count; i++) {
    const offset = gapOffsets[i];
    if (offset === 0) {
      // No gap offset - use base matrix directly
      const baseMatrix = new THREE.Matrix4();
      baseMatrix.fromArray(ring.baseMatrices, i * 16);
      mesh.setMatrixAt(i, baseMatrix);
    } else {
      // Apply gap offset - part tangentially left/right and push slightly outward
      const baseX = basePositions[i * 3];
      const baseZ = basePositions[i * 3 + 2];
      const radialLength = Math.sqrt(baseX * baseX + baseZ * baseZ) || 1;
      const radialX = baseX / radialLength;
      const radialZ = baseZ / radialLength;
      const tangentX = -radialZ;
      const tangentZ = radialX;
      const outward = Math.abs(offset) * 0.45;

      dummy.position.set(
        baseX + tangentX * offset + radialX * outward,
        basePositions[i * 3 + 1],
        baseZ + tangentZ * offset + radialZ * outward
      );

      // Restore base rotation (facing outward)
      const quat = new THREE.Quaternion().fromArray(baseRotations, i * 4);
      dummy.quaternion.copy(quat);
      dummy.scale.setScalar(ring.scale);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
    }
  }

  mesh.instanceMatrix.needsUpdate = true;
}

/**
 * Normalize angle to [-PI, PI]
 */
function normalizeAngle(angle) {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

/**
 * Standalone update function for use in main animation loop
 * @param {number} time - Time in seconds
 */
export function updateRings(time) {
  // This will be called by the main loop with the rings object
  // The actual update is handled by the returned object's update method
  // This export is for API compatibility
}

/**
 * Standalone openGap function for API compatibility
 * @param {number} ringIndex - Ring index (0-6)
 * @param {number} angle - Angle in radians
 */
export function openGap(ringIndex, angle) {
  // This will be called via the rings object
  // Export for API compatibility
}

export default {
  createRings,
  updateRings,
  openGap
};