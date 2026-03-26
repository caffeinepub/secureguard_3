import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type * as THREE from "three";

function Core() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.3;
    meshRef.current.rotation.y += delta * 0.5;
  });
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshStandardMaterial
        color="#00d4ff"
        emissive="#7c3aed"
        emissiveIntensity={0.7}
        wireframe
      />
    </mesh>
  );
}

function InnerCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x -= delta * 0.2;
    meshRef.current.rotation.z += delta * 0.4;
  });
  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[0.9, 0]} />
      <meshStandardMaterial
        color="#7c3aed"
        emissive="#00d4ff"
        emissiveIntensity={0.5}
        wireframe
      />
    </mesh>
  );
}

function TorusRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.4;
    ref.current.rotation.z += delta * 0.15;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[2.6, 0.04, 8, 120]} />
      <meshStandardMaterial
        color="#7c3aed"
        emissive="#7c3aed"
        emissiveIntensity={1.2}
      />
    </mesh>
  );
}

function TorusRing2() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.3;
    ref.current.rotation.x -= delta * 0.2;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 4, 0, 0]}>
      <torusGeometry args={[3.2, 0.02, 8, 120]} />
      <meshStandardMaterial
        color="#00d4ff"
        emissive="#00d4ff"
        emissiveIntensity={0.9}
      />
    </mesh>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const count = 220;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 32;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return arr;
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes
      .position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const y = pos.getY(i) + 0.018;
      pos.setY(i, y > 12 ? -12 : y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        color="#00d4ff"
        sizeAttenuation
        transparent
        opacity={0.75}
      />
    </points>
  );
}

function PurpleParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 80;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes
      .position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const y = pos.getY(i) + 0.01;
      pos.setY(i, y > 10 ? -10 : y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#7c3aed"
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  );
}

function CameraOrbit() {
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.1;
    state.camera.position.x = Math.sin(t) * 6;
    state.camera.position.z = Math.cos(t) * 6;
    state.camera.position.y = Math.sin(t * 0.5) * 0.8;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export function LoginScene() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: "#050510",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true }}
      >
        <CameraOrbit />
        <ambientLight intensity={0.2} />
        <pointLight position={[4, 4, 4]} color="#00d4ff" intensity={3} />
        <pointLight position={[-4, -4, -4]} color="#7c3aed" intensity={2} />
        <pointLight position={[0, 6, 0]} color="#ffffff" intensity={0.5} />
        <Core />
        <InnerCore />
        <TorusRing />
        <TorusRing2 />
        <Particles />
        <PurpleParticles />
        <fog attach="fog" args={["#050510", 18, 35]} />
      </Canvas>
    </div>
  );
}
