import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface ModelViewerProps {
  url: string;
  format: 'stl' | 'glb';
  /** Material color for STL files (they carry no color of their own). */
  color?: string;
  /** Optional note shown in the corner, e.g. to flag a placeholder model. */
  caption?: string;
  title: string;
}

/**
 * Small interactive viewer for a project's CAD model. Drag to rotate; it slowly
 * auto-rotates until touched. Zoom and pan are off so the page still scrolls
 * normally with the mouse wheel.
 */
const ModelViewer: React.FC<ModelViewerProps> = ({ url, format, color = '#9ca3af', caption, title }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';

    scene.add(new THREE.HemisphereLight(0xffffff, 0x1e293b, 1.6));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x3b82f6, 1.2);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    controls.autoRotateSpeed = 1.2;
    const stopAutoRotate = () => {
      controls.autoRotate = false;
    };
    controls.addEventListener('start', stopAutoRotate);

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight, false);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    // Center the model and frame it so it fills the view regardless of its units (mm vs m).
    const frame = (object: THREE.Object3D) => {
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      object.position.sub(center);
      const radius = size.length() / 2 || 1;
      const distance = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2));
      camera.position.set(distance * 0.6, distance * 0.45, distance * 0.75);
      camera.near = distance / 100;
      camera.far = distance * 10;
      camera.updateProjectionMatrix();
      controls.target.set(0, 0, 0);
      controls.update();
      scene.add(object);
      setStatus('ready');
    };

    let disposed = false;
    const onError = () => !disposed && setStatus('error');

    if (format === 'stl') {
      new STLLoader().load(
        url,
        (geometry) => {
          if (disposed) return;
          geometry.computeVertexNormals();
          const material = new THREE.MeshStandardMaterial({ color, metalness: 0.25, roughness: 0.55 });
          const mesh = new THREE.Mesh(geometry, material);
          // SolidWorks STL exports are Z-up; three.js is Y-up.
          mesh.rotation.x = -Math.PI / 2;
          const group = new THREE.Group();
          group.add(mesh);
          frame(group);
        },
        undefined,
        onError
      );
    } else {
      new GLTFLoader().load(url, (gltf) => !disposed && frame(gltf.scene), undefined, onError);
    }

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', stopAutoRotate);
      controls.dispose();
      scene.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.geometry.dispose();
          const materials = Array.isArray(node.material) ? node.material : [node.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [url, format, color]);

  return (
    <div className="relative w-full h-72 lg:h-[420px]">
      <div ref={containerRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" aria-label={`3D model of ${title}`} role="img" />
      {status === 'loading' && (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-muted">Loading 3D model…</p>
      )}
      {status === 'error' && (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-muted">Couldn&apos;t load the 3D model.</p>
      )}
      {caption && status === 'ready' && (
        <p className="award-pill pointer-events-none absolute top-3 left-3">
          {caption}
        </p>
      )}
      {status === 'ready' && (
        <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-body">
          Drag to rotate
        </p>
      )}
    </div>
  );
};

export default ModelViewer;
