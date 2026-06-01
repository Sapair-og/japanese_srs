use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize, Clone, Copy, Debug)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug)]
pub struct MatchResult {
    pub score: f64,
    pub is_order_correct: bool,
    pub is_direction_correct: bool,
}

// Distance between two points
fn distance(p1: Point, p2: Point) -> f64 {
    ((p1.x - p2.x).powi(2) + (p1.y - p2.y).powi(2)).sqrt()
}

// Cumulative length of a stroke path
fn path_length(points: &[Point]) -> f64 {
    let mut len = 0.0;
    for i in 1..points.len() {
        len += distance(points[i - 1], points[i]);
    }
    len
}

// Resample a stroke to have exactly N points
fn resample(points: &[Point], n: usize) -> Vec<Point> {
    if points.is_empty() {
        return vec![Point { x: 0.0, y: 0.0 }; n];
    }
    if points.len() == 1 {
        return vec![points[0]; n];
    }

    let total_len = path_length(points);
    let interval = total_len / (n - 1) as f64;
    let mut resampled = vec![points[0]];
    let mut d = 0.0;
    
    let mut i = 1;
    let mut curr_points = points.to_vec();

    while i < curr_points.len() {
        let p1 = curr_points[i - 1];
        let p2 = curr_points[i];
        let dist = distance(p1, p2);

        if d + dist >= interval {
            let t = (interval - d) / if dist == 0.0 { 1.0 } else { dist };
            let q = Point {
                x: p1.x + t * (p2.x - p1.x),
                y: p1.y + t * (p2.y - p1.y),
            };
            resampled.push(q);
            curr_points.insert(i, q);
            d = 0.0;
        } else {
            d += dist;
        }
        i += 1;
    }

    while resampled.len() < n {
        resampled.push(points[points.len() - 1]);
    }
    resampled.truncate(n);
    resampled
}

// Scale and translate a stroke to a bounding box (100x100) centered at origin
fn normalize(points: &[Point]) -> Vec<Point> {
    if points.is_empty() {
        return vec![];
    }

    let mut min_x = f64::MAX;
    let mut max_x = f64::MIN;
    let mut min_y = f64::MAX;
    let mut max_y = f64::MIN;

    for p in points {
        if p.x < min_x { min_x = p.x; }
        if p.x > max_x { max_x = p.x; }
        if p.y < min_y { min_y = p.y; }
        if p.y > max_y { max_y = p.y; }
    }

    let width = max_x - min_x;
    let height = max_y - min_y;
    let scale = width.max(height);
    let scale_factor = if scale == 0.0 { 1.0 } else { 100.0 / scale };

    // Translate to center
    let mut sum_x = 0.0;
    let mut sum_y = 0.0;
    for p in points {
        sum_x += p.x;
        sum_y += p.y;
    }
    let centroid_x = sum_x / points.len() as f64;
    let centroid_y = sum_y / points.len() as f64;

    points
        .iter()
        .map(|p| Point {
            x: (p.x - centroid_x) * scale_factor,
            y: (p.y - centroid_y) * scale_factor,
        })
        .collect()
}

// Compare two normalized equal-length paths and return an average distance score
fn path_similarity(p1: &[Point], p2: &[Point]) -> f64 {
    if p1.len() != p2.len() || p1.is_empty() {
        return 0.0;
    }
    let mut sum_dist = 0.0;
    for i in 0..p1.len() {
        sum_dist += distance(p1[i], p2[i]);
    }
    let avg_dist = sum_dist / p1.len() as f64;
    // Map average distance (0 to 100 range) to a similarity score (0.0 to 1.0)
    let score = 1.0 - (avg_dist / 45.0);
    score.max(0.0).min(1.0)
}

#[wasm_bindgen]
pub fn match_single_stroke(user_points_json: &str, target_points_json: &str) -> JsValue {
    let user_points: Vec<Point> = serde_json::from_str(user_points_json).unwrap_or_else(|_| vec![]);
    let target_points: Vec<Point> = serde_json::from_str(target_points_json).unwrap_or_else(|_| vec![]);

    if user_points.is_empty() || target_points.is_empty() {
        let res = MatchResult { score: 0.0, is_order_correct: true, is_direction_correct: false };
        return serde_json::to_string(&res).unwrap().into();
    }

    let u_resampled = resample(&user_points, 32);
    let t_resampled = resample(&target_points, 32);

    let u_norm = normalize(&u_resampled);
    let t_norm = normalize(&t_resampled);

    let forward_score = path_similarity(&u_norm, &t_norm);

    // Check reversed direction
    let mut u_reversed = u_norm.clone();
    u_reversed.reverse();
    let backward_score = path_similarity(&u_reversed, &t_norm);

    let is_direction_correct = forward_score >= backward_score;
    let final_score = forward_score.max(backward_score);

    let result = MatchResult {
        score: final_score,
        is_order_correct: true,
        is_direction_correct,
    };

    serde_json::to_string(&result).unwrap().into()
}

#[wasm_bindgen]
pub fn match_all_strokes(user_strokes_json: &str, target_strokes_json: &str) -> JsValue {
    let user_strokes: Vec<Vec<Point>> = serde_json::from_str(user_strokes_json).unwrap_or_else(|_| vec![]);
    let target_strokes: Vec<Vec<Point>> = serde_json::from_str(target_strokes_json).unwrap_or_else(|_| vec![]);

    if user_strokes.is_empty() || target_strokes.is_empty() {
        let res = MatchResult { score: 0.0, is_order_correct: false, is_direction_correct: false };
        return serde_json::to_string(&res).unwrap().into();
    }

    // Number of strokes mismatch penalty
    let stroke_count_diff = (user_strokes.len() as isize - target_strokes.len() as isize).abs();
    
    let mut total_score = 0.0;
    let mut all_directions_correct = true;
    let matches_to_compare = user_strokes.len().min(target_strokes.len());

    for idx in 0..matches_to_compare {
        let u_points = &user_strokes[idx];
        let t_points = &target_strokes[idx];

        let u_resampled = resample(u_points, 32);
        let t_resampled = resample(t_points, 32);

        let u_norm = normalize(&u_resampled);
        let t_norm = normalize(&t_resampled);

        let forward_score = path_similarity(&u_norm, &t_norm);
        
        let mut u_reversed = u_norm.clone();
        u_reversed.reverse();
        let backward_score = path_similarity(&u_reversed, &t_norm);

        if forward_score < backward_score {
            all_directions_correct = false;
        }

        total_score += forward_score.max(backward_score);
    }

    let mut avg_score = if matches_to_compare > 0 {
        total_score / matches_to_compare as f64
    } else {
        0.0
    };

    // Apply penalty for incorrect stroke counts
    if stroke_count_diff > 0 {
        avg_score -= 0.15 * stroke_count_diff as f64;
    }

    let result = MatchResult {
        score: avg_score.max(0.0).min(1.0),
        is_order_correct: stroke_count_diff == 0,
        is_direction_correct: all_directions_correct,
    };

    serde_json::to_string(&result).unwrap().into()
}
