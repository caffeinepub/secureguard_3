import { AlertTriangle, X, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useRisk } from "../contexts/RiskContext";

export function SelfDestructButton() {
  const { initiateSelfDestruct } = useRisk();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === "d" || e.key === "D") && !e.ctrlKey && !e.metaKey) {
        setShowModal(true);
      }
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleConfirm = () => {
    setShowModal(false);
    initiateSelfDestruct();
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <motion.button
          data-ocid="destruct.primary_button"
          type="button"
          onClick={() => setShowModal(true)}
          animate={{
            boxShadow: [
              "0 0 15px rgba(255,0,64,0.3), 0 0 30px rgba(255,0,64,0.1)",
              "0 0 25px rgba(255,0,64,0.6), 0 0 50px rgba(255,0,64,0.2)",
              "0 0 15px rgba(255,0,64,0.3), 0 0 30px rgba(255,0,64,0.1)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          style={{
            width: "100%",
            background:
              "linear-gradient(135deg, rgba(255,0,64,0.2), rgba(180,0,40,0.15))",
            border: "2px solid rgba(255,0,64,0.7)",
            borderRadius: 8,
            padding: "16px 24px",
            color: "#ff0040",
            fontSize: "1rem",
            fontWeight: 900,
            letterSpacing: "0.25em",
            fontFamily: "JetBrains Mono, monospace",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <Zap size={20} />
          SELF-DESTRUCT
          <Zap size={20} />
        </motion.button>
        <p
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.55rem",
            color: "rgba(255,0,64,0.4)",
            letterSpacing: "0.15em",
          }}
        >
          KEYBOARD SHORTCUT: [D] · PURGES ALL SESSION DATA
        </p>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9000,
              padding: "1rem",
            }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              data-ocid="destruct.dialog"
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{
                background: "rgba(8, 4, 20, 0.98)",
                border: "1px solid rgba(255,0,64,0.5)",
                borderRadius: 12,
                padding: "2rem",
                maxWidth: 420,
                width: "100%",
                boxShadow:
                  "0 0 60px rgba(255,0,64,0.2), 0 0 120px rgba(255,0,64,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <AlertTriangle size={24} style={{ color: "#ff0040" }} />
                  <h3
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "1rem",
                      fontWeight: 900,
                      letterSpacing: "0.2em",
                      color: "#ff0040",
                      margin: 0,
                      textShadow: "0 0 12px rgba(255,0,64,0.5)",
                    }}
                  >
                    WARNING
                  </h3>
                </div>
                <button
                  data-ocid="destruct.close_button"
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(224,224,255,0.4)",
                    padding: 4,
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <p
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.75rem",
                  color: "rgba(224,224,255,0.7)",
                  lineHeight: 1.6,
                  marginBottom: 8,
                }}
              >
                INITIATING SELF-DESTRUCT SEQUENCE
              </p>
              <p
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.7rem",
                  color: "rgba(255,100,100,0.8)",
                  lineHeight: 1.6,
                  marginBottom: 24,
                  background: "rgba(255,0,64,0.06)",
                  border: "1px solid rgba(255,0,64,0.15)",
                  borderRadius: 6,
                  padding: "10px 12px",
                }}
              >
                ⚠ This will purge ALL session data, localStorage, and terminate
                active connections. A 10-second countdown will begin. This
                action CANNOT be undone.
              </p>

              <div style={{ display: "flex", gap: 10 }}>
                <motion.button
                  data-ocid="destruct.cancel_button"
                  type="button"
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "1px solid rgba(0,212,255,0.3)",
                    borderRadius: 6,
                    padding: "10px",
                    color: "rgba(0,212,255,0.7)",
                    fontSize: "0.7rem",
                    fontFamily: "JetBrains Mono, monospace",
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                  }}
                >
                  ABORT
                </motion.button>
                <motion.button
                  data-ocid="destruct.confirm_button"
                  type="button"
                  onClick={handleConfirm}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    flex: 1,
                    background:
                      "linear-gradient(135deg, rgba(255,0,64,0.3), rgba(180,0,40,0.2))",
                    border: "1px solid rgba(255,0,64,0.6)",
                    borderRadius: 6,
                    padding: "10px",
                    color: "#ff0040",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    fontFamily: "JetBrains Mono, monospace",
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                    boxShadow: "0 0 16px rgba(255,0,64,0.2)",
                  }}
                >
                  CONFIRM PURGE
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
