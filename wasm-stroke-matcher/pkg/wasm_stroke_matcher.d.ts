/* tslint:disable */
/* eslint-disable */

export class MatchResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    is_direction_correct: boolean;
    is_order_correct: boolean;
    score: number;
}

export function match_all_strokes(user_strokes_json: string, target_strokes_json: string): any;

export function match_single_stroke(user_points_json: string, target_points_json: string): any;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_get_matchresult_is_direction_correct: (a: number) => number;
    readonly __wbg_get_matchresult_is_order_correct: (a: number) => number;
    readonly __wbg_get_matchresult_score: (a: number) => number;
    readonly __wbg_matchresult_free: (a: number, b: number) => void;
    readonly __wbg_set_matchresult_is_direction_correct: (a: number, b: number) => void;
    readonly __wbg_set_matchresult_is_order_correct: (a: number, b: number) => void;
    readonly __wbg_set_matchresult_score: (a: number, b: number) => void;
    readonly match_all_strokes: (a: number, b: number, c: number, d: number) => any;
    readonly match_single_stroke: (a: number, b: number, c: number, d: number) => any;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
