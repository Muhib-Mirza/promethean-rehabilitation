"use client";

import { useState } from "react";

// Hand-rolled multi-series SVG bar chart — same props, coordinate system and
// hover behaviour as LineChart so the two are drop-in interchangeable. Each
// `points` entry is a band on the x-axis; series render as grouped bars
// within the band. `null` values render no bar.

const W = 680;
const H = 250;
const PAD_TOP = 16;
const PAD_BOTTOM = 42;
const PAD_RIGHT = 16;

function niceTicks(min, max) {
  const span = max - min;
  if (span <= 0) return [min];
  const step = span <= 6 ? 1 : span / 4;
  const ticks = [];
  for (let v = min; v <= max + 1e-9; v += step) ticks.push(Math.round(v * 100) / 100);
  return ticks;
}

export function BarChart({
  points,
  series,
  yMin = 0,
  yMax = 100,
  yTicks,
  formatY = (v) => `${v}`,
  padLeft = 48,
  showLegend = true,
}) {
  const [activeIndex, setActiveIndex] = useState(null);

  const n = points.length;
  const plotW = W - padLeft - PAD_RIGHT;
  const plotH = H - PAD_TOP - PAD_BOTTOM;
  const ticks = yTicks ?? niceTicks(yMin, yMax);
  const range = yMax - yMin || 1;

  const bandWidth = plotW / n;
  const bandCenter = (i) => padLeft + bandWidth * (i + 0.5);
  const yFor = (v) => PAD_TOP + (1 - (v - yMin) / range) * plotH;
  const baseline = yFor(yMin);

  const groupWidth = Math.min(bandWidth * 0.7, 46 * series.length);
  const slotWidth = groupWidth / series.length;
  const barWidth = Math.max(2, slotWidth * 0.82);

  const labelEvery = Math.ceil(n / 12);
  const hasAnyData = series.some((s) => s.values.some((v) => v != null && !Number.isNaN(v)));

  function handleMove(event) {
    const svg = event.currentTarget.ownerSVGElement ?? event.currentTarget;
    const rect = svg.getBoundingClientRect();
    if (!rect.width) return;
    const t = ((event.clientX - rect.left) / rect.width) * W;
    const idx = Math.max(0, Math.min(n - 1, Math.floor((t - padLeft) / bandWidth)));
    setActiveIndex(idx);
  }

  const activePoint = activeIndex != null ? points[activeIndex] : null;
  const tooltipLeft = activeIndex != null
    ? Math.max(12, Math.min(88, (bandCenter(activeIndex) / W) * 100))
    : 0;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto" }}
        className="block touch-none"
        role="img"
      >
        {/* active band highlight */}
        {activeIndex != null && (
          <rect
            x={padLeft + bandWidth * activeIndex}
            y={PAD_TOP}
            width={bandWidth}
            height={plotH}
            className="text-zinc-100 dark:text-zinc-800"
            fill="currentColor"
            fillOpacity={0.7}
          />
        )}

        {/* horizontal grid + y tick labels */}
        <g className="text-zinc-200 dark:text-zinc-800">
          {ticks.map((tick) => (
            <line
              key={tick}
              x1={padLeft}
              x2={W - PAD_RIGHT}
              y1={yFor(tick)}
              y2={yFor(tick)}
              stroke="currentColor"
              strokeWidth={1}
            />
          ))}
        </g>
        <g className="text-zinc-500 dark:text-zinc-400" fill="currentColor" fontSize={10}>
          {ticks.map((tick) => (
            <text key={tick} x={padLeft - 8} y={yFor(tick) + 3} textAnchor="end">
              {formatY(tick)}
            </text>
          ))}
        </g>

        {/* x axis session labels */}
        <g className="text-zinc-500 dark:text-zinc-400" fill="currentColor" fontSize={10}>
          {points.map((point, i) =>
            i % labelEvery === 0 || i === n - 1 ? (
              <text key={point.label + i} x={bandCenter(i)} y={H - PAD_BOTTOM + 18} textAnchor="middle">
                {point.label}
              </text>
            ) : null
          )}
        </g>

        {/* bars */}
        {points.map((_, i) => {
          const groupLeft = bandCenter(i) - groupWidth / 2;
          const dim = activeIndex != null && activeIndex !== i;
          return (
            <g key={i} opacity={dim ? 0.4 : 1}>
              {series.map((s, si) => {
                const v = s.values[i];
                if (v == null || Number.isNaN(v)) return null;
                const top = yFor(v);
                const height = Math.max(0, baseline - top);
                return (
                  <rect
                    key={s.key}
                    x={groupLeft + si * slotWidth + (slotWidth - barWidth) / 2}
                    y={top}
                    width={barWidth}
                    height={height}
                    rx={1.5}
                    fill={s.color}
                  />
                );
              })}
            </g>
          );
        })}

        {/* baseline */}
        <line
          x1={padLeft}
          x2={W - PAD_RIGHT}
          y1={baseline}
          y2={baseline}
          className="text-zinc-300 dark:text-zinc-700"
          stroke="currentColor"
          strokeWidth={1}
        />

        {!hasAnyData && (
          <text
            x={padLeft + plotW / 2}
            y={PAD_TOP + plotH / 2}
            textAnchor="middle"
            className="text-zinc-400 dark:text-zinc-500"
            fill="currentColor"
            fontSize={12}
          >
            No data recorded
          </text>
        )}

        {/* pointer capture */}
        <rect
          x={padLeft}
          y={PAD_TOP}
          width={plotW}
          height={plotH}
          fill="transparent"
          onPointerMove={handleMove}
          onPointerLeave={() => setActiveIndex(null)}
        />
      </svg>

      {activePoint && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
          style={{ left: `${tooltipLeft}%`, top: 4 }}
        >
          <p className="mb-1 font-medium text-zinc-900 dark:text-zinc-50">
            {activePoint.label}
            {activePoint.sublabel ? ` · ${activePoint.sublabel}` : ""}
          </p>
          <div className="space-y-0.5">
            {series.map((s) => {
              const v = s.values[activeIndex];
              return (
                <div key={s.key} className="flex items-center gap-1.5 whitespace-nowrap">
                  <span
                    className="inline-block h-2 w-2 shrink-0 rounded-full"
                    style={{ background: s.color }}
                  />
                  <span className="text-zinc-600 dark:text-zinc-300">{s.label}:</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {v == null || Number.isNaN(v) ? "—" : formatY(v)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showLegend && series.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {series.map((s) => (
            <div
              key={s.key}
              className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-300"
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: s.color }}
              />
              {s.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
