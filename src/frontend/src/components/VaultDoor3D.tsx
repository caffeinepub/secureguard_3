import { useEffect, useRef } from "react";
import * as THREE from "three";

interface VaultDoor3DProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function VaultDoor3D({ isOpen, onToggle }: VaultDoor3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth || 400;
    const H = 260;

    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0x334466, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 1.5);
    dir.position.set(4, 6, 6);
    scene.add(dir);
    const vault_light = new THREE.PointLight(0x22aaff, 3, 15);
    vault_light.position.set(-2, 0, 3);
    scene.add(vault_light);

    // Vault frame (static)
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.3,
    });
    const frameTop = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 0.3, 0.4),
      frameMat,
    );
    frameTop.position.set(0, 2.15, 0);
    scene.add(frameTop);
    const frameBot = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 0.3, 0.4),
      frameMat,
    );
    frameBot.position.set(0, -2.15, 0);
    scene.add(frameBot);
    const frameLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 4.0, 0.4),
      frameMat,
    );
    frameLeft.position.set(-2.15, 0, 0);
    scene.add(frameLeft);
    const frameRight = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 4.0, 0.4),
      frameMat,
    );
    frameRight.position.set(2.15, 0, 0);
    scene.add(frameRight);

    // Vault interior glow (visible when open)
    const interiorGeo = new THREE.PlaneGeometry(3.5, 3.8);
    const interiorMat = new THREE.MeshBasicMaterial({
      color: 0x0a1628,
      transparent: true,
      opacity: 0.95,
    });
    const interior = new THREE.Mesh(interiorGeo, interiorMat);
    interior.position.z = -0.5;
    scene.add(interior);

    // Interior glow lines
    for (let i = 0; i < 5; i++) {
      const lineGeo = new THREE.BoxGeometry(0.02, 3.2, 0.01);
      const lineMat = new THREE.MeshBasicMaterial({
        color: 0x1d4ed8,
        transparent: true,
        opacity: 0.4,
      });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.set(-1.5 + i * 0.75, 0, -0.49);
      scene.add(line);
    }

    // Door pivot group (hinged on left edge)
    const doorPivot = new THREE.Group();
    doorPivot.position.x = -2.0; // pivot at left edge
    scene.add(doorPivot);

    // Door panel
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.85,
      roughness: 0.25,
    });
    const doorPanel = new THREE.Mesh(
      new THREE.BoxGeometry(3.9, 3.9, 0.22),
      doorMat,
    );
    doorPanel.position.x = 1.95; // offset from pivot
    doorPivot.add(doorPanel);

    // Bolts
    const boltMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 1,
      roughness: 0.1,
    });
    const boltPositions = [
      [-1.5, 1.5],
      [1.5, 1.5],
      [-1.5, -1.5],
      [1.5, -1.5],
      [0, 1.7],
      [0, -1.7],
    ];
    for (const [bx, by] of boltPositions) {
      const bolt = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.3, 12),
        boltMat,
      );
      bolt.rotation.x = Math.PI / 2;
      bolt.position.set(bx + 1.95, by, 0.25);
      doorPivot.add(bolt);
    }

    // Handle
    const handleGroup = new THREE.Group();
    const handleBar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 1.4, 12),
      new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        metalness: 1,
        roughness: 0.05,
      }),
    );
    handleBar.rotation.z = Math.PI / 2;
    handleBar.position.set(2.8, 0, 0.28);
    handleGroup.add(handleBar);
    // Spoke
    for (let i = 0; i < 4; i++) {
      const spoke = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.65, 8),
        new THREE.MeshStandardMaterial({
          color: 0xfbbf24,
          metalness: 1,
          roughness: 0.05,
        }),
      );
      spoke.rotation.z = (i / 4) * Math.PI * 2 + Math.PI / 4;
      spoke.position.set(
        2.8 + Math.cos((i / 4) * Math.PI * 2) * 0.3,
        Math.sin((i / 4) * Math.PI * 2) * 0.3,
        0.28,
      );
      handleGroup.add(spoke);
    }
    doorPivot.add(handleGroup);

    let t = 0;
    let animId: number;

    let currentRotY = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.008;
      const target = isOpenRef.current ? -Math.PI * 0.72 : 0;
      currentRotY += (target - currentRotY) * 0.06;
      doorPivot.rotation.y = currentRotY;

      // Handle spin when opening
      handleGroup.rotation.x = t * 1.2;

      // Vault light pulse when open
      vault_light.intensity = isOpenRef.current ? 3 + Math.sin(t * 2) * 1 : 1;

      renderer.render(scene, camera);
    };
    animate();

    // Click on canvas to toggle
    const handleCanvasClick = () => onToggle();
    renderer.domElement.addEventListener("click", handleCanvasClick);

    return () => {
      cancelAnimationFrame(animId);
      renderer.domElement.removeEventListener("click", handleCanvasClick);
      renderer.dispose();
      if (mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement);
    };
  }, [onToggle]);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: 260, cursor: "pointer" }}
      title={isOpen ? "Click to close vault" : "Click to open vault"}
    />
  );
}
