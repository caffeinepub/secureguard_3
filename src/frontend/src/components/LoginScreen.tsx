import { Button } from "@/components/ui/button";
import { Lock, Shield } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface LoginScreenProps {
  onLogin: () => void;
  isLoggingIn: boolean;
}

function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // --- Icosahedron shield ---
    const shieldGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x1a6aff,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    scene.add(shield);

    const innerGeo = new THREE.IcosahedronGeometry(0.85, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x0a1a60,
      transparent: true,
      opacity: 0.55,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    scene.add(inner);

    // --- Torus (ring) ---
    const torusGeo = new THREE.TorusGeometry(2.2, 0.05, 12, 90);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x00aaff,
      transparent: true,
      opacity: 0.4,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.rotation.x = Math.PI / 3;
    torus.rotation.y = Math.PI / 5;
    scene.add(torus);

    // Second torus
    const torus2Geo = new THREE.TorusGeometry(1.7, 0.02, 8, 60);
    const torus2Mat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.25,
    });
    const torus2 = new THREE.Mesh(torus2Geo, torus2Mat);
    torus2.rotation.y = Math.PI / 4;
    scene.add(torus2);

    // --- Floating cube ---
    const cubeGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const cubeMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    cube.position.set(2.5, 1.2, -0.5);
    scene.add(cube);

    // Second cube (small)
    const cube2Geo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const cube2Mat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const cube2 = new THREE.Mesh(cube2Geo, cube2Mat);
    cube2.position.set(-2.8, -1.0, 0.3);
    scene.add(cube2);

    // --- Lock (cylinder body + box shackle) ---
    const lockBodyGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.35, 12);
    const lockBodyMat = new THREE.MeshBasicMaterial({
      color: 0x0066ff,
      transparent: true,
      opacity: 0.7,
    });
    const lockBody = new THREE.Mesh(lockBodyGeo, lockBodyMat);
    lockBody.position.set(0, -0.2, 0);
    scene.add(lockBody);

    const lockShackleGeo = new THREE.TorusGeometry(0.15, 0.04, 8, 20, Math.PI);
    const lockShackleMat = new THREE.MeshBasicMaterial({
      color: 0x00ccff,
      transparent: true,
      opacity: 0.8,
    });
    const lockShackle = new THREE.Mesh(lockShackleGeo, lockShackleMat);
    lockShackle.position.set(0, 0.08, 0);
    lockShackle.rotation.z = Math.PI;
    scene.add(lockShackle);

    // Lock group for unified orbit
    const lockGroup = new THREE.Group();
    lockGroup.add(lockBody);
    lockGroup.add(lockShackle);
    scene.add(lockGroup);

    // Orbit nodes around shield
    const nodeGroup = new THREE.Group();
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const r = 1.55;
      const nGeo = new THREE.SphereGeometry(0.04, 6, 6);
      const nMat = new THREE.MeshBasicMaterial({
        color: i % 4 === 0 ? 0xff3333 : 0x22ff88,
      });
      const node = new THREE.Mesh(nGeo, nMat);
      node.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
      nodeGroup.add(node);
    }
    scene.add(nodeGroup);

    // --- Particles: 220 upward-floating glowing dots ---
    const PARTICLE_COUNT = 220;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      // Vary between neon blue and cyan
      const t = Math.random();
      colors[i * 3] = 0.0 + t * 0.1; // r
      colors[i * 3 + 1] = 0.6 + t * 0.4; // g
      colors[i * 3 + 2] = 1.0; // b
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    let cameraAngle = 0;
    let animId: number;
    let t = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.008;

      // Camera slow orbit
      cameraAngle += 0.0003;
      const camRadius = 6;
      camera.position.x = camRadius * Math.sin(cameraAngle);
      camera.position.z = camRadius * Math.cos(cameraAngle);
      camera.position.y = Math.sin(cameraAngle * 0.3) * 0.8;
      camera.lookAt(0, 0, 0);

      // Shield rotation
      shield.rotation.y = t * 0.5;
      shield.rotation.x = Math.sin(t * 0.3) * 0.15;
      inner.rotation.y = -t * 0.4;

      // Torus rotation
      torus.rotation.z = t * 0.15;
      torus.rotation.x = Math.PI / 3 + Math.sin(t * 0.2) * 0.1;
      torus2.rotation.y = t * 0.1;
      torus2.rotation.z = t * 0.08;

      // Cube orbiting
      cube.rotation.x = t * 0.7;
      cube.rotation.y = t * 0.9;
      cube.position.x = 2.5 + Math.sin(t * 0.4) * 0.3;
      cube.position.y = 1.2 + Math.cos(t * 0.35) * 0.3;

      cube2.rotation.x = -t * 0.6;
      cube2.rotation.z = t * 0.8;
      cube2.position.x = -2.8 + Math.cos(t * 0.3) * 0.4;
      cube2.position.y = -1.0 + Math.sin(t * 0.4) * 0.3;

      // Lock pulse
      const pulse = 0.85 + Math.sin(t * 2) * 0.15;
      lockGroup.scale.setScalar(pulse);

      // Node orbit
      nodeGroup.rotation.z = t * 0.25;

      // Upward floating particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3 + 1] += 0.012;
        if (positions[i * 3 + 1] > 6) {
          positions[i * 3 + 1] = -6;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0"
      style={{ pointerEvents: "none" }}
    />
  );
}

export function LoginScreen({ onLogin, isLoggingIn }: LoginScreenProps) {
  const [loginStep, setLoginStep] = useState<"credentials" | "tfa">(
    "credentials",
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tfaCode, setTfaCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  const addRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((r) => [
      ...r,
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 700);
  }, []);

  const handleSignIn = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      addRipple(e);
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setLoginStep("tfa");
      }, 700);
    },
    [addRipple],
  );

  const handleVerify2FA = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      addRipple(e);
      setTimeout(() => onLogin(), 200);
    },
    [addRipple, onLogin],
  );

  const neonFocus = {
    boxShadow:
      "0 0 0 2px oklch(0.45 0.22 220 / 0.4), 0 0 20px oklch(0.55 0.25 220 / 0.25)",
    borderColor: "oklch(0.55 0.22 220 / 0.7)",
  };

  const baseInputStyle = {
    background: "oklch(0.1 0.025 240 / 0.8)",
    border: "1px solid oklch(0.32 0.06 240 / 0.6)",
    color: "oklch(0.92 0.012 240)",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    outline: "none",
    transition: "box-shadow 0.25s, border-color 0.25s",
    width: "100%",
  };

  return (
    <div
      className="fixed inset-0"
      style={{ zIndex: 10, background: "#080812" }}
    >
      {/* Full-viewport 3D background */}
      <Scene3D />

      {/* Centered glassmorphism card */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-sm rounded-2xl p-7 space-y-5"
          style={{
            background: "oklch(0.1 0.028 240 / 0.75)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid oklch(0.5 0.12 220 / 0.2)",
            boxShadow:
              "0 0 60px oklch(0.45 0.2 250 / 0.12), 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 oklch(0.7 0.1 250 / 0.08)",
          }}
        >
          {/* Brand */}
          <div className="text-center space-y-2">
            <motion.div
              className="flex items-center justify-center w-12 h-12 rounded-xl mx-auto"
              style={{
                background: "oklch(0.2 0.08 250 / 0.8)",
                border: "1px solid oklch(0.5 0.2 250 / 0.35)",
                boxShadow: "0 0 20px oklch(0.55 0.25 250 / 0.25)",
              }}
              animate={{
                boxShadow: [
                  "0 0 20px oklch(0.55 0.25 250 / 0.25)",
                  "0 0 35px oklch(0.55 0.25 250 / 0.45)",
                  "0 0 20px oklch(0.55 0.25 250 / 0.25)",
                ],
              }}
              transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
            >
              <Lock
                className="w-6 h-6"
                style={{ color: "oklch(0.65 0.25 220)" }}
              />
            </motion.div>
            <h1
              className="text-xl font-black tracking-[0.25em] uppercase"
              style={{
                color: "oklch(0.93 0.012 240)",
                textShadow: "0 0 30px oklch(0.55 0.25 250 / 0.5)",
              }}
            >
              SecureGuard
            </h1>
            <p
              className="text-[10px] tracking-widest"
              style={{ color: "oklch(0.5 0.08 240)" }}
            >
              {loginStep === "credentials"
                ? "SECURE AUTHENTICATION"
                : "2FA VERIFICATION"}
            </p>
          </div>

          {/* SSL/TLS status */}
          <div className="flex items-center justify-center gap-4 text-[10px]">
            {["AES-256", "SSL/TLS", "VPN"].map((s) => (
              <div
                key={s}
                className="flex items-center gap-1"
                style={{ color: "oklch(0.6 0.15 160)" }}
              >
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-current"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random(),
                  }}
                />
                <span className="font-mono font-bold tracking-wider">{s}</span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {loginStep === "credentials" ? (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <div className="space-y-1.5">
                  <label
                    htmlFor="login-username"
                    className="text-[10px] tracking-widest uppercase"
                    style={{ color: "oklch(0.55 0.08 240)" }}
                  >
                    Username
                  </label>
                  <input
                    id="login-username"
                    data-ocid="login.username.input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter username"
                    style={{
                      ...baseInputStyle,
                      ...(focusedField === "username" ? neonFocus : {}),
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="login-password"
                    className="text-[10px] tracking-widest uppercase"
                    style={{ color: "oklch(0.55 0.08 240)" }}
                  >
                    Password
                  </label>
                  <input
                    id="login-password"
                    data-ocid="login.password.input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    style={{
                      ...baseInputStyle,
                      ...(focusedField === "password" ? neonFocus : {}),
                    }}
                  />
                </div>

                <motion.div
                  whileHover={{ scale: 1.02, rotateX: -3 }}
                  whileTap={{ scale: 0.97, rotateX: 3 }}
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: 400,
                    marginTop: 8,
                  }}
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <AnimatePresence>
                      {ripples.map((rp) => (
                        <motion.span
                          key={rp.id}
                          className="absolute rounded-full pointer-events-none"
                          style={{
                            left: rp.x - 12,
                            top: rp.y - 12,
                            width: 24,
                            height: 24,
                            background: "oklch(0.8 0.12 250 / 0.4)",
                          }}
                          initial={{ scale: 0, opacity: 1 }}
                          animate={{ scale: 12, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.65, ease: "easeOut" }}
                        />
                      ))}
                    </AnimatePresence>
                    <Button
                      data-ocid="login.primary_button"
                      onClick={handleSignIn}
                      disabled={isProcessing}
                      className="w-full h-11 text-sm font-bold tracking-wider relative"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.38 0.18 250), oklch(0.28 0.14 265))",
                        border: "1px solid oklch(0.55 0.2 250 / 0.4)",
                        boxShadow:
                          "0 0 25px oklch(0.55 0.25 250 / 0.3), inset 0 1px 0 oklch(0.7 0.1 250 / 0.25)",
                        color: "oklch(0.95 0.01 240)",
                      }}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      {isProcessing ? (
                        <motion.span
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{
                            duration: 0.6,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                        >
                          Verifying...
                        </motion.span>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="tfa"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <motion.div
                    className="text-3xl mb-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    🔐
                  </motion.div>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.65 0.08 240)" }}
                  >
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="login-tfa"
                    className="text-[10px] tracking-widest uppercase"
                    style={{ color: "oklch(0.55 0.08 240)" }}
                  >
                    2FA Code
                  </label>
                  <input
                    id="login-tfa"
                    data-ocid="login.tfa.input"
                    type="text"
                    value={tfaCode}
                    onChange={(e) =>
                      setTfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    onFocus={() => setFocusedField("tfa")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="000000"
                    maxLength={6}
                    className="text-center"
                    style={{
                      ...baseInputStyle,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 22,
                      letterSpacing: "0.4em",
                      textAlign: "center",
                      ...(focusedField === "tfa" ? neonFocus : {}),
                    }}
                  />
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <AnimatePresence>
                      {ripples.map((rp) => (
                        <motion.span
                          key={rp.id}
                          className="absolute rounded-full pointer-events-none"
                          style={{
                            left: rp.x - 12,
                            top: rp.y - 12,
                            width: 24,
                            height: 24,
                            background: "oklch(0.8 0.12 250 / 0.4)",
                          }}
                          initial={{ scale: 0, opacity: 1 }}
                          animate={{ scale: 12, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.65, ease: "easeOut" }}
                        />
                      ))}
                    </AnimatePresence>
                    <Button
                      data-ocid="login.verify_2fa.button"
                      onClick={handleVerify2FA}
                      disabled={isLoggingIn}
                      className="w-full h-11 text-sm font-bold tracking-wider"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.38 0.18 160), oklch(0.3 0.15 175))",
                        border: "1px solid oklch(0.55 0.2 160 / 0.4)",
                        boxShadow: "0 0 25px oklch(0.55 0.2 160 / 0.2)",
                        color: "oklch(0.95 0.01 240)",
                      }}
                    >
                      {isLoggingIn ? "Authenticating..." : "Verify & Enter →"}
                    </Button>
                  </div>
                </motion.div>

                <button
                  type="button"
                  data-ocid="login.back.button"
                  onClick={() => setLoginStep("credentials")}
                  className="w-full text-xs py-1 transition-opacity hover:opacity-80"
                  style={{ color: "oklch(0.5 0.08 240)" }}
                >
                  ← Back to credentials
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <p
            className="text-[10px] text-center tracking-wider"
            style={{ color: "oklch(0.38 0.04 240)" }}
          >
            AUTHORIZED PERSONNEL ONLY · All access attempts are logged
          </p>
        </motion.div>
      </div>
    </div>
  );
}
