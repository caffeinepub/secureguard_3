import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  SEED_ALERTS,
  SEED_BACKUPS,
  SEED_FILES,
  SEED_LOGS,
  SEED_NOTIFICATIONS,
  SEED_USERS,
  STORAGE_KEYS,
  type SeedAlert,
  type SeedBackup,
  type SeedFile,
  type SeedLog,
  type SeedNotification,
  type SeedUser,
  initSeedData,
  loadFromStorage,
  saveToStorage,
} from "../utils/seedData";

export type Page =
  | "dashboard"
  | "logs"
  | "alerts"
  | "backups"
  | "files"
  | "activity"
  | "access-control"
  | "notifications"
  | "admin"
  | "about";

interface AppState {
  users: SeedUser[];
  files: SeedFile[];
  logs: SeedLog[];
  alerts: SeedAlert[];
  backups: SeedBackup[];
  notifications: SeedNotification[];
  setUsers: (users: SeedUser[]) => void;
  setFiles: (files: SeedFile[]) => void;
  setLogs: (logs: SeedLog[]) => void;
  setAlerts: (alerts: SeedAlert[]) => void;
  setBackups: (backups: SeedBackup[]) => void;
  setNotifications: (notifications: SeedNotification[]) => void;
  addLog: (log: Omit<SeedLog, "id">) => void;
  addNotification: (n: Omit<SeedNotification, "id">) => void;
  reseedAll: () => void;
  navigateTo: (page: Page) => void;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [users, setUsersState] = useState<SeedUser[]>([]);
  const [files, setFilesState] = useState<SeedFile[]>([]);
  const [logs, setLogsState] = useState<SeedLog[]>([]);
  const [alerts, setAlertsState] = useState<SeedAlert[]>([]);
  const [backups, setBackupsState] = useState<SeedBackup[]>([]);
  const [notifications, setNotificationsState] = useState<SeedNotification[]>(
    [],
  );

  useEffect(() => {
    initSeedData();
    setUsersState(loadFromStorage(STORAGE_KEYS.LS_USERS, SEED_USERS));
    setFilesState(loadFromStorage(STORAGE_KEYS.LS_FILES, SEED_FILES));
    setLogsState(loadFromStorage(STORAGE_KEYS.LS_LOGS, SEED_LOGS));
    setAlertsState(loadFromStorage(STORAGE_KEYS.LS_ALERTS, SEED_ALERTS));
    setBackupsState(loadFromStorage(STORAGE_KEYS.LS_BACKUPS, SEED_BACKUPS));
    setNotificationsState(
      loadFromStorage(STORAGE_KEYS.LS_NOTIFICATIONS, SEED_NOTIFICATIONS),
    );
  }, []);

  const setUsers = useCallback((u: SeedUser[]) => {
    setUsersState(u);
    saveToStorage(STORAGE_KEYS.LS_USERS, u);
  }, []);

  const setFiles = useCallback((f: SeedFile[]) => {
    setFilesState(f);
    saveToStorage(STORAGE_KEYS.LS_FILES, f);
  }, []);

  const setLogs = useCallback((l: SeedLog[]) => {
    setLogsState(l);
    saveToStorage(STORAGE_KEYS.LS_LOGS, l);
  }, []);

  const setAlerts = useCallback((a: SeedAlert[]) => {
    setAlertsState(a);
    saveToStorage(STORAGE_KEYS.LS_ALERTS, a);
  }, []);

  const setBackups = useCallback((b: SeedBackup[]) => {
    setBackupsState(b);
    saveToStorage(STORAGE_KEYS.LS_BACKUPS, b);
  }, []);

  const setNotifications = useCallback((n: SeedNotification[]) => {
    setNotificationsState(n);
    saveToStorage(STORAGE_KEYS.LS_NOTIFICATIONS, n);
  }, []);

  const addLog = useCallback((log: Omit<SeedLog, "id">) => {
    setLogsState((prev) => {
      const next = [{ ...log, id: `l${Date.now()}` }, ...prev];
      saveToStorage(STORAGE_KEYS.LS_LOGS, next);
      return next;
    });
  }, []);

  const addNotification = useCallback((n: Omit<SeedNotification, "id">) => {
    setNotificationsState((prev) => {
      const newItem = { ...n, id: `n${Date.now()}` } as SeedNotification;
      const next = [newItem, ...prev];
      saveToStorage(STORAGE_KEYS.LS_NOTIFICATIONS, next);
      return next;
    });
  }, []);

  const reseedAll = useCallback(() => {
    initSeedData(true);
    setUsersState(SEED_USERS);
    setFilesState(SEED_FILES);
    setLogsState(SEED_LOGS);
    setAlertsState(SEED_ALERTS);
    setBackupsState(SEED_BACKUPS);
    setNotificationsState(SEED_NOTIFICATIONS);
  }, []);

  const navigateTo = useCallback((page: Page) => setCurrentPage(page), []);

  return (
    <AppStateContext.Provider
      value={{
        users,
        files,
        logs,
        alerts,
        backups,
        notifications,
        setUsers,
        setFiles,
        setLogs,
        setAlerts,
        setBackups,
        setNotifications,
        addLog,
        addNotification,
        reseedAll,
        navigateTo,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}
