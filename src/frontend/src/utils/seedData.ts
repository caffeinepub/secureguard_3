export const SEED_USERS = [
  {
    id: "1",
    name: "Ku Admin",
    username: "ku",
    email: "ku@secureguard.mil",
    role: "ADMIN",
    status: "active",
    lastLogin: "2026-03-25 09:14",
    accessLevel: "Full Access",
    department: "Command",
    blocked: false,
    permissions: ["Read", "Write", "Encrypt", "Backup", "Admin"],
  },
  {
    id: "2",
    name: "Alex Morgan",
    username: "alex.morgan",
    email: "alex.morgan@secureguard.mil",
    role: "ANALYST",
    status: "active",
    lastLogin: "2026-03-25 08:45",
    accessLevel: "Read/Write",
    department: "Intel",
    blocked: false,
    permissions: ["Read", "Write"],
  },
  {
    id: "3",
    name: "Sarah Chen",
    username: "s.chen",
    email: "s.chen@secureguard.mil",
    role: "OPERATOR",
    status: "active",
    lastLogin: "2026-03-24 22:10",
    accessLevel: "Read/Encrypt",
    department: "Operations",
    blocked: false,
    permissions: ["Read", "Encrypt"],
  },
  {
    id: "4",
    name: "Marcus Webb",
    username: "m.webb",
    email: "m.webb@secureguard.mil",
    role: "ANALYST",
    status: "inactive",
    lastLogin: "2026-03-20 14:30",
    accessLevel: "Read Only",
    department: "Logistics",
    blocked: false,
    permissions: ["Read"],
  },
  {
    id: "5",
    name: "Diana Ross",
    username: "d.ross",
    email: "d.ross@secureguard.mil",
    role: "GUEST",
    status: "pending",
    lastLogin: "Never",
    accessLevel: "None",
    department: "External",
    blocked: false,
    permissions: [],
  },
  {
    id: "6",
    name: "Jake Torres",
    username: "j.torres",
    email: "j.torres@secureguard.mil",
    role: "OPERATOR",
    status: "blocked",
    lastLogin: "2026-03-22 03:15",
    accessLevel: "Revoked",
    department: "Unknown",
    blocked: true,
    permissions: [],
  },
];

export type SeedUser = (typeof SEED_USERS)[0];

export const SEED_FILES = [
  {
    id: "f1",
    name: "OP_NIGHTFALL_BRIEF.pdf",
    size: "4.2 MB",
    sizeBytes: 4404019,
    encrypted: true,
    shards: 8,
    riskLevel: "critical" as const,
    uploadedBy: "ku",
    uploadedAt: "2026-03-25 07:30",
    status: "secured" as const,
    serverDest: "MIL-SERVER-01",
    keyHash: "a3f9c2d1e4b5a6f7",
  },
  {
    id: "f2",
    name: "SATELLITE_COORDS_Q1.xlsx",
    size: "1.8 MB",
    sizeBytes: 1887437,
    encrypted: true,
    shards: 4,
    riskLevel: "high" as const,
    uploadedBy: "alex.morgan",
    uploadedAt: "2026-03-24 18:20",
    status: "secured" as const,
    serverDest: "MIL-SERVER-02",
    keyHash: "b7e2f1a9c3d0e4f8",
  },
  {
    id: "f3",
    name: "RECON_PHOTOS_BATCH_7.zip",
    size: "128 MB",
    sizeBytes: 134217728,
    encrypted: true,
    shards: 16,
    riskLevel: "critical" as const,
    uploadedBy: "s.chen",
    uploadedAt: "2026-03-24 12:05",
    status: "transmitting" as const,
    serverDest: "MIL-SERVER-01",
    keyHash: "c9a3b1e7d5f2c4a1",
  },
  {
    id: "f4",
    name: "COMMS_LOG_MARCH.txt",
    size: "0.3 MB",
    sizeBytes: 314572,
    encrypted: false,
    shards: 0,
    riskLevel: "medium" as const,
    uploadedBy: "ku",
    uploadedAt: "2026-03-23 09:00",
    status: "pending_encrypt" as const,
    serverDest: "—",
    keyHash: "",
  },
  {
    id: "f5",
    name: "PERSONNEL_DOSSIER_A.docx",
    size: "2.1 MB",
    sizeBytes: 2202009,
    encrypted: true,
    shards: 6,
    riskLevel: "high" as const,
    uploadedBy: "m.webb",
    uploadedAt: "2026-03-22 16:45",
    status: "secured" as const,
    serverDest: "MIL-SERVER-03",
    keyHash: "d4c8e2f5a1b3c9d7",
  },
  {
    id: "f6",
    name: "SYSTEM_DIAGNOSTIC_FULL.log",
    size: "8.7 MB",
    sizeBytes: 9122611,
    encrypted: false,
    shards: 0,
    riskLevel: "low" as const,
    uploadedBy: "ku",
    uploadedAt: "2026-03-21 11:00",
    status: "pending_encrypt" as const,
    serverDest: "—",
    keyHash: "",
  },
];

export type SeedFile = (typeof SEED_FILES)[0];

export const SEED_LOGS = [
  {
    id: "l1",
    timestamp: "2026-03-25 09:14",
    username: "ku",
    ip: "10.0.0.1",
    action: "User Login",
    resource: "Authentication",
    type: "info" as const,
  },
  {
    id: "l2",
    timestamp: "2026-03-25 08:45",
    username: "alex.morgan",
    ip: "10.0.1.45",
    action: "User Login",
    resource: "Authentication",
    type: "info" as const,
  },
  {
    id: "l3",
    timestamp: "2026-03-25 07:30",
    username: "ku",
    ip: "10.0.0.1",
    action: "File Upload",
    resource: "OP_NIGHTFALL_BRIEF.pdf",
    type: "info" as const,
  },
  {
    id: "l4",
    timestamp: "2026-03-25 07:32",
    username: "ku",
    ip: "10.0.0.1",
    action: "File Encrypted",
    resource: "OP_NIGHTFALL_BRIEF.pdf",
    type: "info" as const,
  },
  {
    id: "l5",
    timestamp: "2026-03-25 07:35",
    username: "ku",
    ip: "10.0.0.1",
    action: "File Transmitted",
    resource: "MIL-SERVER-01",
    type: "info" as const,
  },
  {
    id: "l6",
    timestamp: "2026-03-25 03:15",
    username: "j.torres",
    ip: "203.45.67.89",
    action: "Unauthorized Access Attempt",
    resource: "File Vault",
    type: "critical" as const,
  },
  {
    id: "l7",
    timestamp: "2026-03-25 02:01",
    username: "SYSTEM",
    ip: "10.0.0.1",
    action: "Backup Completed",
    resource: "FULL_BACKUP_2026-03-25",
    type: "info" as const,
  },
  {
    id: "l8",
    timestamp: "2026-03-25 02:00",
    username: "SYSTEM",
    ip: "10.0.0.1",
    action: "Backup Started",
    resource: "FULL_BACKUP_2026-03-25",
    type: "info" as const,
  },
  {
    id: "l9",
    timestamp: "2026-03-24 22:45",
    username: "alex.morgan",
    ip: "10.0.1.45",
    action: "Bulk File Access",
    resource: "14 classified files",
    type: "warning" as const,
  },
  {
    id: "l10",
    timestamp: "2026-03-24 22:10",
    username: "s.chen",
    ip: "10.0.2.33",
    action: "User Login",
    resource: "Authentication",
    type: "info" as const,
  },
  {
    id: "l11",
    timestamp: "2026-03-24 19:10",
    username: "SYSTEM",
    ip: "10.0.0.1",
    action: "VPN Tunnel Dropped",
    resource: "MIL-SERVER-01",
    type: "warning" as const,
  },
  {
    id: "l12",
    timestamp: "2026-03-24 19:11",
    username: "SYSTEM",
    ip: "10.0.0.1",
    action: "VPN Reconnected",
    resource: "MIL-SERVER-01",
    type: "info" as const,
  },
  {
    id: "l13",
    timestamp: "2026-03-24 18:20",
    username: "alex.morgan",
    ip: "10.0.1.45",
    action: "File Upload",
    resource: "SATELLITE_COORDS_Q1.xlsx",
    type: "info" as const,
  },
  {
    id: "l14",
    timestamp: "2026-03-24 18:22",
    username: "alex.morgan",
    ip: "10.0.1.45",
    action: "File Encrypted",
    resource: "SATELLITE_COORDS_Q1.xlsx",
    type: "info" as const,
  },
  {
    id: "l15",
    timestamp: "2026-03-24 14:30",
    username: "d.ross",
    ip: "192.168.1.100",
    action: "User Registration",
    resource: "Authentication",
    type: "info" as const,
  },
  {
    id: "l16",
    timestamp: "2026-03-24 12:05",
    username: "s.chen",
    ip: "10.0.2.33",
    action: "File Upload",
    resource: "RECON_PHOTOS_BATCH_7.zip",
    type: "info" as const,
  },
  {
    id: "l17",
    timestamp: "2026-03-24 10:00",
    username: "ku",
    ip: "10.0.0.1",
    action: "Access Granted",
    resource: "alex.morgan – Read/Write",
    type: "info" as const,
  },
  {
    id: "l18",
    timestamp: "2026-03-23 09:00",
    username: "ku",
    ip: "10.0.0.1",
    action: "File Upload",
    resource: "COMMS_LOG_MARCH.txt",
    type: "info" as const,
  },
  {
    id: "l19",
    timestamp: "2026-03-22 16:45",
    username: "m.webb",
    ip: "10.0.3.12",
    action: "File Upload",
    resource: "PERSONNEL_DOSSIER_A.docx",
    type: "info" as const,
  },
  {
    id: "l20",
    timestamp: "2026-03-22 03:15",
    username: "j.torres",
    ip: "203.45.67.89",
    action: "Failed Login",
    resource: "Authentication",
    type: "error" as const,
  },
  {
    id: "l21",
    timestamp: "2026-03-21 11:00",
    username: "ku",
    ip: "10.0.0.1",
    action: "System Diagnostic",
    resource: "SYSTEM_DIAGNOSTIC_FULL.log",
    type: "info" as const,
  },
  {
    id: "l22",
    timestamp: "2026-03-20 14:30",
    username: "m.webb",
    ip: "10.0.3.12",
    action: "User Login",
    resource: "Authentication",
    type: "info" as const,
  },
  {
    id: "l23",
    timestamp: "2026-03-20 09:00",
    username: "SYSTEM",
    ip: "10.0.0.1",
    action: "Encryption Key Rotation",
    resource: "AES-256 Keys",
    type: "warning" as const,
  },
  {
    id: "l24",
    timestamp: "2026-03-18 02:00",
    username: "SYSTEM",
    ip: "10.0.0.1",
    action: "Backup Completed",
    resource: "FULL_BACKUP_2026-03-18",
    type: "info" as const,
  },
];

export type SeedLog = (typeof SEED_LOGS)[0];

export const SEED_ALERTS = [
  {
    id: "a1",
    severity: "critical" as const,
    title: "Unauthorized Access Attempt",
    description:
      "User j.torres attempted to access File Vault from IP 203.45.67.89 at 03:15 UTC",
    timestamp: "2026-03-25 03:15",
    acknowledged: false,
    user: "j.torres",
    ip: "203.45.67.89",
  },
  {
    id: "a2",
    severity: "critical" as const,
    title: "Multiple Failed Login Attempts",
    description:
      "7 failed login attempts for account d.ross from IP 185.220.101.42 in last 10 minutes",
    timestamp: "2026-03-25 08:22",
    acknowledged: false,
    user: "d.ross",
    ip: "185.220.101.42",
  },
  {
    id: "a3",
    severity: "warning" as const,
    title: "Unusual File Access Pattern",
    description:
      "User alex.morgan accessed 14 classified files in under 5 minutes — anomaly detected",
    timestamp: "2026-03-24 22:45",
    acknowledged: false,
    user: "alex.morgan",
    ip: "10.0.1.45",
  },
  {
    id: "a4",
    severity: "warning" as const,
    title: "VPN Connection Drop",
    description:
      "Secure tunnel to MIL-SERVER-01 dropped for 43 seconds — auto-reconnected",
    timestamp: "2026-03-24 19:10",
    acknowledged: true,
    user: "SYSTEM",
    ip: "10.0.0.1",
  },
  {
    id: "a5",
    severity: "info" as const,
    title: "New User Pending Approval",
    description:
      "Diana Ross (d.ross) has registered and is awaiting admin approval",
    timestamp: "2026-03-24 14:30",
    acknowledged: false,
    user: "d.ross",
    ip: "192.168.1.100",
  },
];

export type SeedAlert = (typeof SEED_ALERTS)[0];

export const SEED_BACKUPS = [
  {
    id: "b1",
    name: "FULL_BACKUP_2026-03-25",
    type: "Full" as const,
    size: "2.4 GB",
    status: "completed" as const,
    createdAt: "2026-03-25 02:00",
    files: 47,
    encrypted: true,
  },
  {
    id: "b2",
    name: "INCREMENTAL_2026-03-24",
    type: "Incremental" as const,
    size: "340 MB",
    status: "completed" as const,
    createdAt: "2026-03-24 02:00",
    files: 12,
    encrypted: true,
  },
  {
    id: "b3",
    name: "INCREMENTAL_2026-03-23",
    type: "Incremental" as const,
    size: "210 MB",
    status: "completed" as const,
    createdAt: "2026-03-23 02:00",
    files: 8,
    encrypted: true,
  },
  {
    id: "b4",
    name: "FULL_BACKUP_2026-03-18",
    type: "Full" as const,
    size: "2.1 GB",
    status: "completed" as const,
    createdAt: "2026-03-18 02:00",
    files: 43,
    encrypted: true,
  },
];

export type SeedBackup = (typeof SEED_BACKUPS)[0];

export const SEED_NOTIFICATIONS = [
  {
    id: "n1",
    type: "alert" as const,
    title: "Security Breach Detected",
    message: "Unauthorized access attempt blocked from 203.45.67.89",
    timestamp: "2026-03-25 03:15",
    read: false,
    priority: "critical" as const,
  },
  {
    id: "n2",
    type: "access" as const,
    title: "Access Granted",
    message: "Admin ku granted you Read/Write access to File Vault",
    timestamp: "2026-03-24 10:00",
    read: false,
    priority: "info" as const,
  },
  {
    id: "n3",
    type: "backup" as const,
    title: "Backup Complete",
    message: "FULL_BACKUP_2026-03-25 completed successfully (2.4 GB, 47 files)",
    timestamp: "2026-03-25 02:01",
    read: true,
    priority: "success" as const,
  },
  {
    id: "n4",
    type: "file" as const,
    title: "File Encrypted & Transmitted",
    message: "RECON_PHOTOS_BATCH_7.zip encrypted and sent to MIL-SERVER-01",
    timestamp: "2026-03-24 12:10",
    read: false,
    priority: "success" as const,
  },
  {
    id: "n5",
    type: "warning" as const,
    title: "VPN Reconnected",
    message: "Secure tunnel restored after brief interruption",
    timestamp: "2026-03-24 19:10",
    read: true,
    priority: "warning" as const,
  },
  {
    id: "n6",
    type: "user" as const,
    title: "New Pending User",
    message: "Diana Ross is awaiting your approval to access the system",
    timestamp: "2026-03-24 14:30",
    read: false,
    priority: "info" as const,
  },
];

export type SeedNotification = (typeof SEED_NOTIFICATIONS)[0];

const LS_USERS = "sg_users";
const LS_FILES = "sg_files";
const LS_LOGS = "sg_logs";
const LS_ALERTS = "sg_alerts";
const LS_BACKUPS = "sg_backups";
const LS_NOTIFICATIONS = "sg_notifications";
const LS_SEEDED = "sg_seeded_v1";

export function initSeedData(force = false) {
  if (!force && localStorage.getItem(LS_SEEDED)) return;
  localStorage.setItem(LS_USERS, JSON.stringify(SEED_USERS));
  localStorage.setItem(LS_FILES, JSON.stringify(SEED_FILES));
  localStorage.setItem(LS_LOGS, JSON.stringify(SEED_LOGS));
  localStorage.setItem(LS_ALERTS, JSON.stringify(SEED_ALERTS));
  localStorage.setItem(LS_BACKUPS, JSON.stringify(SEED_BACKUPS));
  localStorage.setItem(LS_NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
  localStorage.setItem(LS_SEEDED, "1");
}

export function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T[];
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const STORAGE_KEYS = {
  LS_USERS,
  LS_FILES,
  LS_LOGS,
  LS_ALERTS,
  LS_BACKUPS,
  LS_NOTIFICATIONS,
};
