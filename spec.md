# SENTINEL - Data Self-Destruction System

## Current State
Existing project is SecureGuard v6 — a secure file vault system with multiple modules (Login, Dashboard, Admin, File Vault, Logs, Alerts, Backups, Notifications, Activity). Has an existing Motoko backend and React/TypeScript frontend with Three.js 3D login.

## Requested Changes (Diff)

### Add
- New SENTINEL brand identity replacing SecureGuard
- Cyberpunk neon blue/purple theme throughout
- Login page with Three.js 3D scene: rotating icosahedron/torus knot with neon gradient, floating particles, glassmorphism card with floating animation
- "Protected by Zero-Knowledge Authentication" badge on login
- Internet Identity + email/password auth (demo: admin@sentinel.com / password123)
- Auth token in localStorage with 30-minute expiry
- Risk scoring system: base 30, increments 5-15pts every 15s, decreases on user interaction
- Risk levels: Low (0-30), Medium (31-70), High (71-99), Critical (100)
- Animated SVG circular risk gauge (0-100) with needle and color zones
- Self-destruct system: triggered at score 100 or manual button click, 10s countdown, clear all storage, "SYSTEM PURGED" screen, redirect after 3s
- Activity timeline showing events
- Security metrics cards: Active Sessions, Threats Blocked, Last Scan
- Notification bell with dropdown showing last 10 alerts
- Toast notifications for risk changes, suspicious logins, self-destruct countdown
- Browser desktop notifications permission request on login
- Status indicators: Threat Detection, Behavioral Monitoring, Risk Engine
- Risk > 70: red pulse background effect on dashboard
- Self-destruct: screen shake, red flash, countdown display
- Keyboard shortcuts: D (self-destruct), N (toggle notifications)
- AuthContext, NotificationContext, RiskContext
- useRiskScore hook, useNotifications hook
- riskCalculator utility

### Modify
- App.tsx: replace SecureGuard routing with SENTINEL two-screen flow (Login → Dashboard)
- index.css: cyberpunk neon theme, animated gradient borders
- Replace existing login with new 3D SENTINEL login

### Remove
- Old SecureGuard multi-module sidebar navigation (Admin, File Vault, Logs, Alerts, Backups, etc.)
- Existing dashboard replaced with SENTINEL risk dashboard

## Implementation Plan
1. Update backend with user authentication and risk event storage
2. Create AuthContext with localStorage token + 30min expiry
3. Create RiskContext with scoring algorithm (base 30, increments every 15s)
4. Create NotificationContext for toast + desktop notifications
5. Build LoginScene.tsx: Three.js icosahedron/torus knot, particles, glassmorphism card
6. Build RiskGauge.tsx: SVG circular gauge with animated needle
7. Build ActivityLog.tsx: scrollable timeline of events
8. Build NotificationBell.tsx: bell icon with dropdown, last 10 alerts
9. Build SelfDestructButton.tsx: red glowing button, confirmation modal, countdown
10. Build Dashboard.tsx: risk gauge + activity log + metrics cards + status indicators + red pulse bg on high risk
11. Wire App.tsx with auth flow Login → Dashboard → SYSTEM PURGED
12. Add keyboard shortcuts, screen shake/flash effects
