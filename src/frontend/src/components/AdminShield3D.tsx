import { useEffect, useRef } from "react";
import * as THREE from "three";

interface AdminShield3DProps {
  onClick?: () => void;
}

export function AdminShield3D({ onClick }: AdminShield3DProps) {
  const mountRef = useRef<HTMLButtonElement>(null);
  const pulseRef = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = 220;
    const H = 220;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x334488, 1);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0x6699ff, 2);
    dirLight.position.set(2, 3, 4);
    scene.add(dirLight);
    const pointLight = new THREE.PointLight(0x3b82f6, 3, 10);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // Shield body (dodecahedron for shield-like shape)
    const shieldGeo = new THREE.DodecahedronGeometry(1.1, 0);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0x1e40af,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.3,
      metalness: 0.8,
      roughness: 0.2,
    });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    scene.add(shield);

    // Outer wireframe
    const wireGeo = new THREE.DodecahedronGeometry(1.35, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    // Gold ring
    const ringGeo = new THREE.TorusGeometry(1.5, 0.03, 8, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.6,
      metalness: 1,
      roughness: 0.1,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    scene.add(ring);

    let t = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.012;

      shield.rotation.y = t;
      shield.rotation.x = Math.sin(t * 0.4) * 0.15;
      wire.rotation.y = -t * 0.6;
      ring.rotation.z = t * 0.2;
      ring.rotation.x = Math.PI / 6;

      if (pulseRef.current) {
        shieldMat.emissiveIntensity = 0.3 + Math.abs(Math.sin(t * 8)) * 1.2;
        ringMat.emissiveIntensity = 0.6 + Math.abs(Math.sin(t * 8)) * 1.5;
      } else {
        shieldMat.emissiveIntensity +=
          (0.3 - shieldMat.emissiveIntensity) * 0.05;
        ringMat.emissiveIntensity += (0.6 - ringMat.emissiveIntensity) * 0.05;
      }

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

  const handleClick = () => {
    pulseRef.current = true;
    setTimeout(() => {
      pulseRef.current = false;
    }, 1500);
    onClick?.();
  };

  return (
    <button
      type="button"
      ref={mountRef}
      style={{
        width: 220,
        height: 220,
        cursor: "pointer",
        background: "none",
        border: "none",
        padding: 0,
      }}
      onClick={handleClick}
      title="Click to activate elevated access"
      aria-label="Admin shield - click to activate elevated access"
    />
  );
}
