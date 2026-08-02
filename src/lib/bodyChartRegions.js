// Region geometry is derived at runtime from the id-map images (idmap-front.png /
// idmap-back.png): each pixel there is a grayscale value 1-66 identifying which
// numbered region it belongs to (0 = not part of any region). Those maps were
// produced by flood-filling front.png / back.png from a seed point per region,
// so the colored/clickable area exactly matches the drawn artwork instead of an
// approximated shape. This file only carries the metadata that isn't derivable
// from the images themselves.

export const FRONT_IMAGE = "/body-chart/front.png";
export const BACK_IMAGE = "/body-chart/back.png";
export const FRONT_IDMAP = "/body-chart/idmap-front.png";
export const BACK_IDMAP = "/body-chart/idmap-back.png";
export const FRONT_VIEWBOX = { width: 656, height: 1339 };
export const BACK_VIEWBOX = { width: 648, height: 1350 };

const FRONT_SIDES = {
  1: "Right", 2: "Left", 3: "Right", 4: "Left", 5: "Right", 6: "Left",
  7: "Right", 8: "Left", 20: "Right", 21: "Left", 9: "Right", 10: "Left",
  22: "Right", 23: "Left", 24: "Right", 25: "Left",
  11: "Right", 12: "Right", 13: "Left", 14: "Right", 15: "Right", 16: "Left",
  17: "Right", 18: "Right", 19: "Left",
  26: "Right", 27: "Left", 28: "Right", 29: "Left", 30: "Right", 31: "Left",
  32: "Right", 33: "Left", 34: "Right", 35: "Left", 36: "Right", 37: "Left",
  38: "Right", 39: "Left", 40: "Right", 41: "Left", 42: "Right", 43: "Left",
};

const BACK_SIDES = {
  44: "Right", 45: "Left", 46: "Right", 47: "Left", 48: "Right", 49: "Left",
  50: "Right", 51: "Left", 52: "Right", 53: "Left", 54: "Right", 55: "Left",
  56: "Right", 57: "Left", 58: "Right", 59: "Left", 60: "Right", 61: "Left",
  62: "Right", 63: "Left", 64: "Right", 65: "Left", 66: "Center",
};

export const FRONT_REGION_NUMBERS = Object.keys(FRONT_SIDES).map(Number);
export const BACK_REGION_NUMBERS = Object.keys(BACK_SIDES).map(Number);

export function regionSide(number) {
  return FRONT_SIDES[number] ?? BACK_SIDES[number] ?? null;
}

export const MARKING_COLORS = [
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Amber", value: "#eab308" },
  { name: "Green", value: "#22c55e" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
];
