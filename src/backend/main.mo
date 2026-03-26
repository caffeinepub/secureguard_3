import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Int "mo:core/Int";
import List "mo:core/List";
import Bool "mo:core/Bool";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

import MixinStorage "blob-storage/Mixin";


actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type SecurityEvent = {
    id : Nat;
    userId : Text;
    userName : Text;
    action : Text;
    resourceCount : Nat;
    ipAddress : Text;
    timestamp : Int;
    riskScore : Nat;
    riskLevel : Text;
  };

  type Alert = {
    id : Nat;
    title : Text;
    message : Text;
    severity : Text;
    timestamp : Int;
    acknowledged : Bool;
    dismissed : Bool;
  };

  type BackupRecord = {
    id : Nat;
    name : Text;
    createdAt : Int;
    sizeKB : Nat;
    status : Text;
  };

  type Notification = {
    id : Nat;
    message : Text;
    notifType : Text;
    timestamp : Int;
    read : Bool;
  };

  type SystemStatus = {
    locked : Bool;
    lockReason : Text;
    activeAlertsCount : Nat;
    totalEventsCount : Nat;
  };

  var nextEventId = 0;
  var nextAlertId = 0;
  var nextBackupId = 0;
  var nextNotificationId = 0;

  let events = List.empty<SecurityEvent>();
  let alerts = List.empty<Alert>();
  let backups = List.empty<BackupRecord>();
  let notifications = List.empty<Notification>();

  var systemLocked = false;
  var lockReason = "";

  public query ({ caller }) func getEvents() : async [SecurityEvent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view events");
    };
    events.toArray();
  };

  public query ({ caller }) func getAlerts() : async [Alert] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view alerts");
    };
    alerts.filter(func(alert) { not alert.dismissed }).toArray();
  };

  public query ({ caller }) func getBackups() : async [BackupRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view backups");
    };
    backups.toArray();
  };

  public query ({ caller }) func getNotifications() : async [Notification] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view notifications");
    };
    notifications.filter(func(notif) { not notif.read }).toArray();
  };

  public query ({ caller }) func getSystemStatus() : async SystemStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view system status");
    };
    {
      locked = systemLocked;
      lockReason;
      activeAlertsCount = alerts.filter(func(alert) { not alert.dismissed }).toArray().size();
      totalEventsCount = events.toArray().size();
    };
  };

  public shared ({ caller }) func addEvent(userId : Text, userName : Text, action : Text, resourceCount : Nat, ipAddress : Text, riskScore : Nat, riskLevel : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add events");
    };
    let eventId = nextEventId;
    let event : SecurityEvent = {
      id = eventId;
      userId;
      userName;
      action;
      resourceCount;
      ipAddress;
      timestamp = Time.now();
      riskScore;
      riskLevel;
    };
    events.add(event);
    nextEventId += 1;

    if (riskLevel == "critical") {
      let alertId = nextAlertId;
      let alert : Alert = {
        id = alertId;
        title = "Critical Security Event";
        message = "A critical event was detected for user " # userName;
        severity = "critical";
        timestamp = Time.now();
        acknowledged = false;
        dismissed = false;
      };
      alerts.add(alert);
      nextAlertId += 1;

      let notifId = nextNotificationId;
      let notification : Notification = {
        id = notifId;
        message = "Critical security event detected for user " # userName;
        notifType = "alert";
        timestamp = Time.now();
        read = false;
      };
      notifications.add(notification);
      nextNotificationId += 1;
    };
    eventId;
  };

  public shared ({ caller }) func acknowledgeAlert(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can acknowledge alerts");
    };
    switch (alerts.toArray().find(func(a) { a.id == id })) {
      case (?alert) {
        let updatedAlert : Alert = {
          id = alert.id;
          title = alert.title;
          message = alert.message;
          severity = alert.severity;
          timestamp = alert.timestamp;
          acknowledged = true;
          dismissed = alert.dismissed;
        };
        let updatedAlerts = alerts.toArray().map(func(a) { if (a.id == id) { updatedAlert } else { a } });
        alerts.clear();
        alerts.addAll(updatedAlerts.values());
        true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func dismissAlert(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can dismiss alerts");
    };
    switch (alerts.toArray().find(func(a) { a.id == id })) {
      case (?alert) {
        let updatedAlert : Alert = {
          id = alert.id;
          title = alert.title;
          message = alert.message;
          severity = alert.severity;
          timestamp = alert.timestamp;
          acknowledged = alert.acknowledged;
          dismissed = true;
        };
        let updatedAlerts = alerts.toArray().map(func(a) { if (a.id == id) { updatedAlert } else { a } });
        alerts.clear();
        alerts.addAll(updatedAlerts.values());
        true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func createBackup(name : Text, sizeKB : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create backups");
    };
    let backupId = nextBackupId;
    let backup : BackupRecord = {
      id = backupId;
      name;
      createdAt = Time.now();
      sizeKB;
      status = "created";
    };
    backups.add(backup);
    nextBackupId += 1;
    backupId;
  };

  public shared ({ caller }) func deleteBackup(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete backups");
    };
    if (not backups.toArray().any(func(b) { b.id == id })) {
      return false;
    };
    let newBackups = backups.toArray().filter(func(b) { b.id != id });
    backups.clear();
    backups.addAll(newBackups.values());
    true;
  };

  public shared ({ caller }) func restoreBackup(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can restore backups");
    };
    switch (backups.toArray().find(func(b) { b.id == id })) {
      case (?backup) {
        let updatedBackup : BackupRecord = {
          id = backup.id;
          name = backup.name;
          createdAt = backup.createdAt;
          sizeKB = backup.sizeKB;
          status = "restored";
        };
        let newBackupArray = backups.toArray().map(func(b) { if (b.id == id) { updatedBackup } else { b } });
        backups.clear();
        backups.addAll(newBackupArray.values());
        true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func markNotificationRead(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark notifications as read");
    };
    switch (notifications.toArray().find(func(n) { n.id == id })) {
      case (?notif) {
        let updatedNotif : Notification = {
          id = notif.id;
          message = notif.message;
          notifType = notif.notifType;
          timestamp = notif.timestamp;
          read = true;
        };
        let updatedNotifs = notifications.toArray().map(func(n) { if (n.id == id) { updatedNotif } else { n } });
        notifications.clear();
        notifications.addAll(updatedNotifs.values());
        true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func markAllNotificationsRead() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark notifications as read");
    };
    let updatedNotifs = notifications.toArray().map(
      func(n) {
        {
          id = n.id;
          message = n.message;
          notifType = n.notifType;
          timestamp = n.timestamp;
          read = true;
        };
      }
    );
    notifications.clear();
    notifications.addAll(updatedNotifs.values());
  };

  public shared ({ caller }) func lockSystem(reason : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can lock the system");
    };
    systemLocked := true;
    lockReason := reason;
  };

  public shared ({ caller }) func unlockSystem() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can unlock the system");
    };
    systemLocked := false;
    lockReason := "";
  };

  public shared ({ caller }) func clearLogs() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear logs");
    };
    events.clear();
    alerts.clear();
    notifications.clear();
  };

  public shared ({ caller }) func seedDemoData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can seed demo data");
    };

    let demoEvents = [
      {
        id = 0;
        userId = "user1";
        userName = "Alice";
        action = "login";
        resourceCount = 1;
        ipAddress = "192.168.1.1";
        timestamp = Time.now() - 7200;
        riskScore = 80;
        riskLevel = "medium";
      },
      {
        id = 1;
        userId = "user2";
        userName = "Bob";
        action = "file_delete";
        resourceCount = 5;
        ipAddress = "192.168.1.2";
        timestamp = Time.now() - 3600;
        riskScore = 120;
        riskLevel = "critical";
      },
    ];

    let demoAlerts = [
      {
        id = 0;
        title = "Suspicious File Deletion";
        message = "User Bob deleted 5 files";
        severity = "medium";
        timestamp = Time.now() - 1800;
        acknowledged = false;
        dismissed = false;
      }
    ];

    let demoBackups = [
      {
        id = 0;
        name = "Backup 1";
        createdAt = Time.now() - 86400;
        sizeKB = 5000;
        status = "created";
      }
    ];

    let demoNotifications = [
      {
        id = 0;
        message = "New backup created";
        notifType = "backup";
        timestamp = Time.now() - 300;
        read = false;
      }
    ];

    events.clear();
    alerts.clear();
    backups.clear();
    notifications.clear();

    events.addAll(demoEvents.values());
    alerts.addAll(demoAlerts.values());
    backups.addAll(demoBackups.values());
    notifications.addAll(demoNotifications.values());
  };
};
