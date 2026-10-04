import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement | null;
if (!canvas) throw new Error('Background canvas not found');

const isSmall = window.innerWidth < 768;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0b1426, 0.028);

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
renderer.setClearColor(0x0b1426, 1);

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
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const accentColor = new THREE.Color(0xe8112d);
const dimColor = new THREE.Color(0xf0586b);

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
  homeX: number;
  homeZ: number;
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
    homeX: position.x,
    homeZ: position.z,
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
    homeX: position.x,
    homeZ: position.z,
    pulse: 0,
  });
}

createPlanet(2.4, 1, new THREE.Vector3(9, 1, -2), 0.4);
createPlanet(1.3, 1, new THREE.Vector3(-9, 4, -8), 0.26);
createPlanet(0.9, 0, new THREE.Vector3(6, -6, -12), 0.24);
createSaturn(new THREE.Vector3(-13, -3, -4));

// ----- Black hole finale (fades in near the Contact section) ----------------

interface BlackHole {
  group: THREE.Group;
  disk: THREE.Group;
  fade: { mat: THREE.Material; base: number }[];
}
let blackHole: BlackHole | null = null;

function createBlackHole(): void {
  const group = new THREE.Group();
  const fade: { mat: THREE.Material; base: number }[] = [];

  // Event horizon — a near-black sphere (kept dark; excluded from theme tint).
  const ehMat = new THREE.MeshBasicMaterial({
    color: 0x05070a,
    transparent: true,
    opacity: 0,
  });
  ehMat.userData.noTheme = true;
  group.add(new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), ehMat));
  fade.push({ mat: ehMat, base: 1 });

  // Photon ring hugging the horizon.
  const photonMat = new THREE.MeshBasicMaterial({
    color: accentColor,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  photonMat.userData.noTheme = true;
  group.add(
    new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.04, 16, 120), photonMat)
  );
  fade.push({ mat: photonMat, base: 0.95 });

  // Accretion disk — concentric glowing rings, tilted.
  const disk = new THREE.Group();
  [2.5, 3.0, 3.6, 4.3, 5.1].forEach((r, i) => {
    const pts: THREE.Vector3[] = [];
    const seg = 120;
    for (let j = 0; j <= seg; j++) {
      const a = (j / seg) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
    }
    const m = new THREE.LineBasicMaterial({
      color: accentColor,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    m.userData.noTheme = true;
    disk.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), m));
    fade.push({ mat: m, base: 0.5 - i * 0.06 });
  });
  disk.rotation.x = 1.35;
  disk.rotation.z = 0.2;
  group.add(disk);

  group.scale.setScalar(0.001);
  scene.add(group);
  blackHole = { group, disk, fade };
}
createBlackHole();

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
  { pos: new THREE.Vector3(0, 1.5, 13), look: new THREE.Vector3(0, 0, 0) },
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
let pointerActive = false;
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  pointerActive = true;
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

// Reusable vectors for the per-frame cursor-gravity raycast.
const mouseVec = new THREE.Vector2();
const cursorWorld = new THREE.Vector3();
const cursorLocal = new THREE.Vector3();
const gravDir = new THREE.Vector3();

// ----- Comets / shooting stars ----------------------------------------------

interface Comet {
  line: THREE.Line;
  geo: THREE.BufferGeometry;
  mat: THREE.LineBasicMaterial;
  vel: THREE.Vector3;
  dir: THREE.Vector3;
  trail: number;
  head: THREE.Vector3;
  life: number;
  maxLife: number;
}
const comets: Comet[] = [];
let cometTimer = 0;
let nextComet = 2.5;

function spawnComet(): void {
  const dir = new THREE.Vector3(
    (Math.random() - 0.5) * 1.3,
    -1,
    (Math.random() - 0.5) * 0.6
  ).normalize();
  const head = new THREE.Vector3(
    (Math.random() - 0.5) * 44,
    14 + Math.random() * 10,
    (Math.random() - 0.5) * 24
  );
  const trail = 3 + Math.random() * 2.5;
  const tail = head.clone().addScaledVector(dir, -trail);
  const geo = new THREE.BufferGeometry().setFromPoints([tail, head]);
  const mat = new THREE.LineBasicMaterial({
    color: accentColor,
    transparent: true,
    opacity: 0,
    blending: isLightTheme ? THREE.NormalBlending : THREE.AdditiveBlending,
    depthWrite: false,
  });
  const line = new THREE.Line(geo, mat);
  scene.add(line);
  comets.push({
    line,
    geo,
    mat,
    vel: dir.clone().multiplyScalar(22 + Math.random() * 16),
    dir,
    trail,
    head,
    life: 0,
    maxLife: 1.8,
  });
}

// ----- Warp-in intro: camera flies out of hyperspace on reveal --------------

let introActive = false;
let introT = 0;
const INTRO_DUR = 1.7;
const introStartPos = new THREE.Vector3(0, 0, 80);

window.addEventListener('app:reveal', () => {
  if (reduceMotion) return;
  introActive = true;
  introT = 0;
  camera.position.copy(introStartPos);
});

// ----- Animation loop -------------------------------------------------------

const clock = new THREE.Clock();
let prevTime = 0;
let ambientY = 0;
let lastScrollY = 0;
let scrollVelSmooth = 0;
let bhTime = 0;
let visible = !document.hidden;

document.addEventListener('visibilitychange', () => {
  visible = !document.hidden;
});

function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();
  if (!visible) {
    prevTime = elapsed;
    lastScrollY = window.scrollY;
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

  // Page scroll progress (drives the black-hole finale below).
  const maxScroll = Math.max(1, dh - window.innerHeight);
  const pageP = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);

  // Scroll-velocity "wake" — the field streaks faster the harder you scroll and
  // eases back to rest when you stop, so navigation feels physical.
  const sv = Math.abs(window.scrollY - lastScrollY);
  lastScrollY = window.scrollY;
  scrollVelSmooth += (sv - scrollVelSmooth) * 0.15;
  const scrollWarp = 1 + Math.min(scrollVelSmooth * 0.18, 7);

  updateCameraTargets();

  // Warp factor streaks the asteroids/particles during the intro fly-in.
  let warpFactor = 1;

  if (introActive) {
    // Fly out of hyperspace: dolly from deep space into the hero framing.
    introT += dt / INTRO_DUR;
    const e = 1 - Math.pow(1 - Math.min(introT, 1), 3); // easeOutCubic
    camera.position.lerpVectors(introStartPos, desiredPos, e);
    currentLook.lerp(desiredLook, 0.12);
    camera.lookAt(currentLook);
    warpFactor = 1 + (1 - e) * 12;
    if (introT >= 1) introActive = false;
  } else {
    // Ease the camera toward the scroll target, plus mouse parallax + idle bob.
    const idle = Math.sin(elapsed * 0.25) * 0.25;
    camera.position.x +=
      (desiredPos.x + mouse.x * 1.4 - camera.position.x) * 0.045;
    camera.position.y +=
      (desiredPos.y + mouse.y * 1.0 + idle - camera.position.y) * 0.045;
    camera.position.z += (desiredPos.z - camera.position.z) * 0.045;
    currentLook.lerp(desiredLook, 0.045);
    camera.lookAt(currentLook);
  }

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

  // Black hole is a timed sequence once you reach the end: it appears + grows
  // (bhAppear), then begins pulling planets and asteroids in (consume). Winds
  // back down if you scroll away from the end.
  const atEnd = pageP > 0.9;
  // Cap at just past full consumption (~4.5s) so there's no long "drain" on
  // reversal, and wind down quickly — the smoothstep keeps it smooth.
  bhTime = atEnd
    ? Math.min(bhTime + dt, 4.8)
    : Math.max(0, bhTime - dt * 5);
  const bhAppear = smoothstep(bhTime / 1.3);
  const consume = smoothstep((bhTime - 1.5) / 3);

  for (const planet of planets) {
    // Once the hole starts consuming, planets are dragged in — tumbling faster,
    // pulled toward the core, and shrinking away. Reversible.
    const spinMul = 1 + consume * 6;
    planet.group.rotation.x += planet.spin.x * dt * spinMul;
    planet.group.rotation.y += planet.spin.y * dt * spinMul;
    const homeY =
      planet.baseY + Math.sin(elapsed * planet.floatSpeed) * planet.floatAmp;
    const pull = consume * 0.92;
    planet.group.position.set(
      planet.homeX * (1 - pull),
      homeY * (1 - pull),
      planet.homeZ * (1 - pull)
    );
    const s = (1 + planet.pulse * 0.25) * (1 - consume);
    planet.group.scale.setScalar(Math.max(0, s));
    planet.pulse *= 0.9;
  }

  // Cursor gravity — project the pointer onto the scene plane so asteroids
  // near it get nudged away (a force field that follows the cursor).
  let cursorHit = false;
  if (pointerActive) {
    mouseVec.set(mouse.x, mouse.y);
    raycaster.setFromCamera(mouseVec, camera);
    if (raycaster.ray.intersectPlane(clickPlane, cursorWorld)) {
      cursorLocal.copy(cursorWorld);
      field.worldToLocal(cursorLocal);
      cursorHit = true;
    }
  }
  const GRAV_R = 8;

  for (const a of asteroids) {
    const p = a.group.position;
    // Normal drift (eased down as the black hole takes over).
    p.addScaledVector(
      a.velocity,
      dt * warpFactor * scrollWarp * (1 - consume * 0.6)
    );
    a.group.rotation.x += a.rotationSpeed.x;
    a.group.rotation.y += a.rotationSpeed.y;
    a.group.rotation.z += a.rotationSpeed.z;
    if (cursorHit) {
      const gd = p.distanceTo(cursorLocal);
      if (gd < GRAV_R && gd > 0.001) {
        gravDir.copy(p).sub(cursorLocal).normalize();
        p.addScaledVector(gravDir, (1 - gd / GRAV_R) * 6 * dt);
      }
    }

    // Black hole: spiral inward, then get consumed at the core and re-feed.
    if (consume > 0.02) {
      const dist = p.length();
      if (dist < 2.1) {
        resetAsteroidPath(a);
      } else {
        const step = Math.min(dist - 2, consume * (0.8 + 9 / dist) * dt);
        p.multiplyScalar(1 - step / dist);
        const swirl = consume * (0.4 + 3 / dist) * dt;
        const cos = Math.cos(swirl);
        const sin = Math.sin(swirl);
        const nx = p.x * cos - p.z * sin;
        const nz = p.x * sin + p.z * cos;
        p.x = nx;
        p.z = nz;
      }
    }

    // Shrink toward nothing as it nears the core; full size out in the field.
    const shrink = Math.min(1, Math.max(0, (p.length() - 2) / 6));
    a.group.scale.setScalar(1 - consume * (1 - shrink));

    if (p.length() > BOUND) resetAsteroidPath(a);
  }

  const posArray = particleGeo.attributes.position.array as Float32Array;
  for (let i = 0; i < particleCount; i++) {
    posArray[i * 3 + 1] += particleSpeeds[i] * warpFactor * scrollWarp;
    if (posArray[i * 3 + 1] > 25) posArray[i * 3 + 1] = -25;
  }
  particleGeo.attributes.position.needsUpdate = true;

  // Comets — spawn on a timer and streak across, fading in then out.
  cometTimer += dt;
  if (!reduceMotion && cometTimer > nextComet) {
    cometTimer = 0;
    nextComet = 4 + Math.random() * 6;
    spawnComet();
  }
  for (let i = comets.length - 1; i >= 0; i--) {
    const c = comets[i];
    c.life += dt;
    c.head.addScaledVector(c.vel, dt);
    const cp = c.geo.attributes.position.array as Float32Array;
    cp[0] = c.head.x - c.dir.x * c.trail;
    cp[1] = c.head.y - c.dir.y * c.trail;
    cp[2] = c.head.z - c.dir.z * c.trail;
    cp[3] = c.head.x;
    cp[4] = c.head.y;
    cp[5] = c.head.z;
    c.geo.attributes.position.needsUpdate = true;
    const t = c.life / c.maxLife;
    c.mat.opacity = 0.9 * Math.min(t / 0.15, 1) * (1 - t);
    if (c.life >= c.maxLife) {
      scene.remove(c.line);
      c.geo.dispose();
      c.mat.dispose();
      comets.splice(i, 1);
    }
  }

  // Black hole finale — appears + grows at the end, then spins up as it eats.
  if (blackHole) {
    // Fully hide the black hole unless the finale is actually playing.
    blackHole.group.visible = bhAppear > 0.01;
    for (const f of blackHole.fade) f.mat.opacity = f.base * bhAppear;
    blackHole.group.scale.setScalar(0.001 + bhAppear * 1.05 + consume * 0.35);
    blackHole.disk.rotation.z += dt * (0.15 + consume * 0.5);
  }

  if (useBloom && composer) composer.render();
  else renderer.render(scene, camera);
}

// Recolor the whole scene + background for the active theme.
function applyTheme(theme: string): void {
  const light = theme === 'light';
  isLightTheme = light;
  // Colours come from the CSS tokens (--scene-bg / --scene-accent) so the 3D
  // background always matches the site palette. Light mode uses a darker
  // accent so the wireframes read against the light background.
  const css = getComputedStyle(document.documentElement);
  const bg = new THREE.Color(css.getPropertyValue('--scene-bg').trim() || (light ? '#f2f0ea' : '#0b1426'));
  accentColor.set(css.getPropertyValue('--scene-accent').trim() || (light ? '#1d3461' : '#e8112d'));
  dimColor.copy(accentColor).lerp(new THREE.Color(light ? 0x000000 : 0xffffff), 0.25);
  renderer.setClearColor(bg, 1);
  (scene.fog as THREE.FogExp2).color.copy(bg);

  scene.traverse((obj) => {
    const mat = (obj as THREE.Mesh).material as
      | THREE.Material
      | THREE.Material[]
      | undefined;
    if (!mat) return;
    const list = Array.isArray(mat) ? mat : [mat];
    list.forEach((m) => {
      const cm = m as THREE.MeshBasicMaterial & {
        userData: { baseOpacity?: number; noTheme?: boolean };
      };
      // Black-hole materials manage their own color/opacity (scroll-driven).
      if (cm.userData.noTheme) return;
      if (cm.color) cm.color.copy(accentColor);
      // There's no bloom in light mode, so boost opacity to keep the scene
      // visible. Remember each material's base so dark mode restores exactly.
      if (cm.userData.baseOpacity === undefined) {
        cm.userData.baseOpacity = cm.opacity;
      }
      cm.opacity = Math.min(1, cm.userData.baseOpacity * (light ? 1.9 : 1));
    });
  });

  // Bloom disabled for now (removes the bright "glare" over the hero field).
  // To re-enable: useBloom = !light && !isSmall;
  useBloom = false;
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
