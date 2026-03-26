import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function ShardCubes3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(false);
  const splitRef = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = 280;
    const H = 200;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 2, 7);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(3, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x334466, 0.8));

    const colors = [0x3b82f6, 0x06b6d4, 0x8b5cf6, 0x14b8a6];
    const positions = [
      [-0.8, 0.8, 0],
      [0.8, 0.8, 0],
      [-0.8, -0.8, 0],
      [0.8, -0.8, 0],
    ];
    const splitPos = [
      [-1.8, 1.8, 0.5],
      [1.8, 1.8, -0.5],
      [-1.8, -1.8, -0.5],
      [1.8, -1.8, 0.5],
    ];

    const cubes = colors.map((color, i) => {
      const geo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
      const mat = new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.15,
        transparent: true,
        opacity: 0.9,
        shininess: 80,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const [x, y, z] = positions[i];
      mesh.position.set(x, y, z);
      scene.add(mesh);
      return mesh;
    });

    let t = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.01;
      const isSplit = splitRef.current;

      cubes.forEach((cube, i) => {
        const target = isSplit ? splitPos[i] : positions[i];
        cube.position.x += (target[0] - cube.position.x) * 0.08;
        cube.position.y += (target[1] - cube.position.y) * 0.08;
        cube.position.z += (target[2] - cube.position.z) * 0.08;
        cube.rotation.x = t * (0.4 + i * 0.1);
        cube.rotation.y = t * (0.3 + i * 0.15);
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement);
    };
  }, []);

  const toggle = () => {
    setSplit((s) => {
      splitRef.current = !s;
      return !s;
    });
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={mountRef} style={{ width: 280, height: 200 }} />
      <button
        type="button"
        onClick={toggle}
        className={`text-[11px] px-4 py-1.5 rounded-lg border font-mono tracking-widest transition-all ${
          split
            ? "border-warning/50 text-warning bg-warning/10 hover:bg-warning/20"
            : "border-primary/50 text-primary bg-primary/10 hover:bg-primary/20"
        }`}
      >
        {split ? "⬡ MERGE SHARDS" : "⬡ SPLIT SHARDS"}
      </button>
      <p className="text-[10px] text-muted-foreground tracking-widest">
        {split ? "FILE SHARDED — 4 FRAGMENTS" : "FILE INTACT — CLICK TO SHARD"}
      </p>
    </div>
  );
}
