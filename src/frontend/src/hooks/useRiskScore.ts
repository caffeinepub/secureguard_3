import { useRisk } from "../contexts/RiskContext";
import type { RiskEvent } from "../contexts/RiskContext";
import type { RiskLevel } from "../utils/riskCalculator";

export interface UseRiskScoreReturn {
  riskScore: number;
  riskLevel: RiskLevel;
  events: RiskEvent[];
  threatsBlocked: number;
  increaseRisk: (amount?: number) => void;
  decreaseRisk: (amount?: number) => void;
}

export function useRiskScore(): UseRiskScoreReturn {
  const {
    riskScore,
    riskLevel,
    events,
    threatsBlocked,
    increaseRisk,
    decreaseRisk,
  } = useRisk();
  return {
    riskScore,
    riskLevel,
    events,
    threatsBlocked,
    increaseRisk,
    decreaseRisk,
  };
}
