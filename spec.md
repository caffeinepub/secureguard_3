# SENTINEL - Data Self-Destruction System

## Current State
Full SENTINEL app exists with: 3D login scene, Dashboard with risk gauge, self-destruct button, notification bell, activity log, sidebar navigation, and pages for Admin, Logs, Alerts, Backups, File Vault, Notifications, Activity Tracking, Access Control.

## Requested Changes (Diff)

### Add
- Admin Panel page with full user management: grant/revoke access, access levels (Read/Write/Encrypt/Backup), search/filter users, animated key/lock animations on grant/revoke
- Access control enforcement: unauthorized users see an alert notification and cannot access restricted pages
- Notification system: toast notifications for risk score changes (every 10% threshold), suspicious login attempts, self-destruct countdown, system status changes
- Desktop browser notification permission request on login
- Notification history panel (last 10 alerts) visible from bell dropdown
- Keyboard shortcuts: D = trigger self-destruct, N = toggle notifications panel
- Risk score > 70: subtle red pulse effect on dashboard background
- All dashboard modules populated with sample data: Logs, Alerts, Backups, File Vault, Activity
- Security metrics cards: Active Sessions, Threats Blocked, Last Scan
- Complete sidebar with all module links working
- "Protected by Zero-Knowledge Authentication" badge on login

### Modify
- Dashboard: add animated background red pulse when risk > 70, ensure all status indicators (Threat Detection, Behavioral Monitoring, Risk Engine) are visible
- LoginForm: add "Protected by Zero-Knowledge Authentication" badge, add Internet Identity button alongside email/password
- NotificationBell: show notification history (last 10) in dropdown panel
- RiskGauge: ensure color zones green→yellow→red with animated needle
- SelfDestructButton: 10-second countdown with screen shake + red flash on activation

### Remove
- Nothing removed

## Implementation Plan
1. Update LoginForm to add ZK badge + Internet Identity mock button
2. Update Dashboard to add red pulse animation when riskScore > 70, ensure all status cards show
3. Update NotificationBell dropdown to show last 10 notification history
4. Ensure all sidebar pages have full sample data (Logs, Alerts, Backups, Files, Activity, Admin)
5. Admin page: full user list with grant/revoke actions, access level selectors, search, key/lock animations
6. AccessControl page: role-based gate that shows unauthorized alert if user lacks permission
7. Add keyboard shortcuts D and N in Dashboard
8. Request desktop notification permission after login
9. Ensure SelfDestructButton countdown has screen shake + red flash effect
