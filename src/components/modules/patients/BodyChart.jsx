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

const POPUP_WIDTH = 190;
const POPUP_HEIGHT = 56;

function ColorPickerPopup({ x, y, containerSize, onSelect, onDismiss }) {
  const popupRef = useRef(null);

  useEffect(() => {
    function handlePointerDown(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onDismiss();
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [onDismiss]);

  const left = Math.min(Math.max(x - POPUP_WIDTH / 2, 4), containerSize.width - POPUP_WIDTH - 4);
  const top = Math.min(Math.max(y - POPUP_HEIGHT - 12, 4), containerSize.height - POPUP_HEIGHT - 4);

  return (
    <div
      ref={popupRef}
      className="absolute z-20 flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
      style={{ left, top, width: POPUP_WIDTH }}
    >
      {MARKING_COLORS.map((color) => (
        <button
          key={color.value}
          type="button"
          title={color.name}
          onClick={() => onSelect(color.value)}
          className="h-6 w-6 rounded-full border border-black/10 transition-transform hover:scale-110"
          style={{ backgroundColor: color.value }}
        />
      ))}
      <button
        type="button"
        title="Clear marking"
        onClick={() => onSelect(null)}
        className="ml-auto text-xs text-zinc-500 underline hover:text-zinc-900 dark:hover:text-zinc-50"
      >
        Clear
      </button>
    </div>
  );
}

function BodyChartPanel({ title, image, idmapSrc, viewBox, markings, onMark }) {
  const idMap = useIdMap(idmapSrc, viewBox.width, viewBox.height);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [picker, setPicker] = useState(null); // { region, x, y } | null
  const activeRegion = picker?.region ?? null;

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
        ref={containerRef}
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
            if (!region) return;
            const rect = containerRef.current.getBoundingClientRect();
            setPicker({
              region,
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
              containerWidth: rect.width,
              containerHeight: rect.height,
            });
          }}
          onMouseMove={(event) => {
            const region = regionAtEvent(event);
            setHoveredRegion((prev) => (prev === region ? prev : region));
          }}
          onMouseLeave={() => setHoveredRegion(null)}
        />
        {picker && (
          <ColorPickerPopup
            x={picker.x}
            y={picker.y}
            containerSize={{ width: picker.containerWidth, height: picker.containerHeight }}
            onSelect={(color) => {
              onMark(picker.region, color);
              setPicker(null);
            }}
            onDismiss={() => setPicker(null)}
          />
        )}
      </div>
    </div>
  );
}

export function BodyChart({ markings, onChange }) {
  function handleMark(region, color) {
    const next = markings.filter((m) => m.region !== region);
    if (color) next.push({ region, color });
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Click a numbered region on the diagram to mark it.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <BodyChartPanel
          title="Front"
          image={FRONT_IMAGE}
          idmapSrc={FRONT_IDMAP}
          viewBox={FRONT_VIEWBOX}
          markings={markings}
          onMark={handleMark}
        />
        <BodyChartPanel
          title="Back"
          image={BACK_IMAGE}
          idmapSrc={BACK_IDMAP}
          viewBox={BACK_VIEWBOX}
          markings={markings}
          onMark={handleMark}
        />
      </div>
    </div>
  );
}
