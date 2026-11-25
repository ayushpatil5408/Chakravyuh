/**
 * math.js
 * ---------------------------------------------------------------------------
 * Small, dependency-free numeric helpers shared across the scene. Keeping
 * them here means every module interpolates the same way, and the curve
 * evaluations stay testable in plain Node.
 * ---------------------------------------------------------------------------
 */

export const clamp = (v, lo = 0, hi = 1) => (v < lo ? lo : v > hi ? hi : v);

export const lerp = (a, b, t) => a + (b - a) * t;

/** Normalise `v` from [a,b] into [0,1], clamped. */
export const invLerp = (a, b, v) => (b === a ? 0 : clamp((v - a) / (b - a)));

export const smoothstep = (a, b, v) => {
  const t = invLerp(a, b, v);
  return t * t * (3 - 2 * t);
};

export const smootherstep = (a, b, v) => {
  const t = invLerp(a, b, v);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

/**
 * Frame-rate independent exponential smoothing.
 * `dt` in seconds, `halfLife` the seconds it takes to cover half the gap.
 */
export const damp = (current, target, halfLife, dt) => {
  if (halfLife <= 0) return target;
  const factor = 1 - Math.pow(2, -dt / halfLife);
  return current + (target - current) * factor;
};

/** Deterministic PRNG (mulberry32) so the formation is identical each load. */
export function makeRandom(seed = 20240613) {
  let a = seed >>> 0;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Uniform float in [lo,hi) from a provided random function. */
export const rand = (random, lo, hi) => lo + (hi - lo) * random();

/**
 * Monotone cubic interpolation over sorted [x,y] nodes.
 * Used for Abhimanyu's radial track: no overshoot, so he never pops past
 * the centre or reverses without warning.
 */
export function monotoneCubic(nodes) {
  const xs = nodes.map((n) => n[0]);
  const ys = nodes.map((n) => n[1]);
  const n = nodes.length;
  const dx = [];
  const slope = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = xs[i + 1] - xs[i];
    slope[i] = dx[i] === 0 ? 0 : (ys[i + 1] - ys[i]) / dx[i];
  }
  const tangents = new Array(n);
  tangents[0] = slope[0];
  tangents[n - 1] = slope[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (slope[i - 1] * slope[i] <= 0) {
      tangents[i] = 0;
    } else {
      tangents[i] = (slope[i - 1] + slope[i]) / 2;
      // Fritsch–Carlson limiter keeps the segment monotone.
      const m = Math.abs(tangents[i]);
      if (m > 3 * Math.abs(slope[i - 1])) tangents[i] = 3 * slope[i - 1];
      if (m > 3 * Math.abs(slope[i])) tangents[i] = 3 * slope[i];
    }
  }
  return function evaluate(x) {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0;
    while (i < n - 2 && x > xs[i + 1]) i++;
    const h = dx[i];
    const t = (x - xs[i]) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;
    return h00 * ys[i] + h10 * h * tangents[i] + h01 * ys[i + 1] + h11 * h * tangents[i + 1];
  };
}

/** Piecewise-linear evaluation of sorted [x,y] node pairs. */
export function piecewiseLinear(nodes) {
  const n = nodes.length;
  return function evaluate(x) {
    if (x <= nodes[0][0]) return nodes[0][1];
    if (x >= nodes[n - 1][0]) return nodes[n - 1][1];
    let i = 0;
    while (i < n - 2 && x > nodes[i + 1][0]) i++;
    const [x0, y0] = nodes[i];
    const [x1, y1] = nodes[i + 1];
    const t = x1 === x0 ? 0 : (x - x0) / (x1 - x0);
    return y0 + (y1 - y0) * t;
  };
}

/** Catmull-Rom evaluation across evenly spaced values (1D track). */
export function catmullRom1D(values, t) {
  const n = values.length;
  if (n === 1) return values[0];
  const p = clamp(t) * (n - 1);
  const i = Math.min(Math.floor(p), n - 2);
  const f = p - i;
  const p0 = values[Math.max(0, i - 1)];
  const p1 = values[i];
  const p2 = Math.min(n - 1, i + 1) === i ? p1 : values[i + 1];
  const p3 = values[Math.min(n - 1, i + 2)];
  const v0 = (p2 - p0) * 0.5;
  const v1 = (p3 - p1) * 0.5;
  const f2 = f * f;
  const f3 = f2 * f;
  return (
    (2 * f3 - 3 * f2 + 1) * p1 + (f3 - 2 * f2 + f) * v0 + (-2 * f3 + 3 * f2) * p2 + (f3 - f2) * v1
  );
}

/** Shortest signed angular distance, in radians. */
export function shortestAngle(from, to) {
  let d = (to - from) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}

/** Angle damping that takes the short way round. */
export function dampAngle(current, target, halfLife, dt) {
  return current + shortestAngle(current, target) * (1 - Math.pow(2, -dt / halfLife));
}