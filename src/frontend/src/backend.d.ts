import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BackupRecord {
    id: bigint;
    status: string;
    name: string;
    createdAt: bigint;
    sizeKB: bigint;
}
export interface SecurityEvent {
    id: bigint;
    userName: string;
    action: string;
    userId: string;
    resourceCount: bigint;
    timestamp: bigint;
    riskLevel: string;
    riskScore: bigint;
    ipAddress: string;
}
export interface Notification {
    id: bigint;
    notifType: string;
    read: boolean;
    message: string;
    timestamp: bigint;
}
export interface Alert {
    id: bigint;
    title: string;
    acknowledged: boolean;
    message: string;
    timestamp: bigint;
    severity: string;
    dismissed: boolean;
}
export interface SystemStatus {
    totalEventsCount: bigint;
    lockReason: string;
    activeAlertsCount: bigint;
    locked: boolean;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acknowledgeAlert(id: bigint): Promise<boolean>;
    addEvent(userId: string, userName: string, action: string, resourceCount: bigint, ipAddress: string, riskScore: bigint, riskLevel: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearLogs(): Promise<void>;
    createBackup(name: string, sizeKB: bigint): Promise<bigint>;
    deleteBackup(id: bigint): Promise<boolean>;
    dismissAlert(id: bigint): Promise<boolean>;
    getAlerts(): Promise<Array<Alert>>;
    getBackups(): Promise<Array<BackupRecord>>;
    getCallerUserRole(): Promise<UserRole>;
    getEvents(): Promise<Array<SecurityEvent>>;
    getNotifications(): Promise<Array<Notification>>;
    getSystemStatus(): Promise<SystemStatus>;
    isCallerAdmin(): Promise<boolean>;
    lockSystem(reason: string): Promise<void>;
    markAllNotificationsRead(): Promise<void>;
    markNotificationRead(id: bigint): Promise<boolean>;
    restoreBackup(id: bigint): Promise<boolean>;
    seedDemoData(): Promise<void>;
    unlockSystem(): Promise<void>;
}
