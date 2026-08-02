"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  FRONT_IMAGE,
  BACK_IMAGE,
  FRONT_IDMAP,
  BACK_IDMAP,
  FRONT_VIEWBOX,
  BACK_VIEWBOX,
  MARKING_COLORS,
} from "@/lib/bodyChartRegions";

const HOVER_TINT = [148, 163, 184]; // slate-400, shown on unmarked hover
const ACTIVE_OUTLINE = [13, 148, 136]; // teal-600

function hexToRgb(hex) {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function useIdMap(src, width, height) {
  const [idMap, setIdMap] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      if (cancelled) return;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      const { data } = ctx.getImageData(0, 0, width, height);
      const ids = new Uint8Array(width * height);
      for (let i = 0; i < width * height; i++) ids[i] = data[i * 4];
      if (!cancelled) setIdMap(ids);
    };
    return () => {
      cancelled = true;
    };
  }, [src, width, height]);

  return idMap;
}

function BodyChartPanel({
  title,
  image,
  idmapSrc,
  viewBox,
  markings,
  activeRegion,
  onRegionClick,
}) {
  const idMap = useIdMap(idmapSrc, viewBox.width, viewBox.height);
  const canvasRef = useRef(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  useEffect(() => {
    if (!idMap || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { width, height } = viewBox;
    const imageData = ctx.createImageData(width, height);
    const out = imageData.data;

    const colorByRegion = new Map(markings.map((m) => [m.region, hexToRgb(m.color)]));

    for (let i = 0; i < width * height; i++) {
      const id = idMap[i];
      if (id === 0) continue;

      let rgb = colorByRegion.get(id);
      let alpha = 140;
      if (!rgb) {
        if (id === hoveredRegion) {
          rgb = HOVER_TINT;
          alpha = 70;
        } else {
          continue;
        }
      }

      const o = i * 4;
      out[o] = rgb[0];
      out[o + 1] = rgb[1];
      out[o + 2] = rgb[2];
      out[o + 3] = alpha;
    }

    // Outline the region currently being edited so it's easy to see which one
    // the color toolbar applies to.
    if (activeRegion) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = y * width + x;
          if (idMap[i] !== activeRegion) continue;
          const isEdge =
            (x > 0 && idMap[i - 1] !== activeRegion) ||
            (x < width - 1 && idMap[i + 1] !== activeRegion) ||
            (y > 0 && idMap[i - width] !== activeRegion) ||
            (y < height - 1 && idMap[i + width] !== activeRegion);
          if (isEdge) {
            const o = i * 4;
            out[o] = ACTIVE_OUTLINE[0];
            out[o + 1] = ACTIVE_OUTLINE[1];
            out[o + 2] = ACTIVE_OUTLINE[2];
            out[o + 3] = 255;
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [idMap, markings, activeRegion, hoveredRegion, viewBox]);

  function regionAtEvent(event) {
    if (!idMap) return null;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * viewBox.width);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * viewBox.height);
    if (x < 0 || y < 0 || x >= viewBox.width || y >= viewBox.height) return null;
    const id = idMap[y * viewBox.width + x];
    return id === 0 ? null : id;
  }

  return (
    <div>
      <p className="mb-2 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {title}
      </p>
      <div
        className="relative mx-auto"
        style={{ maxWidth: viewBox.width, aspectRatio: `${viewBox.width} / ${viewBox.height}` }}
      >
        <Image
          src={image}
          alt={`${title} body chart`}
          fill
          sizes={`${viewBox.width}px`}
          className="pointer-events-none select-none object-contain"
          draggable={false}
        />
        <canvas
          ref={canvasRef}
          width={viewBox.width}
          height={viewBox.height}
          className="absolute inset-0 h-full w-full cursor-pointer"
          onClick={(event) => {
            const region = regionAtEvent(event);
            if (region) onRegionClick(region);
          }}
          onMouseMove={(event) => {
            const region = regionAtEvent(event);
            setHoveredRegion((prev) => (prev === region ? prev : region));
          }}
          onMouseLeave={() => setHoveredRegion(null)}
        />
      </div>
    </div>
  );
}

export function BodyChart({ markings, onChange }) {
  const [activeRegion, setActiveRegion] = useState(null);

  function handleColorSelect(color) {
    if (activeRegion === null) return;
    const next = markings.filter((m) => m.region !== activeRegion);
    next.push({ region: activeRegion, color });
    onChange(next);
  }

  function handleClear() {
    if (activeRegion === null) return;
    onChange(markings.filter((m) => m.region !== activeRegion));
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        {activeRegion === null ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Click a numbered region on the diagram to mark it.
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Region {activeRegion}:
            </span>
            <div className="flex items-center gap-1.5">
              {MARKING_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  title={color.name}
                  onClick={() => handleColorSelect(color.value)}
                  className="h-6 w-6 rounded-full border border-black/10 transition-transform hover:scale-110"
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="text-sm text-zinc-500 underline hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setActiveRegion(null)}
              className="ml-auto text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400"
            >
              Done
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <BodyChartPanel
          title="Front"
          image={FRONT_IMAGE}
          idmapSrc={FRONT_IDMAP}
          viewBox={FRONT_VIEWBOX}
          markings={markings}
          activeRegion={activeRegion}
          onRegionClick={setActiveRegion}
        />
        <BodyChartPanel
          title="Back"
          image={BACK_IMAGE}
          idmapSrc={BACK_IDMAP}
          viewBox={BACK_VIEWBOX}
          markings={markings}
          activeRegion={activeRegion}
          onRegionClick={setActiveRegion}
        />
      </div>
    </div>
  );
}
