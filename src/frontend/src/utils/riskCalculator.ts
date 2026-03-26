export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 30) return "Low";
  if (score <= 70) return "Medium";
  if (score <= 99) return "High";
  return "Critical";
}

export function getRiskColor(score: number): string {
  if (score <= 30) return "#00ff88";
  if (score <= 70) return "#ffaa00";
  if (score <= 99) return "#ff6600";
  return "#ff0040";
}

export function getRiskColorOklch(score: number): string {
  if (score <= 30) return "oklch(0.88 0.22 155)";
  if (score <= 70) return "oklch(0.79 0.18 75)";
  if (score <= 99) return "oklch(0.72 0.22 40)";
  return "oklch(0.55 0.26 18)";
}

export function formatRiskEvent(type: string, score: number): string {
  const ts = new Date().toLocaleTimeString();
  switch (type) {
    case "increment":
      return `[${ts}] Risk score elevated to ${score} — Threat detected`;
    case "decrement":
      return `[${ts}] Risk mitigated — Score reduced to ${score}`;
    case "login":
      return `[${ts}] Authentication successful — Session initiated`;
    case "self_destruct":
      return `[${ts}] SELF-DESTRUCT sequence initiated — Score: ${score}`;
    case "threshold_high":
      return `[${ts}] HIGH RISK threshold breached — Score: ${score}`;
    case "threshold_critical":
      return `[${ts}] ⚠ CRITICAL threshold reached — Score: ${score}`;
    default:
      return `[${ts}] System event — Score: ${score}`;
  }
}

export function shouldTriggerNotification(
  oldScore: number,
  newScore: number,
): boolean {
  const oldDecile = Math.floor(oldScore / 10);
  const newDecile = Math.floor(newScore / 10);
  return newDecile > oldDecile;
}
