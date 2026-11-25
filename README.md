# चक्रव्यूह (CHAKRAVYUH) — Day 13, Kurukshetra

An immersive, cinematic scroll-driven 3D WebGL experience depicting the entry of 16-year-old **Abhimanyu** into the impenetrable seven-ringed **Chakravyuh** during the Mahabharata war on Day 13 of Kurukshetra.

Built for the **Indian Knowledge Systems (IKS)** project using Three.js, GSAP ScrollTrigger, and Lenis.

---

## 🌟 Key Features

- **100% Procedural 3D WebGL Canvas:**
  - 7 rotating concentric rings of war formations (War Elephants, Tower-Shield Walls, Cavalry, Chariots, Archers, Spearmen, and Elite Guards) rendered using `InstancedMesh` (~720 units) for silky 60fps performance.
  - Stepped earthen/stone rampart terraces with golden top rims and sculpted Kurukshetra dunes.
  - Stormy indigo and burnt-amber dusk sky with slanting volumetric sunbeams, central golden beacon beam, floating embers, and waving banners.
  - Bloom post-processing via Three.js `UnrealBloomPass`.

- **Ornate Vedic Royal War Chariot (*Divya Suvarna Ratha*):**
  - 16-spoked sacred *Chakra* wheels with stepped golden rims and conical axle hubs.
  - Swept mythical *Garuda/Makara* prow with glowing ruby medallion.
  - Triple-tiered royal *Chattri* (umbrella) with *Kalasha* spire and fluttering crimson pennant (*Dhwaja*).
  - Two galloping armored war steeds with golden champrons and animated leg strides.

- **The Final Breath Stand (*Ratha-Chakra-Dhari Abhimanyu*):**
  - Shattered chariot wreckage tilted in the red dust with 24 struck Kaurava arrows and Abhimanyu's severed bow.
  - Iconic heroic stance: Abhimanyu raising and rapidly whirling the colossal 16-spoked solar battle wheel with blazing energy blades and expanding earth-shaking shockwave ripples (*Chakra-Kampa*).
  - Volumetric divine light pillar (*Atma-Jyoti*) ascending to heaven with swirling celestial flower petals (*Pushpa-Vrishti*) and ground lotus mandala.
  - Dynamic encirclement: The 8 Maharathis physically contract their circle with weapons drawn.

- **Vocal Shloka Narration & Cinematic Audio Ducking:**
  - Authentic Sanskrit Shlokas (*Drona Parva*) recited with acoustic battlefield reverberation across all 13 narrative frames.
  - Background score: *Hai Katha Sangram Ki* with automated studio ducking during shloka recitation.
  - Interactive UI with sound-wave visualizers, shloka toggles, and replay controls.

---

## 🛠️ Tech Stack

- **Three.js** — 3D scene rendering, procedural geometries, materials, instanced meshes, and post-processing bloom.
- **GSAP & ScrollTrigger** — Master scroll timeline tied to CatmullRomCurve3 camera spline.
- **Lenis** — Butter-smooth inertial scrolling.
- **Vite** — Lightning-fast development and build tooling.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/ayushpatil5408/Chakravyuh.git
cd Chakravyuh

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser. Scroll to begin the journey!

### Production Build

```bash
npm run build
npm run preview
```

---

## 📜 License & Attribution

Seven-ring layout, artistic interpretation, and Sanskrit verses reference the *Mahabharata (Drona Parva / Abhimanyu-Vadha Parva)*. Developed as an Indian Knowledge Systems (IKS) academic creative project.
