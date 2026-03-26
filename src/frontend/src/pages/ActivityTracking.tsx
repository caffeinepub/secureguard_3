import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity, Clock, Eye, Shield, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { SecurityEvent } from "../backend";
import { Button3D } from "../components/Button3D";
import { useEvents } from "../hooks/useQueries";

const HOURS = Array.from({ length: 24 }, (_, h) => h);
const DAY_LABELS = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return d.toLocaleDateString(undefined, { weekday: "short" });
});

function riskColor(level: string): string {
  if (level === "critical") return "#ef4444";
  if (level === "suspicious") return "#f59e0b";
  return "#22c55e";
}

function ActivityBarChart({ events }: { events: SecurityEvent[] }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth || 400;
    const H = 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 4, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const now = Date.now();
    const dayMs = 86400000;
    const days: { safe: number; suspicious: number; critical: number }[] =
      Array.from({ length: 7 }, () => ({
        safe: 0,
        suspicious: 0,
        critical: 0,
      }));

    for (const ev of events) {
      const ts = Number(ev.timestamp) / 1_000_000;
      const diffDays = Math.floor((now - ts) / dayMs);
      if (diffDays >= 0 && diffDays < 7) {
        const idx = 6 - diffDays;
        if (ev.riskLevel === "critical") days[idx].critical++;
        else if (ev.riskLevel === "suspicious") days[idx].suspicious++;
        else days[idx].safe++;
      }
    }

    const barGroup = new THREE.Group();
    const spacing = 2;
    for (let i = 0; i < 7; i++) {
      const d = days[i];
      const total = d.safe + d.suspicious + d.critical || 1;
      const maxH = 3;
      const x = (i - 3) * spacing;

      const segments = [
        { count: d.safe, color: 0x22c55e },
        { count: d.suspicious, color: 0xf59e0b },
        { count: d.critical, color: 0xef4444 },
      ];

      let yOffset = 0;
      for (const seg of segments) {
        if (seg.count === 0) continue;
        const h = (seg.count / total) * maxH;
        const geo = new THREE.BoxGeometry(1.2, h, 0.6);
        const mat = new THREE.MeshPhongMaterial({
          color: seg.color,
          emissive: seg.color,
          emissiveIntensity: 0.15,
          transparent: true,
          opacity: 0.85,
        });
        const bar = new THREE.Mesh(geo, mat);
        bar.position.set(x, yOffset + h / 2, 0);
        barGroup.add(bar);
        yOffset += h;
      }
    }
    scene.add(barGroup);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(3, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x334466, 0.8));

    let animId: number;
    let t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.005;
      barGroup.rotation.y = Math.sin(t * 0.3) * 0.15;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement);
    };
  }, [events]);

  return <div ref={mountRef} style={{ width: "100%", height: 200 }} />;
}

export function ActivityTracking() {
  const { data: events = [] } = useEvents();
  const [userFilter, setUserFilter] = useState("all");
  const [timelineKey, setTimelineKey] = useState(0);

  const users = useMemo(() => {
    const s = new Set<string>();
    for (const e of events) s.add(e.userName);
    return Array.from(s);
  }, [events]);

  const userStats = useMemo(() => {
    const map = new Map<
      string,
      { safe: number; suspicious: number; critical: number; lastSeen: bigint }
    >();
    for (const ev of events) {
      const cur = map.get(ev.userName) ?? {
        safe: 0,
        suspicious: 0,
        critical: 0,
        lastSeen: BigInt(0),
      };
      if (ev.riskLevel === "critical") cur.critical++;
      else if (ev.riskLevel === "suspicious") cur.suspicious++;
      else cur.safe++;
      if (ev.timestamp > cur.lastSeen) cur.lastSeen = ev.timestamp;
      map.set(ev.userName, cur);
    }
    return map;
  }, [events]);

  const filteredEvents = useMemo(() => {
    const list =
      userFilter === "all"
        ? events
        : events.filter((e) => e.userName === userFilter);
    return [...list]
      .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
      .slice(0, 40);
  }, [events, userFilter]);

  const hourActivity = useMemo(() => {
    const counts = new Array(24).fill(0);
    for (const ev of events) {
      const ts = Number(ev.timestamp) / 1_000_000;
      const h = new Date(ts).getHours();
      counts[h]++;
    }
    return counts;
  }, [events]);

  const maxHour = Math.max(...hourActivity, 1);

  const refreshTimeline = () => {
    setTimelineKey((k) => k + 1);
  };

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-muted-foreground tracking-widest uppercase">
            SecureGuard – Activity
          </p>
          <h1 className="text-2xl font-bold text-foreground mt-0.5">
            Activity Tracking
          </h1>
        </div>
        <Button3D>
          <Button
            size="sm"
            onClick={refreshTimeline}
            className="h-8 text-xs bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
            variant="ghost"
          >
            <Activity className="w-3.5 h-3.5 mr-1.5" /> Refresh Timeline
          </Button>
        </Button3D>
      </div>

      {/* User Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from(userStats.entries())
          .slice(0, 8)
          .map(([user, stats], i) => (
            <motion.div
              key={user}
              initial={{ opacity: 0, y: 24, rotateX: -18, z: -30 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, z: 0 }}
              transition={{
                delay: i * 0.07,
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              whileHover={{
                scale: 1.04,
                rotateY: 3,
                boxShadow: "0 8px 32px oklch(0.55 0.25 250 / 0.2)",
              }}
              style={{
                transformStyle: "preserve-3d",
                perspective: 600,
                cursor: "default",
              }}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-3 h-3 text-primary" />
                    </div>
                    <p className="text-xs font-semibold text-foreground truncate">
                      {user}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-success">
                      ✓ {stats.safe}
                    </span>
                    <span className="text-[10px] text-warning">
                      ⚠ {stats.suspicious}
                    </span>
                    <span className="text-[10px] text-destructive">
                      ⛔ {stats.critical}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3D Bar Chart */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-[13px] font-semibold text-foreground">
              7-Day Activity
            </CardTitle>
            <div className="flex gap-3 text-[11px] mt-1">
              {DAY_LABELS.map((d) => (
                <span key={d} className="text-muted-foreground">
                  {d}
                </span>
              ))}
            </div>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <ActivityBarChart events={events} />
          </CardContent>
        </Card>

        {/* Hour Heatmap */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-[13px] font-semibold text-foreground">
              Activity by Hour
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex flex-wrap gap-1">
              {HOURS.map((h) => {
                const count = hourActivity[h];
                const intensity = count / maxHour;
                return (
                  <motion.div
                    key={h}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: h * 0.02 }}
                    title={`${h}:00 — ${count} events`}
                    className="rounded-sm cursor-default"
                    style={{
                      width: 28,
                      height: 28,
                      background: `oklch(${0.35 + intensity * 0.35} ${0.1 + intensity * 0.2} 250)`,
                      border: "1px solid oklch(0.3 0.05 250 / 0.4)",
                    }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
              <span>00:00</span>
              <span>12:00</span>
              <span>23:00</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 pt-4 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[13px] font-semibold text-foreground">
              Event Timeline
            </CardTitle>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-40 h-7 text-xs bg-secondary border-border">
                <SelectValue placeholder="All users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div
            className="relative pl-6 border-l border-border/50 space-y-1"
            key={timelineKey}
          >
            {filteredEvents.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">
                No events found
              </p>
            ) : (
              filteredEvents.map((ev, i) => (
                <motion.div
                  key={String(ev.id)}
                  initial={{ opacity: 0, y: 20, rotateX: -14, z: -20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, z: 0 }}
                  transition={{
                    delay: i * 0.05,
                    type: "spring",
                    stiffness: 220,
                    damping: 22,
                  }}
                  whileHover={{
                    x: 4,
                    boxShadow: "0 4px 16px oklch(0.55 0.25 250 / 0.12)",
                  }}
                  style={{ transformStyle: "preserve-3d", perspective: 500 }}
                  className="relative flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-accent/30 transition-colors"
                >
                  <div
                    className="absolute -left-7 top-3 w-2 h-2 rounded-full border border-background"
                    style={{ background: riskColor(ev.riskLevel ?? "") }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-semibold text-foreground">
                        {ev.userName}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {ev.action}
                      </span>
                      <Badge
                        className={`text-[9px] px-1 border ${
                          ev.riskLevel === "critical"
                            ? "bg-destructive/15 text-destructive border-destructive/25"
                            : ev.riskLevel === "suspicious"
                              ? "bg-warning/15 text-warning border-warning/25"
                              : "bg-success/15 text-success border-success/25"
                        }`}
                      >
                        {ev.riskLevel?.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(
                          Number(ev.timestamp) / 1_000_000,
                        ).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Eye className="w-2.5 h-2.5" />
                        {ev.ipAddress}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Shield
                      className="w-3 h-3"
                      style={{ color: riskColor(ev.riskLevel ?? "") }}
                    />
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: riskColor(ev.riskLevel ?? "") }}
                    >
                      {String(ev.riskScore)}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
