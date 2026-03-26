import { AlertCircle, Eye, EyeOff, Loader2, Shield, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotificationCtx } from "../contexts/NotificationContext";
import { useRisk } from "../contexts/RiskContext";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const { startEngine, addEvent } = useRisk();
  const { requestBrowserPermission, addNotification } = useNotificationCtx();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const ok = login(email, password);
    if (ok) {
      await requestBrowserPermission();
      startEngine();
      addEvent("login", 30);
      addNotification(
        "Authentication successful — Session initiated",
        "success",
      );
      onLoginSuccess();
    } else {
      setError("Invalid credentials. Try admin@sentinel.com / password123");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <motion.div
        animate={{ y: [-6, 6, -6] }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ width: "100%", maxWidth: 420 }}
      >
        <div
          style={{
            background: "rgba(5, 5, 30, 0.85)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: 12,
            padding: "2.5rem 2rem",
            border: "1px solid rgba(0,212,255,0.25)",
            boxShadow:
              "0 0 40px rgba(0,212,255,0.12), 0 0 80px rgba(124,58,237,0.08), inset 0 1px 0 rgba(0,212,255,0.08)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Animated gradient border overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 12,
              padding: 1,
              background:
                "linear-gradient(var(--angle, 0deg), #00d4ff, #7c3aed, #ff0040, #00d4ff)",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              animation: "gradientBorder 4s linear infinite",
              pointerEvents: "none",
            }}
          />

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <Zap size={28} style={{ color: "#00d4ff" }} />
                <h1
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "2rem",
                    fontWeight: 900,
                    letterSpacing: "0.25em",
                    color: "#00d4ff",
                    textShadow:
                      "0 0 20px rgba(0,212,255,0.8), 0 0 40px rgba(0,212,255,0.4)",
                    margin: 0,
                  }}
                >
                  SENTINEL
                </h1>
                <Zap
                  size={28}
                  style={{ color: "#00d4ff", transform: "scaleX(-1)" }}
                />
              </div>
              <p
                style={{
                  color: "rgba(224,224,255,0.6)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  fontFamily: "var(--font-mono)",
                  marginBottom: 16,
                }}
              >
                DATA SELF-DESTRUCTION SYSTEM
              </p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(124,58,237,0.15)",
                  border: "1px solid rgba(124,58,237,0.4)",
                  borderRadius: 100,
                  padding: "4px 12px",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  color: "rgba(200,160,255,0.9)",
                  fontFamily: "var(--font-mono)",
                  boxShadow: "0 0 10px rgba(124,58,237,0.2)",
                }}
              >
                <Shield size={10} />
                PROTECTED BY ZERO-KNOWLEDGE AUTHENTICATION
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor="sentinel-email"
                style={{
                  display: "block",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  color: "rgba(0,212,255,0.7)",
                  marginBottom: 6,
                  fontFamily: "var(--font-mono)",
                }}
              >
                ACCESS EMAIL
              </label>
              <input
                id="sentinel-email"
                data-ocid="login.input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sentinel.com"
                required
                style={{
                  width: "100%",
                  background: "rgba(0,10,30,0.8)",
                  border: "1px solid rgba(0,212,255,0.2)",
                  borderRadius: 6,
                  padding: "10px 14px",
                  color: "#e0e0ff",
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-mono)",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(0,212,255,0.7)";
                  e.target.style.boxShadow = "0 0 12px rgba(0,212,255,0.25)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(0,212,255,0.2)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                htmlFor="sentinel-password"
                style={{
                  display: "block",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  color: "rgba(0,212,255,0.7)",
                  marginBottom: 6,
                  fontFamily: "var(--font-mono)",
                }}
              >
                ENCRYPTION KEY
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="sentinel-password"
                  data-ocid="login.input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%",
                    background: "rgba(0,10,30,0.8)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    borderRadius: 6,
                    padding: "10px 42px 10px 14px",
                    color: "#e0e0ff",
                    fontSize: "0.875rem",
                    fontFamily: "var(--font-mono)",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(0,212,255,0.7)";
                    e.target.style.boxShadow = "0 0 12px rgba(0,212,255,0.25)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(0,212,255,0.2)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(0,212,255,0.5)",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  data-ocid="login.error_state"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(255,0,64,0.1)",
                    border: "1px solid rgba(255,0,64,0.3)",
                    borderRadius: 6,
                    padding: "8px 12px",
                    marginBottom: 16,
                    color: "#ff6080",
                    fontSize: "0.75rem",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              data-ocid="login.primary_button"
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: "100%",
                background: loading
                  ? "rgba(0,212,255,0.15)"
                  : "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,212,255,0.1))",
                border: "1px solid rgba(0,212,255,0.6)",
                borderRadius: 6,
                padding: "12px",
                color: "#00d4ff",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                fontFamily: "var(--font-mono)",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: loading ? "none" : "0 0 20px rgba(0,212,255,0.2)",
                transition: "box-shadow 0.2s",
              }}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Shield size={16} />
              )}
              {loading ? "AUTHENTICATING..." : "INITIATE SESSION"}
            </motion.button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "16px 0",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(0,212,255,0.1)",
                }}
              />
              <span
                style={{
                  color: "rgba(224,224,255,0.3)",
                  fontSize: "0.65rem",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.1em",
                }}
              >
                OR
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(0,212,255,0.1)",
                }}
              />
            </div>

            <motion.button
              data-ocid="login.secondary_button"
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: "100%",
                background: "transparent",
                border: "1px solid rgba(124,58,237,0.5)",
                borderRadius: 6,
                padding: "11px",
                color: "rgba(180,130,255,0.9)",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.15em",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 16px rgba(124,58,237,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              <Shield size={14} />
              CONTINUE WITH INTERNET IDENTITY
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
