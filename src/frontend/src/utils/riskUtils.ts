export function computeRisk(
  action: string,
  resourceCount: number,
  failedLoginCount = 1,
): { score: number; level: string } {
  switch (action) {
    case "failed_login": {
      const score = Math.min(100, failedLoginCount * 20);
      const level =
        score > 70 ? "critical" : score > 30 ? "suspicious" : "safe";
      return { score, level };
    }
    case "mass_download":
      if (resourceCount > 100) return { score: 70, level: "critical" };
      return { score: 40, level: "suspicious" };
    case "file_access": {
      const score = Math.min(60, resourceCount * 2);
      return { score, level: score > 30 ? "suspicious" : "safe" };
    }
    case "login":
      return { score: 10, level: "safe" };
    default:
      return { score: 20, level: "safe" };
  }
}

export function getRiskColor(level: string): string {
  switch (level?.toLowerCase()) {
    case "critical":
      return "text-destructive";
    case "suspicious":
      return "text-warning";
    case "safe":
      return "text-success";
    default:
      return "text-muted-foreground";
  }
}

export function getRiskBadgeClass(level: string): string {
  switch (level?.toLowerCase()) {
    case "critical":
      return "bg-destructive/20 text-destructive border-destructive/30";
    case "suspicious":
      return "bg-warning/20 text-warning border-warning/30";
    case "safe":
      return "bg-success/20 text-success border-success/30";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function getSeverityBadgeClass(severity: string): string {
  switch (severity?.toLowerCase()) {
    case "critical":
      return "bg-destructive/20 text-destructive border-destructive/30";
    case "high":
      return "bg-orange/20 text-orange border-orange/30";
    case "medium":
      return "bg-warning/20 text-warning border-warning/30";
    case "low":
      return "bg-success/20 text-success border-success/30";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function formatTs(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleString();
}

export function randomIP(): string {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

const USERNAMES = [
  "alice_admin",
  "bob_dev",
  "carol_ops",
  "dave_sec",
  "eve_audit",
  "frank_db",
  "grace_net",
];
const ACTIONS = [
  "login",
  "failed_login",
  "file_access",
  "mass_download",
  "config_change",
  "data_export",
];

export function randomEventParams() {
  const userName = USERNAMES[Math.floor(Math.random() * USERNAMES.length)];
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  const resourceCount = Math.floor(Math.random() * 200);
  const ipAddress = randomIP();
  const userId = `user_${Math.floor(Math.random() * 1000)}`;
  const { score, level } = computeRisk(action, resourceCount);
  return {
    userName,
    action,
    resourceCount,
    ipAddress,
    userId,
    riskScore: score,
    riskLevel: level,
  };
}
