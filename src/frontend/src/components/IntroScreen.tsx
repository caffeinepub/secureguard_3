import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

interface IntroScreenProps {
  onEnter: () => void;
}

const FEATURES = [
  { icon: "🔒", label: "Encryption", desc: "AES-256 + RSA" },
  { icon: "🛰️", label: "Military Server", desc: "Trusted nodes only" },
  { icon: "🌐", label: "SSL/TLS VPN", desc: "Secure channels" },
  { icon: "🗑️", label: "Delete Local", desc: "Zero trace backup" },
  { icon: "📂", label: "File Sharding", desc: "Split for safety" },
];

const TITLE_WORDS = ["Secure", "File", "Vault", "System"];

export function IntroScreen({ onEnter }: IntroScreenProps) {
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [leaving, setLeaving] = useState(false);

  const handleEnter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const id = Date.now();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setRipples((r) => [...r, { id, x, y }]);
      setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 700);
      setTimeout(() => setLeaving(true), 300);
      setTimeout(() => onEnter(), 900);
    },
    [onEnter],
  );

  return (
    <AnimatePresence>
      {!leaving ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#0a0a14" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Circuit grid background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(oklch(0.4 0.12 250 / 0.06) 1px, transparent 1px),
                linear-gradient(90deg, oklch(0.4 0.12 250 / 0.06) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
          {/* Radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 800px 600px at center, oklch(0.2 0.12 250 / 0.35) 0%, transparent 70%)",
            }}
          />

          {/* Shield badge */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "backOut" }}
            className="mb-6 flex items-center justify-center w-20 h-20 rounded-2xl"
            style={{
              background: "oklch(0.18 0.06 250 / 0.8)",
              border: "1px solid oklch(0.5 0.2 250 / 0.4)",
              boxShadow:
                "0 0 40px oklch(0.5 0.25 250 / 0.3), inset 0 1px 0 oklch(0.7 0.1 250 / 0.2)",
            }}
          >
            <span className="text-4xl">🛡️</span>
          </motion.div>

          {/* Title: word by word */}
          <div className="flex gap-4 mb-3 flex-wrap justify-center">
            {TITLE_WORDS.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + i * 0.15,
                  ease: "easeOut",
                }}
                className="text-5xl sm:text-6xl font-black tracking-tight"
                style={{
                  color:
                    i === 2 ? "oklch(0.65 0.25 220)" : "oklch(0.95 0.01 240)",
                  textShadow:
                    i === 2
                      ? "0 0 40px oklch(0.6 0.25 220 / 0.8), 0 0 80px oklch(0.6 0.25 220 / 0.4)"
                      : "0 0 20px oklch(0.95 0.01 240 / 0.2)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.35em" }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-sm font-semibold uppercase mb-10"
            style={{ color: "oklch(0.65 0.15 220)" }}
          >
            Encrypt. Send. Secure.
          </motion.p>

          {/* Security Features */}
          <div className="flex gap-5 mb-10 flex-wrap justify-center px-4">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.label}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 1.1 + i * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{ y: -4, scale: 1.05 }}
                className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl cursor-default"
                style={{
                  background: "oklch(0.15 0.04 240 / 0.8)",
                  border: "1px solid oklch(0.45 0.12 250 / 0.25)",
                  backdropFilter: "blur(8px)",
                  minWidth: 80,
                }}
              >
                <motion.span
                  className="text-2xl"
                  animate={{ y: [0, -3, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.4,
                  }}
                >
                  {feat.icon}
                </motion.span>
                <span
                  className="text-xs font-bold tracking-wide"
                  style={{ color: "oklch(0.9 0.012 240)" }}
                >
                  {feat.label}
                </span>
                <span
                  className="text-[10px]"
                  style={{ color: "oklch(0.55 0.04 240)" }}
                >
                  {feat.desc}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Animated data-flow visualization */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
            className="flex items-center gap-2 mb-8 text-xs"
            style={{ color: "oklch(0.55 0.08 250)" }}
          >
            {[
              { id: "aes256", text: "AES-256", isArrow: false },
              { id: "arr1", text: "→", isArrow: true },
              { id: "milsrv", text: "Military Server", isArrow: false },
              { id: "arr2", text: "→", isArrow: true },
              { id: "backup", text: "Backup", isArrow: false },
              { id: "arr3", text: "→", isArrow: true },
              { id: "deleted", text: "Local Deleted", isArrow: false },
            ].map(({ id, text, isArrow }, i) => (
              <motion.span
                key={id}
                initial={{ opacity: 0 }}
                animate={{ opacity: isArrow ? [0.3, 0.9, 0.3] : 1 }}
                transition={{
                  delay: 1.9 + i * 0.1,
                  duration: isArrow ? 1.5 : 0.3,
                  repeat: isArrow ? Number.POSITIVE_INFINITY : 0,
                }}
                className="font-mono tracking-wider"
                style={{
                  color: isArrow
                    ? "oklch(0.55 0.2 220)"
                    : "oklch(0.75 0.08 240)",
                }}
              >
                {text}
              </motion.span>
            ))}
          </motion.div>

          {/* Enter button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.0, duration: 0.5, ease: "backOut" }}
          >
            <button
              type="button"
              data-ocid="intro.enter.button"
              onClick={handleEnter}
              className="relative overflow-hidden px-10 py-4 rounded-xl text-sm font-bold tracking-[0.15em] uppercase transition-all"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.35 0.18 250), oklch(0.28 0.15 265))",
                border: "1px solid oklch(0.55 0.2 250 / 0.5)",
                color: "oklch(0.95 0.01 240)",
                boxShadow:
                  "0 0 30px oklch(0.55 0.25 250 / 0.35), inset 0 1px 0 oklch(0.7 0.1 250 / 0.3)",
              }}
            >
              <AnimatePresence>
                {ripples.map((rp) => (
                  <motion.span
                    key={rp.id}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      left: rp.x - 10,
                      top: rp.y - 10,
                      width: 20,
                      height: 20,
                      background: "oklch(0.8 0.1 250 / 0.4)",
                    }}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 15, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                ))}
              </AnimatePresence>
              Enter Secure System →
            </button>
          </motion.div>

          {/* Bottom badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.3 }}
            className="mt-8 flex items-center gap-3 text-[10px] tracking-widest"
            style={{ color: "oklch(0.4 0.04 240)" }}
          >
            {["🔒 ENCRYPTED", "🛡️ MILITARY-GRADE", "✅ COMPLIANT"].map(
              (badge) => (
                <span
                  key={badge}
                  className="px-2 py-0.5 rounded border"
                  style={{ borderColor: "oklch(0.3 0.04 240)" }}
                >
                  {badge}
                </span>
              ),
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
