export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
export const distance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);