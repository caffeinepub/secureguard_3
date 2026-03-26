import List "mo:core/List";
import Nat "mo:core/Nat";
import Int "mo:core/Int";

module {
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

  type Actor = {
    var nextEventId : Nat;
    var nextAlertId : Nat;
    var nextBackupId : Nat;
    var nextNotificationId : Nat;
    events : List.List<SecurityEvent>;
    alerts : List.List<Alert>;
    backups : List.List<BackupRecord>;
    notifications : List.List<Notification>;
    var systemLocked : Bool;
    var lockReason : Text;
  };

  public func run(old : Actor) : Actor {
    old;
  };
};
