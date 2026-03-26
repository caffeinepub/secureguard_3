import { motion } from "motion/react";
import { getRiskColor, getRiskLevel } from "../utils/riskCalculator";

interface RiskGaugeProps {
  score: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
): string {
  if (Math.abs(endDeg - startDeg) < 0.01) return "";
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end = polarToCartesian(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x.toFixed(3)} ${start.y.toFixed(3)} A ${r} ${r} 0 ${largeArc} 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`;
}

const GAUGE_START = 135;
const GAUGE_TOTAL = 270;
const CX = 110;
const CY = 110;
const R = 82;
const R_INNER = 68;

export function RiskGauge({ score }: RiskGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const riskLevel = getRiskLevel(clampedScore);
  const riskColor = getRiskColor(clampedScore);

  const greenEnd = GAUGE_START + (30 / 100) * GAUGE_TOTAL;
  const yellowEnd = GAUGE_START + (70 / 100) * GAUGE_TOTAL;
  const redEnd = GAUGE_START + GAUGE_TOTAL;
  const progressEnd = GAUGE_START + (clampedScore / 100) * GAUGE_TOTAL;

  const needleAngle = GAUGE_START + (clampedScore / 100) * GAUGE_TOTAL;
  const needleRad = (needleAngle * Math.PI) / 180;
  const needleTipX = CX + 70 * Math.cos(needleRad);
  const needleTipY = CY + 70 * Math.sin(needleRad);

  const ticks = Array.from({ length: 11 }, (_, i) => i * 10);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <svg
        width={220}
        height={190}
        viewBox="0 0 220 190"
        role="img"
        aria-label={`Risk gauge showing ${Math.round(clampedScore)} — ${riskLevel} threat level`}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="gaugeCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,212,255,0.05)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        <circle cx={CX} cy={CY} r={R + 8} fill="url(#gaugeCenter)" />

        {/* Track segments */}
        <path
          d={describeArc(CX, CY, R, GAUGE_START, greenEnd)}
          fill="none"
          stroke="rgba(0,255,136,0.12)"
          strokeWidth={10}
          strokeLinecap="round"
        />
        <path
          d={describeArc(CX, CY, R, greenEnd, yellowEnd)}
          fill="none"
          stroke="rgba(255,170,0,0.12)"
          strokeWidth={10}
          strokeLinecap="round"
        />
        <path
          d={describeArc(CX, CY, R, yellowEnd, redEnd)}
          fill="none"
          stroke="rgba(255,0,64,0.12)"
          strokeWidth={10}
          strokeLinecap="round"
        />

        {/* Progress arc */}
        {clampedScore > 0 && (
          <motion.path
            d={describeArc(CX, CY, R, GAUGE_START, progressEnd)}
            fill="none"
            stroke={riskColor}
            strokeWidth={10}
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}

        {/* Tick marks */}
        {ticks.map((tickVal) => {
          const tickAngle = GAUGE_START + (tickVal / 100) * GAUGE_TOTAL;
          const tickRad = (tickAngle * Math.PI) / 180;
          const outerR = R + 16;
          const innerR = R + 10;
          return (
            <line
              key={tickVal}
              x1={CX + outerR * Math.cos(tickRad)}
              y1={CY + outerR * Math.sin(tickRad)}
              x2={CX + innerR * Math.cos(tickRad)}
              y2={CY + innerR * Math.sin(tickRad)}
              stroke="rgba(224,224,255,0.2)"
              strokeWidth={tickVal % 50 === 0 ? 2 : 1}
            />
          );
        })}

        <path
          d={describeArc(
            CX,
            CY,
            R_INNER,
            GAUGE_START,
            GAUGE_START + GAUGE_TOTAL,
          )}
          fill="none"
          stroke="rgba(0,212,255,0.06)"
          strokeWidth={1}
        />

        {/* Needle */}
        <motion.line
          x1={CX}
          y1={CY}
          animate={{ x2: needleTipX, y2: needleTipY }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          stroke="rgba(224,224,255,0.9)"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <circle cx={CX} cy={CY} r={4} fill={riskColor} filter="url(#glow)" />
        <circle cx={CX} cy={CY} r={2} fill="#e0e0ff" />

        <text
          x={CX}
          y={CY + 24}
          textAnchor="middle"
          fontSize={28}
          fontWeight={900}
          fontFamily="JetBrains Mono, monospace"
          fill={riskColor}
          style={{ filter: `drop-shadow(0 0 8px ${riskColor})` }}
        >
          {Math.round(clampedScore)}
        </text>
        <text
          x={CX}
          y={CY + 40}
          textAnchor="middle"
          fontSize={9}
          fontFamily="JetBrains Mono, monospace"
          fill="rgba(224,224,255,0.5)"
          letterSpacing={2}
        >
          RISK SCORE
        </text>
        <text
          x={52}
          y={170}
          textAnchor="middle"
          fontSize={8}
          fontFamily="JetBrains Mono, monospace"
          fill="rgba(0,255,136,0.5)"
        >
          LOW
        </text>
        <text
          x={CX}
          y={32}
          textAnchor="middle"
          fontSize={8}
          fontFamily="JetBrains Mono, monospace"
          fill="rgba(255,170,0,0.5)"
        >
          MED
        </text>
        <text
          x={168}
          y={170}
          textAnchor="middle"
          fontSize={8}
          fontFamily="JetBrains Mono, monospace"
          fill="rgba(255,0,64,0.5)"
        >
          HIGH
        </text>
      </svg>

      <motion.div
        animate={{ scale: clampedScore >= 100 ? [1, 1.05, 1] : 1 }}
        transition={{
          duration: 0.5,
          repeat: clampedScore >= 100 ? Number.POSITIVE_INFINITY : 0,
        }}
        style={{
          background: `${riskColor}18`,
          border: `1px solid ${riskColor}55`,
          borderRadius: 100,
          padding: "4px 16px",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.15em",
          color: riskColor,
          boxShadow: `0 0 12px ${riskColor}30`,
          marginTop: -4,
        }}
      >
        {riskLevel.toUpperCase()} THREAT
      </motion.div>
    </div>
  );
}
