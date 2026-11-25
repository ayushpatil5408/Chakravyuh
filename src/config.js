/**
 * Configuration for Chakravyuh — Kurukshetra (Netflix Reference Edition)
 * Storm-indigo & burnt-amber dusk palette, tower-shield Chakravyuh walls,
 * royal umbrella chariot, and 8 Maharathis at the centre.
 */

export const CONFIG = {
  rings: {
    count: 7,
    radii: [92, 80, 68, 56, 44, 32, 20],
    colors: [
      0x8c5a2b, // Ring 1: Outer Tower-Shield Wall (Bronze & Iron)
      0xa0481e, // Ring 2: Armoured War Elephants (Gold-plated)
      0xb84a18, // Ring 3: Cavalry Phalanx
      0x9e3214, // Ring 4: Chariot Division
      0x822212, // Ring 5: Archers & Spear Wall
      0x6b1812, // Ring 6: Inner Shield Guard
      0x4d1010  // Ring 7: Sanctum Guard
    ],
    rotationDirections: [1, -1, 1, -1, 1, -1, 1],
    rotationSpeed: 0.038,

    // Dense shoulder-to-shoulder phalanx per ring (total 720 instances, 60fps via InstancedMesh)
    units: [
      { type: 'elephant', count: 44, scale: 1.65 },   // Ring 1: Outer War Elephants
      { type: 'shieldwall', count: 140, scale: 1.05 },// Ring 2: Heavy Infantry & Tower Shields
      { type: 'cavalry', count: 110, scale: 0.95 },   // Ring 3: Spear & Cavalry Phalanx
      { type: 'chariot', count: 72, scale: 1.1 },     // Ring 4: War Chariots
      { type: 'archer', count: 130, scale: 0.85 },    // Ring 5: Archers
      { type: 'spearman', count: 120, scale: 0.9 },   // Ring 6: Spearmen Phalanx
      { type: 'elite', count: 104, scale: 1.0 }       // Ring 7: Elite Vanguard
    ],

    gap: {
      maxAngle: Math.PI / 4.5,
      pushDistance: 6.0
    }
  },

  // 8 Maharathis at the centre
  maharathis: [
    { name: 'Drona', role: 'Acharya · Blue Energy Shield', color: 0x38bdf8, weapon: 'bow' },
    { name: 'Karna', role: 'Anga King · Maharathi', color: 0xf59e0b, weapon: 'bow' },
    { name: 'Kripa', role: 'Kripacharya · Immortal', color: 0xfbbf24, weapon: 'bow' },
    { name: 'Ashwatthama', role: 'Son of Drona', color: 0xf97316, weapon: 'sword' },
    { name: 'Duryodhana', role: 'Kaurava Sovereign', color: 0xdc2626, weapon: 'mace' },
    { name: 'Kritavarma', role: 'Yadava Commander', color: 0xb91c1c, weapon: 'mace' },
    { name: 'Shakuni', role: 'Master Strategist', color: 0xa855f7, weapon: 'sword' },
    { name: 'Lakshman', role: "Duryodhana's Son · Mace Duel", color: 0xef4444, weapon: 'mace' }
  ],

  // Camera CatmullRomCurve3 spline choreographed to Netflix Kurukshetra shots
  camera: {
    fov: 50,
    near: 0.2,
    far: 700,
    pathPoints: [
      [0, 148, 110],     // 1. High aerial spiral overview
      [96, 36, 48],      // 2. Swoop down to the outer shield-wall gate
      [114, 7.5, 14],    // 3. Low wheel-level chase behind Abhimanyu's chariot
      [88, 5.2, 6],      // 4. Inside the narrow shield corridor (Ring 1-2)
      [72, 11, 14],      // 5. Whip-look back as Jayadratha's shield wall slams shut
      [64, 5.8, -5],     // 6. Low-angle charge past gold-armoured war elephants
      [48, 6.2, 7],      // 7. Weaving through Cavalry & Chariot rings
      [34, 6.5, -5],     // 8. Piercing Archers & Inner Shield Wall
      [20, 9, 14],       // 9. Entering the dusty centre ("Uncle Bheem!")
      [14, 6.5, 15],     // 10. Orbiting the 8 Maharathis emerging in mist
      [-15, 6.5, 13],    // 11. Blue-arc sword fury & Lakshman mace duel
      [-9.5, 5.8, -8.5], // 12. Drona's blue palm-shield strike & chariot destroyed
      [3.2, 1.75, 3.6]   // 13. Final heroic low-angle view: Abhimanyu with raised wheel & celestial pillar
    ],
    targetPathPoints: [
      [0, 0, 0],         // 1. Chakravyuh spiral centre
      [75, 4, 0],        // 2. Outer gate
      [86, 2.5, 0],      // 3. Abhimanyu's chariot
      [70, 2.5, 0],      // 4. Shield corridor ahead
      [90, 4, 0],        // 5. Look back at sealed outer shield wall
      [54, 3, 0],        // 6. War elephants
      [40, 2.5, 0],      // 7. Inner rings
      [22, 2.5, 0],      // 8. Inner shield wall
      [0, 2.8, 0],       // 9. Centre sanctum
      [0, 3.0, 0],       // 10. 8 Maharathis
      [0, 2.8, 0],       // 11. Abhimanyu fighting
      [0, 2.4, 0],       // 12. Drona & Abhimanyu
      [0, 2.1, 0.15]     // 13. Abhimanyu holding divine wheel aloft with celestial light
    ]
  },

  // Netflix Kurukshetra storm-indigo + burnt-amber dusk atmosphere
  scene: {
    skyColorTop: 0x0b1324,      // Stormy deep indigo
    skyColorHorizon: 0xd15817,  // Fiery burnt-amber horizon
    skyColorBottom: 0x1e0905,
    fogColor: 0x26100a,
    fogDensity: 0.0042,
    groundSize: 600,
    groundColor: 0x240e07,      // Red-ochre Kurukshetra dust
    emberCountDesktop: 700,
    emberCountMobile: 240,
    bannerCount: 16,

    lotus: {
      petals: 16,
      radius: 98,
      color: 0xd4af37,
      opacity: 0.22,
      pulseSpeed: 0.7,
      pulseAmount: 0.12
    }
  },

  renderer: {
    maxPixelRatio: 2,
    antialias: true,
    bloomStrength: 0.78,
    bloomRadius: 0.48,
    bloomThreshold: 0.56
  }
};

export default CONFIG;
