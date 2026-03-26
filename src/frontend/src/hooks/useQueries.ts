import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Alert,
  BackupRecord,
  Notification,
  SecurityEvent,
  SystemStatus,
} from "../backend";
import { UserRole } from "../backend";
import { useActor } from "./useActor";

export function useEvents() {
  const { actor, isFetching } = useActor();
  return useQuery<SecurityEvent[]>({
    queryKey: ["events"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAlerts() {
  const { actor, isFetching } = useActor();
  return useQuery<Alert[]>({
    queryKey: ["alerts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAlerts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBackups() {
  const { actor, isFetching } = useActor();
  return useQuery<BackupRecord[]>({
    queryKey: ["backups"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBackups();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useNotifications() {
  const { actor, isFetching } = useActor();
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotifications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSystemStatus() {
  const { actor, isFetching } = useActor();
  return useQuery<SystemStatus>({
    queryKey: ["systemStatus"],
    queryFn: async () => {
      if (!actor)
        return {
          totalEventsCount: 0n,
          lockReason: "",
          activeAlertsCount: 0n,
          locked: false,
        };
      return actor.getSystemStatus();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCallerRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["callerRole"],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      try {
        return await actor.getCallerUserRole();
      } catch {
        return UserRole.guest;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAcknowledgeAlert() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.acknowledgeAlert(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}

export function useDismissAlert() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.dismissAlert(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}

export function useCreateBackup() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, sizeKB }: { name: string; sizeKB: bigint }) =>
      actor!.createBackup(name, sizeKB),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["backups"] }),
  });
}

export function useDeleteBackup() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deleteBackup(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["backups"] }),
  });
}

export function useRestoreBackup() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.restoreBackup(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["backups"] }),
  });
}

export function useMarkNotificationRead() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.markNotificationRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useMarkAllNotificationsRead() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => actor!.markAllNotificationsRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useLockSystem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reason: string) => actor!.lockSystem(reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["systemStatus"] }),
  });
}

export function useUnlockSystem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => actor!.unlockSystem(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["systemStatus"] }),
  });
}

export function useClearLogs() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => actor!.clearLogs(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["systemStatus"] });
    },
  });
}

export function useSeedDemoData() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => actor!.seedDemoData(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["alerts"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["backups"] });
      qc.invalidateQueries({ queryKey: ["systemStatus"] });
    },
  });
}

export function useAddEvent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      userId: string;
      userName: string;
      action: string;
      resourceCount: bigint;
      ipAddress: string;
      riskScore: bigint;
      riskLevel: string;
    }) =>
      actor!.addEvent(
        params.userId,
        params.userName,
        params.action,
        params.resourceCount,
        params.ipAddress,
        params.riskScore,
        params.riskLevel,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["systemStatus"] });
    },
  });
}
