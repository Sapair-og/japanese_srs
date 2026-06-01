// Stroke Matcher - JavaScript Engine Fallback / WASM Wrapper

// 1. Calculate cumulative length of a coordinate path
function getPathLength(points) {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    len += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  return len;
}

// 2. Resample a stroke to have exactly N points
function resample(points, n) {
  if (points.length === 0) return Array(n).fill({ x: 0, y: 0 });
  if (points.length === 1) return Array(n).fill({ ...points[0] });

  const totalLen = getPathLength(points);
  const interval = totalLen / (n - 1);
  const resampled = [{ ...points[0] }];
  let d = 0;
  
  let i = 1;
  const tempPoints = [...points];

  while (i < tempPoints.length) {
    const p1 = tempPoints[i - 1];
    const p2 = tempPoints[i];
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);

    if (d + dist >= interval) {
      const t = (interval - d) / (dist === 0 ? 1 : dist);
      const q = {
        x: p1.x + t * (p2.x - p1.x),
        y: p1.y + t * (p2.y - p1.y)
      };
      resampled.push(q);
      tempPoints.splice(i, 0, q);
      d = 0;
    } else {
      d += dist;
    }
    i++;
  }

  while (resampled.length < n) {
    resampled.push({ ...points[points.length - 1] });
  }
  resampled.length = n;
  return resampled;
}

// 3. Scale and translate a stroke to a bounding box (100x100) centered at origin
function normalize(points) {
  if (points.length === 0) return [];

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  const width = maxX - minX;
  const height = maxY - minY;
  const scale = Math.max(width, height);
  const scaleFactor = scale === 0 ? 1 : 100 / scale;

  let sumX = 0, sumY = 0;
  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
  }
  const centroidX = sumX / points.length;
  const centroidY = sumY / points.length;

  return points.map(p => ({
    x: (p.x - centroidX) * scaleFactor,
    y: (p.y - centroidY) * scaleFactor
  }));
}

// 4. Distance similarity metric mapping avg distance (0-100) to a score (0.0-1.0)
function getPathSimilarity(p1, p2) {
  if (p1.length !== p2.length || p1.length === 0) return 0;

  let sumDist = 0;
  for (let i = 0; i < p1.length; i++) {
    sumDist += Math.hypot(p1[i].x - p2[i].x, p1[i].y - p2[i].y);
  }
  const avgDist = sumDist / p1.length;
  const score = 1 - (avgDist / 45); // Threshold mapping
  return Math.max(0, Math.min(1, score));
}

// 5. JavaScript Native Fallback Engine
export const jsStrokeMatcher = {
  matchSingleStroke(userPoints, targetPoints) {
    if (userPoints.length === 0 || targetPoints.length === 0) {
      return { score: 0, isOrderCorrect: true, isDirectionCorrect: false };
    }

    const uNorm = normalize(resample(userPoints, 32));
    const tNorm = normalize(resample(targetPoints, 32));

    const forwardScore = getPathSimilarity(uNorm, tNorm);
    const backwardScore = getPathSimilarity([...uNorm].reverse(), tNorm);

    const isDirectionCorrect = forwardScore >= backwardScore;
    const score = Math.max(forwardScore, backwardScore);

    return {
      score,
      isOrderCorrect: true,
      isDirectionCorrect
    };
  },

  matchAllStrokes(userStrokes, targetStrokes) {
    if (userStrokes.length === 0 || targetStrokes.length === 0) {
      return { score: 0, isOrderCorrect: false, isDirectionCorrect: false };
    }

    const strokeCountDiff = Math.abs(userStrokes.length - targetStrokes.length);
    let totalScore = 0;
    let allDirectionsCorrect = true;
    const matchesToCompare = Math.min(userStrokes.length, targetStrokes.length);

    for (let idx = 0; idx < matchesToCompare; idx++) {
      const uNorm = normalize(resample(userStrokes[idx], 32));
      const tNorm = normalize(resample(targetStrokes[idx], 32));

      const forwardScore = getPathSimilarity(uNorm, tNorm);
      const backwardScore = getPathSimilarity([...uNorm].reverse(), tNorm);

      if (forwardScore < backwardScore) {
        allDirectionsCorrect = false;
      }

      totalScore += Math.max(forwardScore, backwardScore);
    }

    let avgScore = matchesToCompare > 0 ? totalScore / matchesToCompare : 0;

    // Apply stroke count mismatch penalty
    if (strokeCountDiff > 0) {
      avgScore -= 0.15 * strokeCountDiff;
    }

    return {
      score: Math.max(0, Math.min(1, avgScore)),
      isOrderCorrect: strokeCountDiff === 0,
      isDirectionCorrect: allDirectionsCorrect
    };
  }
};

// WebAssembly dynamic container state
let wasmInstance = null;

export async function initWasm() {
  try {
    const wasm = await import('../../wasm-stroke-matcher/pkg/wasm_stroke_matcher.js');
    await wasm.default();
    wasmInstance = wasm;
    console.log("Rust WebAssembly stroke recognizer module initialized 🦀");
  } catch {
    console.warn("Rust WebAssembly not compiled or loaded. Running with Javascript engine fallback.");
  }
}

// Global Core Matcher API
export const strokeMatcher = {
  matchSingleStroke(userPoints, targetPoints) {
    if (wasmInstance) {
      try {
        const uJson = JSON.stringify(userPoints);
        const tJson = JSON.stringify(targetPoints);
        const resStr = wasmInstance.match_single_stroke(uJson, tJson);
        const parsed = JSON.parse(resStr);
        return {
          score: parsed.score,
          isOrderCorrect: parsed.is_order_correct,
          isDirectionCorrect: parsed.is_direction_correct
        };
      } catch (err) {
        console.error("WASM stroke match execution error, falling back to JS:", err);
      }
    }
    return jsStrokeMatcher.matchSingleStroke(userPoints, targetPoints);
  },

  matchAllStrokes(userStrokes, targetStrokes) {
    if (wasmInstance) {
      try {
        const uJson = JSON.stringify(userStrokes);
        const tJson = JSON.stringify(targetStrokes);
        const resStr = wasmInstance.match_all_strokes(uJson, tJson);
        const parsed = JSON.parse(resStr);
        return {
          score: parsed.score,
          isOrderCorrect: parsed.is_order_correct,
          isDirectionCorrect: parsed.is_direction_correct
        };
      } catch (err) {
        console.error("WASM stroke match execution error, falling back to JS:", err);
      }
    }
    return jsStrokeMatcher.matchAllStrokes(userStrokes, targetStrokes);
  }
};
