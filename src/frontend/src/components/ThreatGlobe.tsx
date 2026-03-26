import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface ThreatNode {
  x: number;
  y: number;
  z: number;
  risk: "safe" | "critical";
}

interface ThreatGlobeProps {
  nodes: ThreatNode[];
  size?: number;
}

export function ThreatGlobe({ nodes, size = 240 }: ThreatGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 2.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Globe wireframe
    const globeGeo = new THREE.SphereGeometry(1, 24, 16);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0x1a6aff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    // Outer glow ring
    const ringGeo = new THREE.TorusGeometry(1.08, 0.005, 8, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.4,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    // Threat nodes
    const nodeGroup = new THREE.Group();
    for (const node of nodes) {
      const nGeo = new THREE.SphereGeometry(0.045, 8, 8);
      const color = node.risk === "critical" ? 0xff2222 : 0x22ff88;
      const nMat = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(nGeo, nMat);

      // Normalize to sphere surface
      const len =
        Math.sqrt(node.x * node.x + node.y * node.y + node.z * node.z) || 1;
      mesh.position.set(node.x / len, node.y / len, node.z / len);
      nodeGroup.add(mesh);

      // Pulse ring around each node
      const pulseGeo = new THREE.RingGeometry(0.05, 0.07, 12);
      const pulseMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      });
      const pulse = new THREE.Mesh(pulseGeo, pulseMat);
      pulse.position.copy(mesh.position);
      pulse.lookAt(0, 0, 0);
      nodeGroup.add(pulse);
    }
    scene.add(nodeGroup);

    // Animation
    let animId: number;
    let t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.005;
      globe.rotation.y = t;
      nodeGroup.rotation.y = t;
      ring.rotation.z = t * 0.3;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [nodes, size]);

  return (
    <div
      ref={mountRef}
      style={{ width: size, height: size }}
      className="flex-shrink-0"
    />
  );
}
