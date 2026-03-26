import { motion } from "motion/react";
import { useState } from "react";

const SUMMARY_CARDS = [
  {
    icon: "🛡️",
    title: "Military-grade Security",
    color: "oklch(0.62 0.25 20)",
    glow: "oklch(0.62 0.25 20 / 0.15)",
    border: "oklch(0.62 0.25 20 / 0.3)",
    description:
      "AES-256 encryption for all files before transmission. RSA key exchange. Data sent only to trusted military-grade servers with zero local trace.",
    detail:
      "All encryption uses deterministic, non-AI key management. The system follows FIPS 140-2 standards with hardware-grade entropy sources.",
  },
  {
    icon: "🎨",
    title: "Modern UI",
    color: "oklch(0.65 0.25 220)",
    glow: "oklch(0.65 0.25 220 / 0.15)",
    border: "oklch(0.65 0.25 220 / 0.3)",
    description:
      "Glassmorphism cards with backdrop blur. Neon blue accents on dark backgrounds. Fully responsive from mobile to 4K displays.",
    detail:
      "Built with React 19, TailwindCSS, and OKLCH color space for perceptual uniformity. Every component follows WCAG AA contrast guidelines.",
  },
  {
    icon: "✨",
    title: "Smooth Animations",
    color: "oklch(0.82 0.17 80)",
    glow: "oklch(0.82 0.17 80 / 0.15)",
    border: "oklch(0.82 0.17 80 / 0.3)",
    description:
      "Framer Motion 3D effects throughout. Interactive 3D vault door, file cards with flip animations, and shard cube visualizations.",
    detail:
      "Camera orbits, particle systems, and micro-interactions powered by Three.js + React Three Fiber. 60fps on all modern devices.",
  },
  {
    icon: "🔔",
    title: "Real-time Alerts",
    color: "oklch(0.75 0.2 160)",
    glow: "oklch(0.75 0.2 160 / 0.15)",
    border: "oklch(0.75 0.2 160 / 0.3)",
    description:
      "Live threat detection with AI risk scoring. Instant notifications for unauthorized access attempts. Full breach overlay with admin alert.",
    detail:
      "AI monitors patterns and assigns risk scores (0-100). Deterministic rule engine confirms all AI suggestions before executing any action.",
  },
  {
    icon: "🔑",
    title: "Complete Access Control",
    color: "oklch(0.72 0.18 300)",
    glow: "oklch(0.72 0.18 300 / 0.15)",
    border: "oklch(0.72 0.18 300 / 0.3)",
    description:
      "Role-based permissions: Read, Write, Encrypt, Backup. Only admin can grant or revoke access. Complete audit trail of all actions.",
    detail:
      "Internet Identity authentication via blockchain. JWT-compatible session management with 2FA verification for maximum security.",
  },
];

export function About() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  return (
    <div className="flex-1 overflow-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <motion.span
            className="text-4xl"
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
            }}
          >
            🏆
          </motion.span>
          <h1
            className="text-4xl font-black tracking-tight"
            style={{
              color: "oklch(0.95 0.012 240)",
              textShadow: "0 0 40px oklch(0.65 0.25 220 / 0.5)",
            }}
          >
            Fully Functional Secure File Vault System
          </h1>
          <motion.span
            className="text-4xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 2,
            }}
          >
            ✅
          </motion.span>
        </div>
        <p
          className="text-sm tracking-widest uppercase"
          style={{ color: "oklch(0.6 0.12 220)" }}
        >
          Built with military-grade security and modern UI
        </p>
        <div className="flex justify-center gap-2 mt-3">
          {["v5.0", "Production", "Internet Computer"].map((badge) => (
            <span
              key={badge}
              className="text-[10px] px-3 py-1 rounded-full font-mono"
              style={{
                background: "oklch(0.18 0.06 250 / 0.8)",
                border: "1px solid oklch(0.45 0.15 250 / 0.4)",
                color: "oklch(0.65 0.15 220)",
              }}
            >
              {badge}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SUMMARY_CARDS.map((card, i) => {
          const isExpanded = expandedCard === i;
          return (
            <motion.div
              key={card.title}
              data-ocid={`about.card.${i + 1}`}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              whileHover={
                !isExpanded
                  ? { y: -6, rotateX: 2, rotateY: -2, scale: 1.02 }
                  : {}
              }
              onClick={() => setExpandedCard(isExpanded ? null : i)}
              className="cursor-pointer rounded-2xl p-6 space-y-3 transition-all"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.15 0.04 240 / 0.9), oklch(0.12 0.03 250 / 0.9))",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${isExpanded ? card.border : "oklch(0.28 0.05 240 / 0.5)"}`,
                boxShadow: isExpanded
                  ? `0 0 30px ${card.glow}, 0 8px 32px rgba(0,0,0,0.3)`
                  : "0 4px 20px rgba(0,0,0,0.2)",
                transformStyle: "preserve-3d",
                perspective: 800,
              }}
            >
              <div className="flex items-center gap-3">
                <motion.span
                  className="text-3xl"
                  animate={isExpanded ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  {card.icon}
                </motion.span>
                <h3
                  className="text-sm font-bold tracking-wide"
                  style={{ color: card.color }}
                >
                  {card.title}
                </h3>
                <motion.span
                  className="ml-auto text-xs"
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ color: "oklch(0.5 0.05 240)" }}
                >
                  ▼
                </motion.span>
              </div>

              <p
                className="text-xs leading-relaxed"
                style={{ color: "oklch(0.65 0.025 240)" }}
              >
                {card.description}
              </p>

              <motion.div
                initial={false}
                animate={{
                  height: isExpanded ? "auto" : 0,
                  opacity: isExpanded ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div
                  className="pt-3 text-xs leading-relaxed border-t"
                  style={{
                    borderColor: card.border,
                    color: "oklch(0.75 0.05 240)",
                  }}
                >
                  {card.detail}
                </div>
              </motion.div>

              <div className="flex items-center gap-1">
                <motion.div
                  className="h-0.5 rounded-full"
                  style={{ background: card.color }}
                  initial={{ width: 0 }}
                  animate={{ width: isExpanded ? "100%" : "30%" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tech stack banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="rounded-2xl p-6"
        style={{
          background: "oklch(0.13 0.04 240 / 0.8)",
          border: "1px solid oklch(0.28 0.06 250 / 0.3)",
        }}
      >
        <p
          className="text-center text-xs font-bold tracking-[0.3em] uppercase mb-4"
          style={{ color: "oklch(0.55 0.1 220)" }}
        >
          ◆ Secure File Vault System ◆
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Encryption", value: "AES-256 + RSA" },
            { label: "3D Engine", value: "Three.js + RxF" },
            { label: "Animations", value: "Framer Motion" },
            { label: "Auth", value: "Internet Identity" },
            { label: "Runtime", value: "Internet Computer" },
            { label: "Frontend", value: "React 19 + Vite" },
            { label: "Styling", value: "TailwindCSS + OKLCH" },
            { label: "Real-time", value: "React Query" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p
                className="text-[9px] tracking-widest uppercase"
                style={{ color: "oklch(0.45 0.06 240)" }}
              >
                {item.label}
              </p>
              <p
                className="text-xs font-semibold mt-0.5"
                style={{ color: "oklch(0.75 0.08 240)" }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-[11px]" style={{ color: "oklch(0.4 0.04 240)" }}>
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80 transition-opacity"
            style={{ color: "oklch(0.6 0.15 220)" }}
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
