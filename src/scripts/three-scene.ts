import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement | null;
if (!canvas) throw new Error('Background canvas not found');

const isSmall = window.innerWidth < 768;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0a0a, 0.028);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 18);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance',
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall ? 1.5 : 2));
renderer.setClearColor(0x0a0a0a, 1);

// Bloom post-processing makes the cyan wireframes/particles glow. Skipped on
// small screens to stay light (plain render there).
let composer: EffectComposer | null = null;
if (!isSmall) {
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(
    new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.85, // strength
      0.55, // radius
      0.12 // threshold — only the brighter cyan blooms, not the dark bg
    )
  );
}

// Bloom only suits the dark theme (on a light background it would bloom the
// background itself). Toggled by applyTheme().
let useBloom = !isSmall;
// Tracks the active theme so effects (e.g. the click ripple) can adapt their
// blending — additive glow reads on dark, normal blending reads on light.
let isLightTheme = false;

const accentColor = new THREE.Color(0x00e5ff);
const dimColor = new THREE.Color(0x33ecff);

// Whole scene lives in `field` so it can drift/rotate as a unit.
const field = new THREE.Group();
scene.add(field);

// ----- Planets (camera focus targets) ---------------------------------------

interface Planet {
  group: THREE.Group;
  spin: THREE.Vector3;
  floatSpeed: number;
  floatAmp: number;
  baseY: number;
  pulse: number;
}

const planets: Planet[] = [];

function createPlanet(
  radius: number,
  detail: number,
  position: THREE.Vector3,
  lineOpacity: number
): void {
  const geo = new THREE.IcosahedronGeometry(radius, detail);
  const edges = new THREE.EdgesGeometry(geo, 1);
  const wire = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({
      color: accentColor,
      transparent: true,
      opacity: lineOpacity,
    })
  );
  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({
      color: accentColor,
      wireframe: true,
      transparent: true,
      opacity: lineOpacity * 0.12,
    })
  );
  const group = new THREE.Group();
  group.add(wire);
  group.add(mesh);
  group.position.copy(position);
  field.add(group);

  planets.push({
    group,
    spin: new THREE.Vector3(
      (Math.random() - 0.5) * 0.06,
      0.04 + Math.random() * 0.05,
      0
    ),
    floatSpeed: 0.3 + Math.random() * 0.4,
    floatAmp: 0.4 + Math.random() * 0.6,
    baseY: position.y,
    pulse: 0,
  });
}

// A Saturn-like ringed planet: wireframe body + tilted concentric rings.
function createSaturn(position: THREE.Vector3): void {
  const group = new THREE.Group();
  const radius = 1.6;

  const geo = new THREE.IcosahedronGeometry(radius, 1);
  const wire = new THREE.LineSegments(
    new THREE.EdgesGeometry(geo, 1),
    new THREE.LineBasicMaterial({
      color: accentColor,
      transparent: true,
      opacity: 0.34,
    })
  );
  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({
      color: accentColor,
      wireframe: true,
      transparent: true,
      opacity: 0.05,
    })
  );
  group.add(wire);
  group.add(mesh);

  const rings = new THREE.Group();
  const radii = [radius * 1.5, radius * 1.75, radius * 2.0, radius * 2.25];
  radii.forEach((rr, i) => {
    const pts: THREE.Vector3[] = [];
    const seg = 100;
    for (let j = 0; j <= seg; j++) {
      const a = (j / seg) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * rr, 0, Math.sin(a) * rr));
    }
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({
        color: accentColor,
        transparent: true,
        opacity: 0.42 - i * 0.06,
      })
    );
    rings.add(line);
  });
  // Tilt the flat rings for the classic Saturn ellipse.
  rings.rotation.x = 1.15;
  rings.rotation.z = 0.32;
  group.add(rings);

  group.position.copy(position);
  field.add(group);

  planets.push({
    group,
    spin: new THREE.Vector3(0, 0.05, 0),
    floatSpeed: 0.25,
    floatAmp: 0.45,
    baseY: position.y,
    pulse: 0,
  });
}

createPlanet(2.4, 1, new THREE.Vector3(9, 1, -2), 0.4);
createPlanet(1.3, 1, new THREE.Vector3(-9, 4, -8), 0.26);
createPlanet(0.9, 0, new THREE.Vector3(6, -6, -12), 0.24);
createSaturn(new THREE.Vector3(-13, -3, -4));

// ----- Mini asteroids (ambient drifting movement) ---------------------------

function makeAsteroidGeometry(detail: number): THREE.IcosahedronGeometry {
  const geo = new THREE.IcosahedronGeometry(1, detail);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    v.multiplyScalar(1 + (Math.random() - 0.5) * 0.6);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

interface Asteroid {
  group: THREE.Group;
  velocity: THREE.Vector3;
  speed: number;
  rotationSpeed: THREE.Vector3;
}

const asteroids: Asteroid[] = [];
const ASTEROID_COUNT = isSmall ? 10 : 18;
const BOUND = 34;

function resetAsteroidPath(a: Asteroid): void {
  const start = new THREE.Vector3()
    .randomDirection()
    .multiplyScalar(26 + Math.random() * 8);
  const target = new THREE.Vector3(
    (Math.random() - 0.5) * 16,
    (Math.random() - 0.5) * 16,
    (Math.random() - 0.5) * 16
  );
  a.group.position.copy(start);
  a.velocity.copy(target).sub(start).normalize().multiplyScalar(a.speed);
}

function createAsteroid(): void {
  const detail = Math.random() > 0.6 ? 1 : 0;
  const geo = makeAsteroidGeometry(detail);
  const edgesGeo = new THREE.EdgesGeometry(geo, 18);
  const bright = Math.random() > 0.5;
  const wire = new THREE.LineSegments(
    edgesGeo,
    new THREE.LineBasicMaterial({
      color: bright ? accentColor : dimColor,
      transparent: true,
      opacity: bright ? 0.8 : 0.45,
    })
  );
  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({
      color: accentColor,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    })
  );
  const visualScale = 0.07 + Math.random() * 0.11;
  wire.scale.setScalar(visualScale);
  mesh.scale.setScalar(visualScale);

  const group = new THREE.Group();
  group.add(wire);
  group.add(mesh);
  field.add(group);

  const asteroid: Asteroid = {
    group,
    velocity: new THREE.Vector3(),
    speed: 2 + Math.random() * 4,
    rotationSpeed: new THREE.Vector3(
      (Math.random() - 0.5) * 0.05,
      (Math.random() - 0.5) * 0.05,
      (Math.random() - 0.5) * 0.05
    ),
  };
  resetAsteroidPath(asteroid);
  asteroid.group.position.addScaledVector(asteroid.velocity, Math.random() * 6);
  asteroids.push(asteroid);
}

for (let i = 0; i < ASTEROID_COUNT; i++) createAsteroid();

// ----- Particle starfield ---------------------------------------------------

const particleCount = isSmall ? 250 : 450;
const particlePositions = new Float32Array(particleCount * 3);
const particleSpeeds: number[] = [];
for (let i = 0; i < particleCount; i++) {
  particlePositions[i * 3] = (Math.random() - 0.5) * 50;
  particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 50;
  particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 50;
  particleSpeeds.push(0.002 + Math.random() * 0.008);
}
const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute(
  'position',
  new THREE.BufferAttribute(particlePositions, 3)
);
const particles = new THREE.Points(
  particleGeo,
  new THREE.PointsMaterial({
    color: accentColor,
    size: 0.04,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
  })
);
field.add(particles);

// ----- Scroll-driven camera choreography ------------------------------------

// One camera stop per section: the camera flies between these as you scroll,
// zooming and re-aiming so a different planet/region is the focus each time.
const SECTION_IDS = [
  'hero',
  'about',
  'skills',
  'experience',
  'projects',
  'certifications',
  'contact',
];

interface CamStop {
  pos: THREE.Vector3;
  look: THREE.Vector3;
}

const camStops: CamStop[] = [
  { pos: new THREE.Vector3(0, 0, 18), look: new THREE.Vector3(0, 0, 0) },
  { pos: new THREE.Vector3(-6, 3, 8), look: new THREE.Vector3(-9, 4, -8) },
  { pos: new THREE.Vector3(6, 1, 12), look: new THREE.Vector3(2, 0, -2) },
  { pos: new THREE.Vector3(9, -3, 2), look: new THREE.Vector3(6, -6, -12) },
  { pos: new THREE.Vector3(-2, 7, 12), look: new THREE.Vector3(0, 1, -4) },
  { pos: new THREE.Vector3(-7, -3, 9), look: new THREE.Vector3(-3, -1, -5) },
  { pos: new THREE.Vector3(0, 0, 22), look: new THREE.Vector3(0, 0, 0) },
];

let anchors: number[] = [];
let lastDocHeight = -1;

function computeAnchors(): void {
  const max = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const els = SECTION_IDS.map((id) => document.getElementById(id));
  if (els.some((el) => !el)) {
    anchors = SECTION_IDS.map((_, i) => (max * i) / (SECTION_IDS.length - 1));
    return;
  }
  anchors = els.map(
    (el) => (el as HTMLElement).getBoundingClientRect().top + window.scrollY
  );
}

function smoothstep(t: number): number {
  const c = Math.min(Math.max(t, 0), 1);
  return c * c * (3 - 2 * c);
}

const desiredPos = new THREE.Vector3(0, 0, 18);
const desiredLook = new THREE.Vector3(0, 0, 0);
const currentLook = new THREE.Vector3(0, 0, 0);

function updateCameraTargets(): void {
  const sy = window.scrollY;
  let i = 0;
  while (i < anchors.length - 2 && sy >= anchors[i + 1]) i++;
  const a0 = camStops[Math.min(i, camStops.length - 1)];
  const a1 = camStops[Math.min(i + 1, camStops.length - 1)];
  const start = anchors[i] ?? 0;
  const end = anchors[i + 1] ?? start + 1;
  const f = smoothstep(end > start ? (sy - start) / (end - start) : 0);
  desiredPos.lerpVectors(a0.pos, a1.pos, f);
  desiredLook.lerpVectors(a0.look, a1.look, f);
}

// ----- Mouse parallax -------------------------------------------------------

const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// ----- Hero interaction: click sends a shockwave ripple into the scene -------

const raycaster = new THREE.Raycaster();
const clickPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

interface Ripple {
  ring: THREE.Line;
  geo: THREE.BufferGeometry;
  mat: THREE.LineBasicMaterial;
  life: number;
  maxLife: number;
}
const ripples: Ripple[] = [];

function spawnRipple(point: THREE.Vector3): void {
  const pts: THREE.Vector3[] = [];
  const seg = 64;
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * 0.3, Math.sin(a) * 0.3, 0));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({
    color: accentColor,
    transparent: true,
    opacity: 0.9,
    blending: isLightTheme ? THREE.NormalBlending : THREE.AdditiveBlending,
    depthWrite: false,
  });
  const ring = new THREE.Line(geo, mat);
  ring.position.copy(point);
  ring.lookAt(camera.position);
  scene.add(ring);
  ripples.push({ ring, geo, mat, life: 0, maxLife: 1.1 });
}

// Shove asteroids outward and pulse nearby planets from the click point.
function applyShock(worldPoint: THREE.Vector3): void {
  const local = field.worldToLocal(worldPoint.clone());
  const R = 16;
  const dir = new THREE.Vector3();
  for (const a of asteroids) {
    const d = a.group.position.distanceTo(local);
    if (d < R) {
      dir.copy(a.group.position).sub(local).normalize();
      a.velocity.addScaledVector(dir, (1 - d / R) * 7);
    }
  }
  for (const p of planets) {
    if (p.group.position.distanceTo(local) < R * 1.5) p.pulse = 1;
  }
}

const heroEl = document.getElementById('hero');
heroEl?.addEventListener('click', (e) => {
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
  const point = new THREE.Vector3();
  if (raycaster.ray.intersectPlane(clickPlane, point)) {
    spawnRipple(point);
    applyShock(point);
  }
});

// ----- Animation loop -------------------------------------------------------

const clock = new THREE.Clock();
let prevTime = 0;
let ambientY = 0;
let visible = !document.hidden;

document.addEventListener('visibilitychange', () => {
  visible = !document.hidden;
});

function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();
  if (!visible) {
    prevTime = elapsed;
    return;
  }
  const dt = Math.min(elapsed - prevTime, 0.05);
  prevTime = elapsed;

  // Refresh section anchors whenever the document height changes (e.g. after
  // ScrollTrigger lays out, fonts load, or the window resizes).
  const dh = document.documentElement.scrollHeight;
  if (dh !== lastDocHeight) {
    lastDocHeight = dh;
    computeAnchors();
  }

  // Subtly shift the whole scene's hue as you scroll down — each section feels
  // like a slightly different "world". Cheap (CSS filter on the canvas).
  const maxScroll = Math.max(1, dh - window.innerHeight);
  const pageP = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
  (canvas as HTMLCanvasElement).style.filter = `hue-rotate(${(pageP * 55).toFixed(1)}deg)`;

  updateCameraTargets();

  // Ease the camera toward the scroll target, plus mouse parallax + idle bob.
  const idle = Math.sin(elapsed * 0.25) * 0.25;
  camera.position.x += (desiredPos.x + mouse.x * 1.4 - camera.position.x) * 0.045;
  camera.position.y +=
    (desiredPos.y + mouse.y * 1.0 + idle - camera.position.y) * 0.045;
  camera.position.z += (desiredPos.z - camera.position.z) * 0.045;
  currentLook.lerp(desiredLook, 0.045);
  camera.lookAt(currentLook);

  // Ambient drift + interactive tilt: the whole field leans toward the cursor.
  ambientY += dt * 0.01;
  field.rotation.y = ambientY + mouse.x * 0.18;
  field.rotation.x += (mouse.y * 0.12 - field.rotation.x) * 0.05;

  // Expand + fade click ripples.
  for (let i = ripples.length - 1; i >= 0; i--) {
    const rp = ripples[i];
    rp.life += dt;
    const t = rp.life / rp.maxLife;
    rp.ring.scale.setScalar(1 + t * 9);
    rp.mat.opacity = Math.max(0, 0.9 * (1 - t));
    if (rp.life >= rp.maxLife) {
      scene.remove(rp.ring);
      rp.geo.dispose();
      rp.mat.dispose();
      ripples.splice(i, 1);
    }
  }

  for (const planet of planets) {
    planet.group.rotation.x += planet.spin.x * dt;
    planet.group.rotation.y += planet.spin.y * dt;
    planet.group.position.y =
      planet.baseY + Math.sin(elapsed * planet.floatSpeed) * planet.floatAmp;
    // Shockwave pulse — quick scale bump that decays back.
    planet.group.scale.setScalar(1 + planet.pulse * 0.25);
    planet.pulse *= 0.9;
  }

  for (const a of asteroids) {
    a.group.position.addScaledVector(a.velocity, dt);
    a.group.rotation.x += a.rotationSpeed.x;
    a.group.rotation.y += a.rotationSpeed.y;
    a.group.rotation.z += a.rotationSpeed.z;
    if (a.group.position.length() > BOUND) resetAsteroidPath(a);
  }

  const posArray = particleGeo.attributes.position.array as Float32Array;
  for (let i = 0; i < particleCount; i++) {
    posArray[i * 3 + 1] += particleSpeeds[i];
    if (posArray[i * 3 + 1] > 25) posArray[i * 3 + 1] = -25;
  }
  particleGeo.attributes.position.needsUpdate = true;

  if (useBloom && composer) composer.render();
  else renderer.render(scene, camera);
}

// Recolor the whole scene + background for the active theme.
function applyTheme(theme: string): void {
  const light = theme === 'light';
  isLightTheme = light;
  const bgHex = light ? 0xeef1f5 : 0x0a0a0a;
  // Light scene uses a darker, stronger teal so the wireframes read against the
  // light background and show through the translucent section veils.
  accentColor.set(light ? 0x00697d : 0x00e5ff);
  dimColor.set(light ? 0x1a8499 : 0x33ecff);
  renderer.setClearColor(bgHex, 1);
  (scene.fog as THREE.FogExp2).color.setHex(bgHex);

  scene.traverse((obj) => {
    const mat = (obj as THREE.Mesh).material as
      | THREE.Material
      | THREE.Material[]
      | undefined;
    if (!mat) return;
    const list = Array.isArray(mat) ? mat : [mat];
    list.forEach((m) => {
      const cm = m as THREE.MeshBasicMaterial & {
        userData: { baseOpacity?: number };
      };
      if (cm.color) cm.color.copy(accentColor);
      // There's no bloom in light mode, so boost opacity to keep the scene
      // visible. Remember each material's base so dark mode restores exactly.
      if (cm.userData.baseOpacity === undefined) {
        cm.userData.baseOpacity = cm.opacity;
      }
      cm.opacity = Math.min(1, cm.userData.baseOpacity * (light ? 1.9 : 1));
    });
  });

  useBloom = !light && !isSmall;
}

applyTheme(document.documentElement.dataset.theme || 'dark');
window.addEventListener('themechange', (e) => {
  applyTheme((e as CustomEvent<string>).detail || 'dark');
});

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer?.setSize(window.innerWidth, window.innerHeight);
  computeAnchors();
});
