import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  type RiskLevel,
  formatRiskEvent,
  getRiskLevel,
  shouldTriggerNotification,
} from "../utils/riskCalculator";

export interface RiskEvent {
  id: string;
  message: string;
  type: string;
  score: number;
  timestamp: Date;
}

interface RiskContextValue {
  riskScore: number;
  riskLevel: RiskLevel;
  events: RiskEvent[];
  selfDestructTriggered: boolean;
  isRunning: boolean;
  threatsBlocked: number;
  increaseRisk: (amount?: number) => void;
  decreaseRisk: (amount?: number) => void;
  initiateSelfDestruct: () => void;
  resetSelfDestruct: () => void;
  startEngine: () => void;
  stopEngine: () => void;
  addEvent: (type: string, score: number) => void;
  onNotification?: (message: string, type: string) => void;
}

const RiskContext = createContext<RiskContextValue | null>(null);

export function RiskProvider({
  children,
  onNotification,
}: {
  children: React.ReactNode;
  onNotification?: (message: string, type: string) => void;
}) {
  const [riskScore, setRiskScore] = useState(30);
  const [events, setEvents] = useState<RiskEvent[]>([]);
  const [selfDestructTriggered, setSelfDestructTriggered] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [threatsBlocked, setThreatsBlocked] = useState(0);
  const prevScoreRef = useRef(30);

  const addEvent = useCallback((type: string, score: number) => {
    const evt: RiskEvent = {
      id: `${Date.now()}-${Math.random()}`,
      message: formatRiskEvent(type, score),
      type,
      score,
      timestamp: new Date(),
    };
    setEvents((prev) => [evt, ...prev].slice(0, 50));
  }, []);

  const increaseRisk = useCallback(
    (amount?: number) => {
      const inc = amount ?? 5 + Math.floor(Math.random() * 11);
      setRiskScore((prev) => {
        const newScore = Math.min(100, prev + inc);
        if (shouldTriggerNotification(prev, newScore)) {
          onNotification?.(
            `Risk score reached ${newScore} — ${getRiskLevel(newScore)} threat level`,
            newScore >= 70 ? "danger" : "warning",
          );
        }
        if (newScore >= 71 && prev < 71) {
          addEvent("threshold_high", newScore);
          onNotification?.(
            "HIGH RISK threshold breached — Immediate action required",
            "danger",
          );
        }
        if (newScore >= 100) {
          addEvent("threshold_critical", 100);
          setSelfDestructTriggered(true);
          onNotification?.(
            "CRITICAL: Self-destruct sequence initiated automatically",
            "danger",
          );
        } else {
          addEvent("increment", newScore);
        }
        setThreatsBlocked((t) => t + 1);
        prevScoreRef.current = newScore;
        return newScore;
      });
    },
    [addEvent, onNotification],
  );

  const decreaseRisk = useCallback(
    (amount?: number) => {
      const dec = amount ?? 5 + Math.floor(Math.random() * 6);
      setRiskScore((prev) => {
        const newScore = Math.max(0, prev - dec);
        if (newScore !== prev) addEvent("decrement", newScore);
        prevScoreRef.current = newScore;
        return newScore;
      });
    },
    [addEvent],
  );

  const initiateSelfDestruct = useCallback(() => {
    addEvent("self_destruct", riskScore);
    setSelfDestructTriggered(true);
    onNotification?.(
      "SELF-DESTRUCT sequence initiated — 10 seconds to purge",
      "danger",
    );
  }, [addEvent, riskScore, onNotification]);

  const resetSelfDestruct = useCallback(() => {
    setSelfDestructTriggered(false);
    setRiskScore(30);
    setEvents([]);
    setThreatsBlocked(0);
    prevScoreRef.current = 30;
  }, []);

  const startEngine = useCallback(() => setIsRunning(true), []);
  const stopEngine = useCallback(() => setIsRunning(false), []);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      increaseRisk();
    }, 15000);
    return () => clearInterval(id);
  }, [isRunning, increaseRisk]);

  return (
    <RiskContext.Provider
      value={{
        riskScore,
        riskLevel: getRiskLevel(riskScore),
        events,
        selfDestructTriggered,
        isRunning,
        threatsBlocked,
        increaseRisk,
        decreaseRisk,
        initiateSelfDestruct,
        resetSelfDestruct,
        startEngine,
        stopEngine,
        addEvent,
        onNotification,
      }}
    >
      {children}
    </RiskContext.Provider>
  );
}

export function useRisk(): RiskContextValue {
  const ctx = useContext(RiskContext);
  if (!ctx) throw new Error("useRisk must be used within RiskProvider");
  return ctx;
}
