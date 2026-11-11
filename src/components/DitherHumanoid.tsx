import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * The Unitree G1 humanoid (from MuJoCo Menagerie, baked by scripts/build_humanoid_mesh.py)
 * drawn with the same 8x8 Bayer dither as the page background.
 *
 * The scene renders at one pixel per dither cell and is scaled up with nearest-neighbour
 * sampling. The upper body turns toward the cursor through the robot's real waist
 * yaw and pitch joints (the mesh origin is the waist pitch joint).
 */

const CELL = 2; // CSS px per dither cell
const MODEL_URL = `${process.env.PUBLIC_URL}/models/g1-bust.bin`;

// Joint limits in g1.xml are wider; these keep the motion calm.
const YAW_LIMIT = 0.55;
const PITCH_LIMIT = 0.16;

const DITHER_GLSL = `
const float bayer[64] = float[64](
  0.,48.,12.,60., 3.,51.,15.,63., 32.,16.,44.,28.,35.,19.,47.,31.,
  8.,56., 4.,52.,11.,59., 7.,55., 40.,24.,36.,20.,43.,27.,39.,23.,
  2.,50.,14.,62., 1.,49.,13.,61., 34.,18.,46.,30.,33.,17.,45.,29.,
  10.,58., 6.,54., 9.,57., 5.,53., 42.,26.,38.,22.,41.,25.,37.,21.);
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
// Same quantiser as the background dither: 4 levels per channel.
vec3 ditherQuantize(vec3 color) {
  vec2 cell = floor(gl_FragCoord.xy);
  float threshold = bayer[int(mod(cell.y, 8.0)) * 8 + int(mod(cell.x, 8.0))] / 64.0 - 0.25;
  color = clamp(color + threshold / 3.0 - 0.05, 0.0, 1.0);
  return floor(color * 3.0 + 0.5) / 3.0;
}
const vec3 TINT = vec3(0.52, 0.68, 1.0);
const vec3 SPARK = vec3(0.38, 0.65, 0.98);
`;

const bodyMaterial = (uniforms: Record<string, THREE.IUniform>) =>
  new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms,
    side: THREE.DoubleSide,
    vertexShader: `
      in float material;
      out vec3 vNormal;
      out vec3 vViewDir;
      out vec3 vLocal;
      out float vAlbedo;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vNormal = normalize(mat3(modelMatrix) * normal);
        vViewDir = normalize(cameraPosition - world.xyz);
        vLocal = position;
        vAlbedo = mix(0.28, 1.0, material);
        gl_Position = projectionMatrix * viewMatrix * world;
      }`,
    fragmentShader: `
      precision highp float;
      uniform float time;
      in vec3 vNormal;
      in vec3 vViewDir;
      in vec3 vLocal;
      in float vAlbedo;
      out vec4 outColor;
      ${DITHER_GLSL}
      void main() {
        vec3 n = normalize(vNormal);
        if (!gl_FrontFacing) n = -n;
        vec3 key = normalize(vec3(-0.55, 0.75, 0.6));
        vec3 rimDir = normalize(vec3(0.9, 0.3, -0.5));
        float diff = max(dot(n, key), 0.0);
        float facing = max(dot(n, vViewDir), 0.0);
        float rim = pow(1.0 - facing, 2.5) * (0.35 + 0.65 * max(dot(n, rimDir), 0.0));
        float spec = pow(max(dot(reflect(-key, n), vViewDir), 0.0), 24.0);
        float shade = vAlbedo * (0.06 + 0.65 * diff) + 0.4 * spec * vAlbedo + 0.9 * rim;

        // The torso fades and crumbles into the page below the chest.
        float fade = smoothstep(0.02, 0.2, vLocal.y);
        float crumble = smoothstep(0.2, 0.02, vLocal.y);
        if (hash(floor(gl_FragCoord.xy) + floor(time * 3.0) * 0.37) < crumble * 0.55) discard;

        outColor = vec4(ditherQuantize(TINT * shade * fade), 1.0); // opaque: an inky silhouette
      }`,
  });

const particleMaterial = (uniforms: Record<string, THREE.IUniform>) =>
  new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms,
    depthWrite: false,
    vertexShader: `
      uniform float time;
      in vec3 drift;
      in float seed;
      out float vLife;
      out float vSeed;
      void main() {
        float life = fract(time * (0.12 + 0.1 * seed) + seed * 7.0);
        vec3 p = position + drift * life * 0.16 + vec3(0.0, 0.04, 0.0) * life * life;
        vLife = life;
        vSeed = seed;
        gl_PointSize = 1.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: `
      precision highp float;
      in float vLife;
      in float vSeed;
      out vec4 outColor;
      ${DITHER_GLSL}
      void main() {
        if (hash(floor(gl_FragCoord.xy) + vSeed) < vLife * 0.9) discard; // thins out as it drifts
        vec3 color = vSeed > 0.9 ? SPARK : TINT * 0.7;
        outColor = vec4(ditherQuantize(color * (1.0 - vLife * 0.5)), 1.0);
      }`,
  });

/** Reads the binary written by scripts/build_humanoid_mesh.py. */
function parseModel(buffer: ArrayBuffer) {
  const [vertexCount, indexCount] = new Uint32Array(buffer, 0, 2);
  let offset = 8;
  const positions = new Float32Array(buffer, offset, vertexCount * 3);
  offset += vertexCount * 12;
  const materials = new Uint8Array(buffer, offset, vertexCount);
  offset += vertexCount + ((4 - (vertexCount % 4)) % 4);
  const indices = new Uint32Array(buffer, offset, indexCount);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('material', new THREE.BufferAttribute(materials, 1, true));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();
  return geometry;
}

/** Particles that peel off the surface, mostly from the far (viewer-right, back) side. */
function shedParticles(geometry: THREE.BufferGeometry, count: number) {
  const pos = geometry.getAttribute('position');
  const nrm = geometry.getAttribute('normal');
  const positions: number[] = [];
  const drifts: number[] = [];
  const seeds: number[] = [];
  for (let tries = 0; positions.length < count * 3 && tries < count * 40; tries++) {
    const i = Math.floor(Math.random() * pos.count);
    const x = pos.getX(i);
    const y = pos.getY(i);
    const nx = nrm.getX(i);
    const nz = nrm.getZ(i);
    const weight = Math.max(0, 0.25 + x * 3) * (nz < 0.3 ? 1 : 0.25) * (y > 0.12 ? 1 : 0.2);
    if (Math.random() > weight) continue;
    positions.push(x, y, pos.getZ(i));
    drifts.push(nx + 0.6, nrm.getY(i) * 0.5 + 0.25, nz - 0.4);
    seeds.push(Math.random());
  }
  const points = new THREE.BufferGeometry();
  points.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  points.setAttribute('drift', new THREE.Float32BufferAttribute(drifts, 3));
  points.setAttribute('seed', new THREE.Float32BufferAttribute(seeds, 1));
  return points;
}

const DitherHumanoid: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let disposeModel = () => {};

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    } catch {
      return; // No WebGL: the hero simply has no figure.
    }
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(20, 1, 0.1, 10);
    // Three-quarter portrait view of the chest and head.
    camera.position.set(0.55, 0.42, 1.35);
    camera.lookAt(0, 0.3, 0);

    const uniforms = { time: { value: 0 } };
    const yaw = new THREE.Group(); // waist_yaw_joint (z in MuJoCo, y here)
    const pitch = new THREE.Group(); // waist_pitch_joint (y in MuJoCo, x here)
    yaw.add(pitch);
    scene.add(yaw);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width / CELL));
      const h = Math.max(1, Math.round(rect.height / CELL));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const look = { x: -0.2, y: 0.02 };
    const goal = { ...look };
    let pointerSeen = false;
    let ready = false;

    const draw = (time: number) => {
      uniforms.time.value = time;
      yaw.rotation.y = look.x;
      // A faint sway, as if balancing.
      pitch.rotation.x = look.y + (reduceMotion ? 0 : 0.006 * Math.sin(time * 1.3));
      renderer.render(scene, camera);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width * 0.5)) / (window.innerWidth * 0.5);
      const dy = (event.clientY - (rect.top + rect.height * 0.3)) / (window.innerHeight * 0.5);
      goal.x = THREE.MathUtils.clamp(dx, -1, 1) * YAW_LIMIT;
      goal.y = THREE.MathUtils.clamp(dy, -1, 1) * PITCH_LIMIT;
      pointerSeen = true;
      if (reduceMotion && ready) {
        look.x = goal.x;
        look.y = goal.y;
        draw(0);
      }
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let frameId = 0;
    let visible = true;
    let last = performance.now();
    const start = last;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const time = (now - start) / 1000;
      if (!pointerSeen) {
        // No mouse (touch devices): look around slowly on its own.
        goal.x = -0.2 + 0.3 * Math.sin(time * 0.35);
        goal.y = 0.04 * Math.sin(time * 0.5);
      }
      const k = 1 - Math.exp(-dt * 3.5);
      look.x += (goal.x - look.x) * k;
      look.y += (goal.y - look.y) * k;
      draw(time);
      frameId = visible ? requestAnimationFrame(tick) : 0;
    };

    // Only animate while the hero is on screen.
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && ready && !reduceMotion && !frameId) {
        last = performance.now();
        frameId = requestAnimationFrame(tick);
      }
    });
    intersection.observe(canvas);

    fetch(MODEL_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load ${MODEL_URL}`);
        return response.arrayBuffer();
      })
      .then((buffer) => {
        if (disposed) return;
        const geometry = parseModel(buffer);
        const body = new THREE.Mesh(geometry, bodyMaterial(uniforms));
        const particles = new THREE.Points(shedParticles(geometry, 1400), particleMaterial(uniforms));
        pitch.add(body, particles);
        ready = true;
        if (reduceMotion) draw(0);
        else if (visible) frameId = requestAnimationFrame(tick);

        disposeModel = () => {
          geometry.dispose();
          particles.geometry.dispose();
          body.material.dispose();
          particles.material.dispose();
        };
      })
      .catch((error) => console.warn(error));

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      intersection.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      disposeModel();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={`block [image-rendering:pixelated] ${className}`} aria-hidden="true" />;
};

export default DitherHumanoid;
