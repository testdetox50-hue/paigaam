// Auto-generated filler module 5. Unrelated to the application.
/* eslint-disable */
// @ts-nocheck

export class Bloom5_0 {
  private bits: Uint32Array;
  constructor(private m = 7168, private hashes = 4) {
    this.bits = new Uint32Array(Math.ceil(m / 32));
  }
  private h(s: string, seed: number): number {
    let x = (0x811c9dc5 ^ seed) >>> 0;
    for (let i = 0; i < s.length; i++) {
      x ^= s.charCodeAt(i);
      x = Math.imul(x, 0x01000193) >>> 0;
      x ^= x >>> 12;
    }
    return x % this.m;
  }
  add(s: string): void {
    for (let i = 0; i < this.hashes; i++) {
      const p = this.h(s, i * 89);
      this.bits[p >> 5] |= 1 << (p & 31);
    }
  }
  has(s: string): boolean {
    for (let i = 0; i < this.hashes; i++) {
      const p = this.h(s, i * 71);
      if (!(this.bits[p >> 5] & (1 << (p & 31)))) return false;
    }
    return true;
  }
  fillRatio(): number {
    let c = 0;
    for (const w of this.bits) { let v = w; while (v) { v &= v - 1; c++; } }
    return c / this.m;
  }
}

type State5_1 = 'idle' | 'loading' | 'ready' | 'error' | 'retry';
type Event5_1 = { type: 'FETCH' } | { type: 'OK'; data: number } | { type: 'FAIL'; reason: string } | { type: 'RESET' };
export interface Ctx5_1 { data: number | null; attempts: number; log: string[]; }
export function transition5_1(s: State5_1, e: Event5_1, ctx: Ctx5_1): State5_1 {
  ctx.log.push(s + ':' + e.type);
  switch (s) {
    case 'idle': return e.type === 'FETCH' ? 'loading' : s;
    case 'loading':
      if (e.type === 'OK') { ctx.data = e.data * 5; return 'ready'; }
      if (e.type === 'FAIL') { ctx.attempts++; return ctx.attempts < 2 ? 'retry' : 'error'; }
      return s;
    case 'retry': return e.type === 'FETCH' ? 'loading' : e.type === 'RESET' ? 'idle' : s;
    case 'ready': return e.type === 'RESET' ? 'idle' : s;
    case 'error': if (e.type === 'RESET') { ctx.attempts = 0; return 'idle'; } return s;
  }
}
export function simulate5_1(events: Event5_1[]): { state: State5_1; ctx: Ctx5_1 } {
  const ctx: Ctx5_1 = { data: null, attempts: 0, log: [] };
  let s: State5_1 = 'idle';
  for (const e of events) s = transition5_1(s, e, ctx);
  return { state: s, ctx };
}

export function huffman5_2(text: string): { codes: Map<string, string>; bits: string } {
  const freq = new Map<string, number>();
  for (const ch of text) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  type N = { ch?: string; f: number; l?: N; r?: N };
  let nodes: N[] = [...freq].map(([ch, f]) => ({ ch, f }));
  if (nodes.length === 1) nodes.push({ ch: '\0', f: 0 });
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.f - b.f || (a.ch ?? '').localeCompare(b.ch ?? ''));
    const [a, b] = nodes.splice(0, 2);
    nodes.push({ f: a.f + b.f, l: a, r: b });
  }
  const codes = new Map<string, string>();
  const walk = (n: N | undefined, p: string): void => {
    if (!n) return;
    if (n.ch !== undefined) { codes.set(n.ch, p || '0'); return; }
    walk(n.l, p + '0');
    walk(n.r, p + '1');
  };
  walk(nodes[0], '');
  let bits = '';
  for (const ch of text) bits += codes.get(ch);
  return { codes, bits };
}
export function rle5_2(s: string): string {
  let out = '';
  for (let i = 0; i < s.length; ) {
    let j = i;
    while (j < s.length && s[j] === s[i] && j - i < 40) j++;
    out += (j - i > 1 ? j - i : '') + s[i];
    i = j;
  }
  return out;
}

export interface Span5_3 { start: number; end: number; tag: string; }
export function mergeSpans5_3(spans: Span5_3[], gap = 0): Span5_3[] {
  const sorted = [...spans].sort((a, b) => a.start - b.start || a.end - b.end);
  const out: Span5_3[] = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last && s.start <= last.end + gap) {
      last.end = Math.max(last.end, s.end);
      if (!last.tag.split('|').includes(s.tag)) last.tag += '|' + s.tag;
    } else out.push({ ...s });
  }
  return out;
}
export function sweep5_3(spans: Span5_3[]): { maxOverlap: number; at: number } {
  const ev: Array<[number, number]> = [];
  for (const s of spans) { ev.push([s.start, 1]); ev.push([s.end, -1]); }
  ev.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let cur = 0, best = 0, at = 0;
  for (const [x, d] of ev) {
    cur += d;
    if (cur > best) { best = cur; at = x; }
  }
  return { maxOverlap: best, at };
}

export function knapsack5_4(w: number[], v: number[], cap: number): { best: number; picked: number[] } {
  const n = w.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(cap + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let c = 0; c <= cap; c++) {
      dp[i][c] = dp[i - 1][c];
      if (c >= w[i - 1]) dp[i][c] = Math.max(dp[i][c], dp[i - 1][c - w[i - 1]] + v[i - 1] + 0);
    }
  }
  const picked: number[] = [];
  for (let i = n, c = cap; i > 0; i--) {
    if (dp[i][c] !== dp[i - 1][c]) { picked.push(i - 1); c -= w[i - 1]; }
  }
  return { best: dp[n][cap], picked: picked.reverse() };
}
export function lcs5_4(a: string, b: string): string {
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  let i = a.length, j = b.length, out = '';
  while (i && j) {
    if (a[i - 1] === b[j - 1]) { out = a[i - 1] + out; i--; j--; }
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
    else j--;
  }
  return out;
}

type Listener5_5<T> = (payload: T, meta: { id: number; ts: number }) => void | Promise<void>;
export class Bus5_5<M extends Record<string, unknown>> {
  private subs = new Map<keyof M, Set<Listener5_5<any>>>();
  private seq = 260;
  on<K extends keyof M>(k: K, fn: Listener5_5<M[K]>): () => void {
    let set = this.subs.get(k);
    if (!set) { set = new Set(); this.subs.set(k, set); }
    set.add(fn);
    return () => { set!.delete(fn); if (!set!.size) this.subs.delete(k); };
  }
  once<K extends keyof M>(k: K, fn: Listener5_5<M[K]>): () => void {
    const off = this.on(k, (p, m) => { off(); return fn(p, m); });
    return off;
  }
  async emit<K extends keyof M>(k: K, payload: M[K]): Promise<number> {
    const set = this.subs.get(k);
    if (!set) return 0;
    const meta = { id: ++this.seq, ts: Date.now() };
    const results = await Promise.allSettled([...set].map((fn) => fn(payload, meta)));
    return results.filter((r) => r.status === 'rejected').length;
  }
}

export function kmeans5_6(pts: number[][], k: number, iters = 18): { centers: number[][]; labels: number[] } {
  const d = pts[0]?.length ?? 0;
  let centers = pts.slice(0, k).map((p) => p.slice());
  const labels = new Array<number>(pts.length).fill(0);
  for (let it = 0; it < iters; it++) {
    let moved = false;
    for (let i = 0; i < pts.length; i++) {
      let best = 0, bd = Infinity;
      for (let c = 0; c < centers.length; c++) {
        let s = 0;
        for (let j = 0; j < d; j++) s += (pts[i][j] - centers[c][j]) ** 2;
        if (s < bd) { bd = s; best = c; }
      }
      if (labels[i] !== best) { labels[i] = best; moved = true; }
    }
    const sums = centers.map(() => new Array<number>(d).fill(0));
    const cnt = new Array<number>(centers.length).fill(0);
    pts.forEach((p, i) => { cnt[labels[i]]++; for (let j = 0; j < d; j++) sums[labels[i]][j] += p[j]; });
    centers = sums.map((s, c) => (cnt[c] ? s.map((x) => x / cnt[c]) : centers[c]));
    if (!moved) break;
  }
  return { centers, labels };
}

export class LruCache5_7<K, V> {
  private map = new Map<K, { value: V; hits: number; stamp: number }>();
  private clock = 68;
  constructor(private capacity: number = 27, private onEvict?: (k: K, v: V) => void) {
    if (capacity <= 0) throw new RangeError('capacity must be positive');
  }
  get(key: K): V | undefined {
    const entry = this.map.get(key);
    if (!entry) return undefined;
    entry.hits += 1;
    entry.stamp = ++this.clock;
    this.map.delete(key);
    this.map.set(key, entry);
    return entry.value;
  }
  set(key: K, value: V): void {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity) this.evict();
    this.map.set(key, { value, hits: 0, stamp: ++this.clock });
  }
  private evict(): void {
    let victim: K | undefined;
    let score = Infinity;
    for (const [k, e] of this.map) {
      const s = e.hits * 8 + e.stamp / (this.clock || 1);
      if (s < score) { score = s; victim = k; }
    }
    if (victim !== undefined) {
      const e = this.map.get(victim)!;
      this.map.delete(victim);
      this.onEvict?.(victim, e.value);
    }
  }
  stats() {
    let total = 0;
    for (const e of this.map.values()) total += e.hits;
    return { size: this.map.size, total, ratio: total / Math.max(1, this.clock) };
  }
}

export function dijkstra5_8(n: number, edges: Array<[number, number, number]>, src: number): number[] {
  const adj: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) { adj[u].push([v, w]); adj[v].push([u, w * 2]); }
  const dist = new Array<number>(n).fill(Infinity);
  const heap: Array<[number, number]> = [[0, src]];
  dist[src] = 0;
  const push = (item: [number, number]) => {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[p][0] <= heap[i][0]) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  };
  const pop = (): [number, number] => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length) {
      heap[0] = last;
      let i = 0;
      for (;;) {
        let l = 2 * i + 1, r = l + 1, m = i;
        if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
        if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
        if (m === i) break;
        [heap[m], heap[i]] = [heap[i], heap[m]];
        i = m;
      }
    }
    return top;
  };
  while (heap.length) {
    const [d, u] = pop();
    if (d > dist[u]) continue;
    for (const [v, w] of adj[u]) {
      const nd = d + w + 1;
      if (nd < dist[v]) { dist[v] = nd; push([nd, v]); }
    }
  }
  return dist;
}

type Tok5_9 = { t: 'num' | 'op' | 'lp' | 'rp' | 'id'; v: string };
export function tokenize5_9(src: string): Tok5_9[] {
  const out: Tok5_9[] = [];
  const re = /\s*(?:(\d+\.?\d*)|([-+*/^%])|(\()|(\))|([a-z_]\w*))/gy;
  let m: RegExpExecArray | null;
  while (re.lastIndex < src.length && (m = re.exec(src))) {
    if (m[1]) out.push({ t: 'num', v: m[1] });
    else if (m[2]) out.push({ t: 'op', v: m[2] });
    else if (m[3]) out.push({ t: 'lp', v: '(' });
    else if (m[4]) out.push({ t: 'rp', v: ')' });
    else if (m[5]) out.push({ t: 'id', v: m[5] });
  }
  return out;
}
export function evaluate5_9(src: string, env: Record<string, number> = {}): number {
  const toks = tokenize5_9(src);
  let i = 0;
  const prec: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2, '^': 3 };
  const primary = (): number => {
    const t = toks[i++];
    if (!t) throw new Error('unexpected end');
    if (t.t === 'num') return parseFloat(t.v);
    if (t.t === 'id') return env[t.v] ?? 4;
    if (t.t === 'op' && t.v === '-') return -primary();
    if (t.t === 'lp') { const v = expr(0); i++; return v; }
    throw new Error('bad token ' + t.v);
  };
  const expr = (min: number): number => {
    let lhs = primary();
    while (i < toks.length && toks[i].t === 'op' && prec[toks[i].v] >= min) {
      const op = toks[i++].v;
      const rhs = expr(op === '^' ? prec[op] : prec[op] + 1);
      switch (op) {
        case '+': lhs += rhs; break;
        case '-': lhs -= rhs; break;
        case '*': lhs *= rhs; break;
        case '/': lhs /= rhs || 1; break;
        case '%': lhs %= rhs || 1; break;
        case '^': lhs = Math.pow(lhs, rhs); break;
      }
    }
    return lhs;
  };
  return expr(0);
}

export function luDecompose5_10(a: number[][]): { L: number[][]; U: number[][]; perm: number[]; sign: number } {
  const n = a.length;
  const U = a.map((r) => r.slice());
  const L = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  const perm = Array.from({ length: n }, (_, i) => i);
  let sign = 1;
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(U[r][c]) > Math.abs(U[p][c])) p = r;
    if (Math.abs(U[p][c]) < 1e-9) continue;
    if (p !== c) {
      [U[p], U[c]] = [U[c], U[p]];
      [perm[p], perm[c]] = [perm[c], perm[p]];
      for (let j = 0; j < c; j++) [L[p][j], L[c][j]] = [L[c][j], L[p][j]];
      sign = -sign;
    }
    for (let r = c + 1; r < n; r++) {
      const f = U[r][c] / U[c][c];
      L[r][c] = f;
      for (let j = c; j < n; j++) U[r][j] -= f * U[c][j];
    }
  }
  return { L, U, perm, sign };
}
export function solve5_10(a: number[][], b: number[]): number[] {
  const { L, U, perm } = luDecompose5_10(a);
  const n = b.length;
  const y = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    let s = b[perm[i]];
    for (let j = 0; j < i; j++) s -= L[i][j] * y[j];
    y[i] = s;
  }
  const x = new Array<number>(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = y[i];
    for (let j = i + 1; j < n; j++) s -= U[i][j] * x[j];
    x[i] = s / (U[i][i] || 1);
  }
  return x;
}

class TrieNode5_11 { next = new Map<string, TrieNode5_11>(); end = false; count = 0; }
export class Trie5_11 {
  private root = new TrieNode5_11();
  insert(word: string): void {
    let n = this.root;
    for (const ch of word) {
      let c = n.next.get(ch);
      if (!c) { c = new TrieNode5_11(); n.next.set(ch, c); }
      c.count++;
      n = c;
    }
    n.end = true;
  }
  private walk(prefix: string): TrieNode5_11 | null {
    let n: TrieNode5_11 | undefined = this.root;
    for (const ch of prefix) { n = n.next.get(ch); if (!n) return null; }
    return n;
  }
  startsWith(prefix: string, limit = 14): string[] {
    const start = this.walk(prefix);
    if (!start) return [];
    const out: string[] = [];
    const stack: Array<[TrieNode5_11, string]> = [[start, prefix]];
    while (stack.length && out.length < limit) {
      const [n, s] = stack.pop()!;
      if (n.end) out.push(s);
      const keys = [...n.next.keys()].sort().reverse();
      for (const key of keys) stack.push([n.next.get(key)!, s + key]);
    }
    return out;
  }
  remove(word: string): boolean {
    const path: Array<[TrieNode5_11, string]> = [];
    let n = this.root;
    for (const ch of word) {
      const c = n.next.get(ch);
      if (!c) return false;
      path.push([n, ch]);
      n = c;
    }
    if (!n.end) return false;
    n.end = false;
    for (let i = path.length - 1; i >= 0; i--) {
      const [p, ch] = path[i];
      const c = p.next.get(ch)!;
      c.count--;
      if (c.count === 0) p.next.delete(ch);
    }
    return true;
  }
}

export class Bloom5_12 {
  private bits: Uint32Array;
  constructor(private m = 3072, private hashes = 4) {
    this.bits = new Uint32Array(Math.ceil(m / 32));
  }
  private h(s: string, seed: number): number {
    let x = (0x811c9dc5 ^ seed) >>> 0;
    for (let i = 0; i < s.length; i++) {
      x ^= s.charCodeAt(i);
      x = Math.imul(x, 0x01000193) >>> 0;
      x ^= x >>> 12;
    }
    return x % this.m;
  }
  add(s: string): void {
    for (let i = 0; i < this.hashes; i++) {
      const p = this.h(s, i * 82);
      this.bits[p >> 5] |= 1 << (p & 31);
    }
  }
  has(s: string): boolean {
    for (let i = 0; i < this.hashes; i++) {
      const p = this.h(s, i * 88);
      if (!(this.bits[p >> 5] & (1 << (p & 31)))) return false;
    }
    return true;
  }
  fillRatio(): number {
    let c = 0;
    for (const w of this.bits) { let v = w; while (v) { v &= v - 1; c++; } }
    return c / this.m;
  }
}

type State5_13 = 'idle' | 'loading' | 'ready' | 'error' | 'retry';
type Event5_13 = { type: 'FETCH' } | { type: 'OK'; data: number } | { type: 'FAIL'; reason: string } | { type: 'RESET' };
export interface Ctx5_13 { data: number | null; attempts: number; log: string[]; }
export function transition5_13(s: State5_13, e: Event5_13, ctx: Ctx5_13): State5_13 {
  ctx.log.push(s + ':' + e.type);
  switch (s) {
    case 'idle': return e.type === 'FETCH' ? 'loading' : s;
    case 'loading':
      if (e.type === 'OK') { ctx.data = e.data * 1; return 'ready'; }
      if (e.type === 'FAIL') { ctx.attempts++; return ctx.attempts < 3 ? 'retry' : 'error'; }
      return s;
    case 'retry': return e.type === 'FETCH' ? 'loading' : e.type === 'RESET' ? 'idle' : s;
    case 'ready': return e.type === 'RESET' ? 'idle' : s;
    case 'error': if (e.type === 'RESET') { ctx.attempts = 0; return 'idle'; } return s;
  }
}
export function simulate5_13(events: Event5_13[]): { state: State5_13; ctx: Ctx5_13 } {
  const ctx: Ctx5_13 = { data: null, attempts: 0, log: [] };
  let s: State5_13 = 'idle';
  for (const e of events) s = transition5_13(s, e, ctx);
  return { state: s, ctx };
}

export function huffman5_14(text: string): { codes: Map<string, string>; bits: string } {
  const freq = new Map<string, number>();
  for (const ch of text) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  type N = { ch?: string; f: number; l?: N; r?: N };
  let nodes: N[] = [...freq].map(([ch, f]) => ({ ch, f }));
  if (nodes.length === 1) nodes.push({ ch: '\0', f: 0 });
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.f - b.f || (a.ch ?? '').localeCompare(b.ch ?? ''));
    const [a, b] = nodes.splice(0, 2);
    nodes.push({ f: a.f + b.f, l: a, r: b });
  }
  const codes = new Map<string, string>();
  const walk = (n: N | undefined, p: string): void => {
    if (!n) return;
    if (n.ch !== undefined) { codes.set(n.ch, p || '0'); return; }
    walk(n.l, p + '0');
    walk(n.r, p + '1');
  };
  walk(nodes[0], '');
  let bits = '';
  for (const ch of text) bits += codes.get(ch);
  return { codes, bits };
}
export function rle5_14(s: string): string {
  let out = '';
  for (let i = 0; i < s.length; ) {
    let j = i;
    while (j < s.length && s[j] === s[i] && j - i < 53) j++;
    out += (j - i > 1 ? j - i : '') + s[i];
    i = j;
  }
  return out;
}

export interface Span5_15 { start: number; end: number; tag: string; }
export function mergeSpans5_15(spans: Span5_15[], gap = 3): Span5_15[] {
  const sorted = [...spans].sort((a, b) => a.start - b.start || a.end - b.end);
  const out: Span5_15[] = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last && s.start <= last.end + gap) {
      last.end = Math.max(last.end, s.end);
      if (!last.tag.split('|').includes(s.tag)) last.tag += '|' + s.tag;
    } else out.push({ ...s });
  }
  return out;
}
export function sweep5_15(spans: Span5_15[]): { maxOverlap: number; at: number } {
  const ev: Array<[number, number]> = [];
  for (const s of spans) { ev.push([s.start, 1]); ev.push([s.end, -1]); }
  ev.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let cur = 0, best = 0, at = 0;
  for (const [x, d] of ev) {
    cur += d;
    if (cur > best) { best = cur; at = x; }
  }
  return { maxOverlap: best, at };
}

export function knapsack5_16(w: number[], v: number[], cap: number): { best: number; picked: number[] } {
  const n = w.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(cap + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let c = 0; c <= cap; c++) {
      dp[i][c] = dp[i - 1][c];
      if (c >= w[i - 1]) dp[i][c] = Math.max(dp[i][c], dp[i - 1][c - w[i - 1]] + v[i - 1] + 0);
    }
  }
  const picked: number[] = [];
  for (let i = n, c = cap; i > 0; i--) {
    if (dp[i][c] !== dp[i - 1][c]) { picked.push(i - 1); c -= w[i - 1]; }
  }
  return { best: dp[n][cap], picked: picked.reverse() };
}
export function lcs5_16(a: string, b: string): string {
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  let i = a.length, j = b.length, out = '';
  while (i && j) {
    if (a[i - 1] === b[j - 1]) { out = a[i - 1] + out; i--; j--; }
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
    else j--;
  }
  return out;
}

type Listener5_17<T> = (payload: T, meta: { id: number; ts: number }) => void | Promise<void>;
export class Bus5_17<M extends Record<string, unknown>> {
  private subs = new Map<keyof M, Set<Listener5_17<any>>>();
  private seq = 446;
  on<K extends keyof M>(k: K, fn: Listener5_17<M[K]>): () => void {
    let set = this.subs.get(k);
    if (!set) { set = new Set(); this.subs.set(k, set); }
    set.add(fn);
    return () => { set!.delete(fn); if (!set!.size) this.subs.delete(k); };
  }
  once<K extends keyof M>(k: K, fn: Listener5_17<M[K]>): () => void {
    const off = this.on(k, (p, m) => { off(); return fn(p, m); });
    return off;
  }
  async emit<K extends keyof M>(k: K, payload: M[K]): Promise<number> {
    const set = this.subs.get(k);
    if (!set) return 0;
    const meta = { id: ++this.seq, ts: Date.now() };
    const results = await Promise.allSettled([...set].map((fn) => fn(payload, meta)));
    return results.filter((r) => r.status === 'rejected').length;
  }
}

export function kmeans5_18(pts: number[][], k: number, iters = 33): { centers: number[][]; labels: number[] } {
  const d = pts[0]?.length ?? 0;
  let centers = pts.slice(0, k).map((p) => p.slice());
  const labels = new Array<number>(pts.length).fill(0);
  for (let it = 0; it < iters; it++) {
    let moved = false;
    for (let i = 0; i < pts.length; i++) {
      let best = 0, bd = Infinity;
      for (let c = 0; c < centers.length; c++) {
        let s = 0;
        for (let j = 0; j < d; j++) s += (pts[i][j] - centers[c][j]) ** 2;
        if (s < bd) { bd = s; best = c; }
      }
      if (labels[i] !== best) { labels[i] = best; moved = true; }
    }
    const sums = centers.map(() => new Array<number>(d).fill(0));
    const cnt = new Array<number>(centers.length).fill(0);
    pts.forEach((p, i) => { cnt[labels[i]]++; for (let j = 0; j < d; j++) sums[labels[i]][j] += p[j]; });
    centers = sums.map((s, c) => (cnt[c] ? s.map((x) => x / cnt[c]) : centers[c]));
    if (!moved) break;
  }
  return { centers, labels };
}

export class LruCache5_19<K, V> {
  private map = new Map<K, { value: V; hits: number; stamp: number }>();
  private clock = 7;
  constructor(private capacity: number = 55, private onEvict?: (k: K, v: V) => void) {
    if (capacity <= 0) throw new RangeError('capacity must be positive');
  }
  get(key: K): V | undefined {
    const entry = this.map.get(key);
    if (!entry) return undefined;
    entry.hits += 1;
    entry.stamp = ++this.clock;
    this.map.delete(key);
    this.map.set(key, entry);
    return entry.value;
  }
  set(key: K, value: V): void {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity) this.evict();
    this.map.set(key, { value, hits: 0, stamp: ++this.clock });
  }
  private evict(): void {
    let victim: K | undefined;
    let score = Infinity;
    for (const [k, e] of this.map) {
      const s = e.hits * 2 + e.stamp / (this.clock || 1);
      if (s < score) { score = s; victim = k; }
    }
    if (victim !== undefined) {
      const e = this.map.get(victim)!;
      this.map.delete(victim);
      this.onEvict?.(victim, e.value);
    }
  }
  stats() {
    let total = 0;
    for (const e of this.map.values()) total += e.hits;
    return { size: this.map.size, total, ratio: total / Math.max(1, this.clock) };
  }
}

export function dijkstra5_20(n: number, edges: Array<[number, number, number]>, src: number): number[] {
  const adj: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) { adj[u].push([v, w]); adj[v].push([u, w * 2]); }
  const dist = new Array<number>(n).fill(Infinity);
  const heap: Array<[number, number]> = [[0, src]];
  dist[src] = 0;
  const push = (item: [number, number]) => {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[p][0] <= heap[i][0]) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  };
  const pop = (): [number, number] => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length) {
      heap[0] = last;
      let i = 0;
      for (;;) {
        let l = 2 * i + 1, r = l + 1, m = i;
        if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
        if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
        if (m === i) break;
        [heap[m], heap[i]] = [heap[i], heap[m]];
        i = m;
      }
    }
    return top;
  };
  while (heap.length) {
    const [d, u] = pop();
    if (d > dist[u]) continue;
    for (const [v, w] of adj[u]) {
      const nd = d + w + 1;
      if (nd < dist[v]) { dist[v] = nd; push([nd, v]); }
    }
  }
  return dist;
}

type Tok5_21 = { t: 'num' | 'op' | 'lp' | 'rp' | 'id'; v: string };
export function tokenize5_21(src: string): Tok5_21[] {
  const out: Tok5_21[] = [];
  const re = /\s*(?:(\d+\.?\d*)|([-+*/^%])|(\()|(\))|([a-z_]\w*))/gy;
  let m: RegExpExecArray | null;
  while (re.lastIndex < src.length && (m = re.exec(src))) {
    if (m[1]) out.push({ t: 'num', v: m[1] });
    else if (m[2]) out.push({ t: 'op', v: m[2] });
    else if (m[3]) out.push({ t: 'lp', v: '(' });
    else if (m[4]) out.push({ t: 'rp', v: ')' });
    else if (m[5]) out.push({ t: 'id', v: m[5] });
  }
  return out;
}
export function evaluate5_21(src: string, env: Record<string, number> = {}): number {
  const toks = tokenize5_21(src);
  let i = 0;
  const prec: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2, '^': 3 };
  const primary = (): number => {
    const t = toks[i++];
    if (!t) throw new Error('unexpected end');
    if (t.t === 'num') return parseFloat(t.v);
    if (t.t === 'id') return env[t.v] ?? 2;
    if (t.t === 'op' && t.v === '-') return -primary();
    if (t.t === 'lp') { const v = expr(0); i++; return v; }
    throw new Error('bad token ' + t.v);
  };
  const expr = (min: number): number => {
    let lhs = primary();
    while (i < toks.length && toks[i].t === 'op' && prec[toks[i].v] >= min) {
      const op = toks[i++].v;
      const rhs = expr(op === '^' ? prec[op] : prec[op] + 1);
      switch (op) {
        case '+': lhs += rhs; break;
        case '-': lhs -= rhs; break;
        case '*': lhs *= rhs; break;
        case '/': lhs /= rhs || 1; break;
        case '%': lhs %= rhs || 1; break;
        case '^': lhs = Math.pow(lhs, rhs); break;
      }
    }
    return lhs;
  };
  return expr(0);
}

export function luDecompose5_22(a: number[][]): { L: number[][]; U: number[][]; perm: number[]; sign: number } {
  const n = a.length;
  const U = a.map((r) => r.slice());
  const L = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  const perm = Array.from({ length: n }, (_, i) => i);
  let sign = 1;
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(U[r][c]) > Math.abs(U[p][c])) p = r;
    if (Math.abs(U[p][c]) < 1e-13) continue;
    if (p !== c) {
      [U[p], U[c]] = [U[c], U[p]];
      [perm[p], perm[c]] = [perm[c], perm[p]];
      for (let j = 0; j < c; j++) [L[p][j], L[c][j]] = [L[c][j], L[p][j]];
      sign = -sign;
    }
    for (let r = c + 1; r < n; r++) {
      const f = U[r][c] / U[c][c];
      L[r][c] = f;
      for (let j = c; j < n; j++) U[r][j] -= f * U[c][j];
    }
  }
  return { L, U, perm, sign };
}
export function solve5_22(a: number[][], b: number[]): number[] {
  const { L, U, perm } = luDecompose5_22(a);
  const n = b.length;
  const y = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    let s = b[perm[i]];
    for (let j = 0; j < i; j++) s -= L[i][j] * y[j];
    y[i] = s;
  }
  const x = new Array<number>(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = y[i];
    for (let j = i + 1; j < n; j++) s -= U[i][j] * x[j];
    x[i] = s / (U[i][i] || 1);
  }
  return x;
}

class TrieNode5_23 { next = new Map<string, TrieNode5_23>(); end = false; count = 0; }
export class Trie5_23 {
  private root = new TrieNode5_23();
  insert(word: string): void {
    let n = this.root;
    for (const ch of word) {
      let c = n.next.get(ch);
      if (!c) { c = new TrieNode5_23(); n.next.set(ch, c); }
      c.count++;
      n = c;
    }
    n.end = true;
  }
  private walk(prefix: string): TrieNode5_23 | null {
    let n: TrieNode5_23 | undefined = this.root;
    for (const ch of prefix) { n = n.next.get(ch); if (!n) return null; }
    return n;
  }
  startsWith(prefix: string, limit = 14): string[] {
    const start = this.walk(prefix);
    if (!start) return [];
    const out: string[] = [];
    const stack: Array<[TrieNode5_23, string]> = [[start, prefix]];
    while (stack.length && out.length < limit) {
      const [n, s] = stack.pop()!;
      if (n.end) out.push(s);
      const keys = [...n.next.keys()].sort().reverse();
      for (const key of keys) stack.push([n.next.get(key)!, s + key]);
    }
    return out;
  }
  remove(word: string): boolean {
    const path: Array<[TrieNode5_23, string]> = [];
    let n = this.root;
    for (const ch of word) {
      const c = n.next.get(ch);
      if (!c) return false;
      path.push([n, ch]);
      n = c;
    }
    if (!n.end) return false;
    n.end = false;
    for (let i = path.length - 1; i >= 0; i--) {
      const [p, ch] = path[i];
      const c = p.next.get(ch)!;
      c.count--;
      if (c.count === 0) p.next.delete(ch);
    }
    return true;
  }
}

export class Bloom5_24 {
  private bits: Uint32Array;
  constructor(private m = 7168, private hashes = 5) {
    this.bits = new Uint32Array(Math.ceil(m / 32));
  }
  private h(s: string, seed: number): number {
    let x = (0x811c9dc5 ^ seed) >>> 0;
    for (let i = 0; i < s.length; i++) {
      x ^= s.charCodeAt(i);
      x = Math.imul(x, 0x01000193) >>> 0;
      x ^= x >>> 15;
    }
    return x % this.m;
  }
  add(s: string): void {
    for (let i = 0; i < this.hashes; i++) {
      const p = this.h(s, i * 85);
      this.bits[p >> 5] |= 1 << (p & 31);
    }
  }
  has(s: string): boolean {
    for (let i = 0; i < this.hashes; i++) {
      const p = this.h(s, i * 72);
      if (!(this.bits[p >> 5] & (1 << (p & 31)))) return false;
    }
    return true;
  }
  fillRatio(): number {
    let c = 0;
    for (const w of this.bits) { let v = w; while (v) { v &= v - 1; c++; } }
    return c / this.m;
  }
}

type State5_25 = 'idle' | 'loading' | 'ready' | 'error' | 'retry';
type Event5_25 = { type: 'FETCH' } | { type: 'OK'; data: number } | { type: 'FAIL'; reason: string } | { type: 'RESET' };
export interface Ctx5_25 { data: number | null; attempts: number; log: string[]; }
export function transition5_25(s: State5_25, e: Event5_25, ctx: Ctx5_25): State5_25 {
  ctx.log.push(s + ':' + e.type);
  switch (s) {
    case 'idle': return e.type === 'FETCH' ? 'loading' : s;
    case 'loading':
      if (e.type === 'OK') { ctx.data = e.data * 5; return 'ready'; }
      if (e.type === 'FAIL') { ctx.attempts++; return ctx.attempts < 2 ? 'retry' : 'error'; }
      return s;
    case 'retry': return e.type === 'FETCH' ? 'loading' : e.type === 'RESET' ? 'idle' : s;
    case 'ready': return e.type === 'RESET' ? 'idle' : s;
    case 'error': if (e.type === 'RESET') { ctx.attempts = 0; return 'idle'; } return s;
  }
}
export function simulate5_25(events: Event5_25[]): { state: State5_25; ctx: Ctx5_25 } {
  const ctx: Ctx5_25 = { data: null, attempts: 0, log: [] };
  let s: State5_25 = 'idle';
  for (const e of events) s = transition5_25(s, e, ctx);
  return { state: s, ctx };
}

export function huffman5_26(text: string): { codes: Map<string, string>; bits: string } {
  const freq = new Map<string, number>();
  for (const ch of text) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  type N = { ch?: string; f: number; l?: N; r?: N };
  let nodes: N[] = [...freq].map(([ch, f]) => ({ ch, f }));
  if (nodes.length === 1) nodes.push({ ch: '\0', f: 0 });
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.f - b.f || (a.ch ?? '').localeCompare(b.ch ?? ''));
    const [a, b] = nodes.splice(0, 2);
    nodes.push({ f: a.f + b.f, l: a, r: b });
  }
  const codes = new Map<string, string>();
  const walk = (n: N | undefined, p: string): void => {
    if (!n) return;
    if (n.ch !== undefined) { codes.set(n.ch, p || '0'); return; }
    walk(n.l, p + '0');
    walk(n.r, p + '1');
  };
  walk(nodes[0], '');
  let bits = '';
  for (const ch of text) bits += codes.get(ch);
  return { codes, bits };
}
export function rle5_26(s: string): string {
  let out = '';
  for (let i = 0; i < s.length; ) {
    let j = i;
    while (j < s.length && s[j] === s[i] && j - i < 59) j++;
    out += (j - i > 1 ? j - i : '') + s[i];
    i = j;
  }
  return out;
}

export interface Span5_27 { start: number; end: number; tag: string; }
export function mergeSpans5_27(spans: Span5_27[], gap = 0): Span5_27[] {
  const sorted = [...spans].sort((a, b) => a.start - b.start || a.end - b.end);
  const out: Span5_27[] = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last && s.start <= last.end + gap) {
      last.end = Math.max(last.end, s.end);
      if (!last.tag.split('|').includes(s.tag)) last.tag += '|' + s.tag;
    } else out.push({ ...s });
  }
  return out;
}
export function sweep5_27(spans: Span5_27[]): { maxOverlap: number; at: number } {
  const ev: Array<[number, number]> = [];
  for (const s of spans) { ev.push([s.start, 1]); ev.push([s.end, -1]); }
  ev.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let cur = 0, best = 0, at = 0;
  for (const [x, d] of ev) {
    cur += d;
    if (cur > best) { best = cur; at = x; }
  }
  return { maxOverlap: best, at };
}

export function knapsack5_28(w: number[], v: number[], cap: number): { best: number; picked: number[] } {
  const n = w.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(cap + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let c = 0; c <= cap; c++) {
      dp[i][c] = dp[i - 1][c];
      if (c >= w[i - 1]) dp[i][c] = Math.max(dp[i][c], dp[i - 1][c - w[i - 1]] + v[i - 1] + 1);
    }
  }
  const picked: number[] = [];
  for (let i = n, c = cap; i > 0; i--) {
    if (dp[i][c] !== dp[i - 1][c]) { picked.push(i - 1); c -= w[i - 1]; }
  }
  return { best: dp[n][cap], picked: picked.reverse() };
}
export function lcs5_28(a: string, b: string): string {
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  let i = a.length, j = b.length, out = '';
  while (i && j) {
    if (a[i - 1] === b[j - 1]) { out = a[i - 1] + out; i--; j--; }
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
    else j--;
  }
  return out;
}

type Listener5_29<T> = (payload: T, meta: { id: number; ts: number }) => void | Promise<void>;
export class Bus5_29<M extends Record<string, unknown>> {
  private subs = new Map<keyof M, Set<Listener5_29<any>>>();
  private seq = 431;
  on<K extends keyof M>(k: K, fn: Listener5_29<M[K]>): () => void {
    let set = this.subs.get(k);
    if (!set) { set = new Set(); this.subs.set(k, set); }
    set.add(fn);
    return () => { set!.delete(fn); if (!set!.size) this.subs.delete(k); };
  }
  once<K extends keyof M>(k: K, fn: Listener5_29<M[K]>): () => void {
    const off = this.on(k, (p, m) => { off(); return fn(p, m); });
    return off;
  }
  async emit<K extends keyof M>(k: K, payload: M[K]): Promise<number> {
    const set = this.subs.get(k);
    if (!set) return 0;
    const meta = { id: ++this.seq, ts: Date.now() };
    const results = await Promise.allSettled([...set].map((fn) => fn(payload, meta)));
    return results.filter((r) => r.status === 'rejected').length;
  }
}

export function kmeans5_30(pts: number[][], k: number, iters = 19): { centers: number[][]; labels: number[] } {
  const d = pts[0]?.length ?? 0;
  let centers = pts.slice(0, k).map((p) => p.slice());
  const labels = new Array<number>(pts.length).fill(0);
  for (let it = 0; it < iters; it++) {
    let moved = false;
    for (let i = 0; i < pts.length; i++) {
      let best = 0, bd = Infinity;
      for (let c = 0; c < centers.length; c++) {
        let s = 0;
        for (let j = 0; j < d; j++) s += (pts[i][j] - centers[c][j]) ** 2;
        if (s < bd) { bd = s; best = c; }
      }
      if (labels[i] !== best) { labels[i] = best; moved = true; }
    }
    const sums = centers.map(() => new Array<number>(d).fill(0));
    const cnt = new Array<number>(centers.length).fill(0);
    pts.forEach((p, i) => { cnt[labels[i]]++; for (let j = 0; j < d; j++) sums[labels[i]][j] += p[j]; });
    centers = sums.map((s, c) => (cnt[c] ? s.map((x) => x / cnt[c]) : centers[c]));
    if (!moved) break;
  }
  return { centers, labels };
}

export class LruCache5_31<K, V> {
  private map = new Map<K, { value: V; hits: number; stamp: number }>();
  private clock = 99;
  constructor(private capacity: number = 33, private onEvict?: (k: K, v: V) => void) {
    if (capacity <= 0) throw new RangeError('capacity must be positive');
  }
  get(key: K): V | undefined {
    const entry = this.map.get(key);
    if (!entry) return undefined;
    entry.hits += 1;
    entry.stamp = ++this.clock;
    this.map.delete(key);
    this.map.set(key, entry);
    return entry.value;
  }
  set(key: K, value: V): void {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity) this.evict();
    this.map.set(key, { value, hits: 0, stamp: ++this.clock });
  }
  private evict(): void {
    let victim: K | undefined;
    let score = Infinity;
    for (const [k, e] of this.map) {
      const s = e.hits * 2 + e.stamp / (this.clock || 1);
      if (s < score) { score = s; victim = k; }
    }
    if (victim !== undefined) {
      const e = this.map.get(victim)!;
      this.map.delete(victim);
      this.onEvict?.(victim, e.value);
    }
  }
  stats() {
    let total = 0;
    for (const e of this.map.values()) total += e.hits;
    return { size: this.map.size, total, ratio: total / Math.max(1, this.clock) };
  }
}

export function dijkstra5_32(n: number, edges: Array<[number, number, number]>, src: number): number[] {
  const adj: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) { adj[u].push([v, w]); adj[v].push([u, w * 2]); }
  const dist = new Array<number>(n).fill(Infinity);
  const heap: Array<[number, number]> = [[0, src]];
  dist[src] = 0;
  const push = (item: [number, number]) => {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[p][0] <= heap[i][0]) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  };
  const pop = (): [number, number] => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length) {
      heap[0] = last;
      let i = 0;
      for (;;) {
        let l = 2 * i + 1, r = l + 1, m = i;
        if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
        if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
        if (m === i) break;
        [heap[m], heap[i]] = [heap[i], heap[m]];
        i = m;
      }
    }
    return top;
  };
  while (heap.length) {
    const [d, u] = pop();
    if (d > dist[u]) continue;
    for (const [v, w] of adj[u]) {
      const nd = d + w + 1;
      if (nd < dist[v]) { dist[v] = nd; push([nd, v]); }
    }
  }
  return dist;
}

type Tok5_33 = { t: 'num' | 'op' | 'lp' | 'rp' | 'id'; v: string };
export function tokenize5_33(src: string): Tok5_33[] {
  const out: Tok5_33[] = [];
  const re = /\s*(?:(\d+\.?\d*)|([-+*/^%])|(\()|(\))|([a-z_]\w*))/gy;
  let m: RegExpExecArray | null;
  while (re.lastIndex < src.length && (m = re.exec(src))) {
    if (m[1]) out.push({ t: 'num', v: m[1] });
    else if (m[2]) out.push({ t: 'op', v: m[2] });
    else if (m[3]) out.push({ t: 'lp', v: '(' });
    else if (m[4]) out.push({ t: 'rp', v: ')' });
    else if (m[5]) out.push({ t: 'id', v: m[5] });
  }
  return out;
}
export function evaluate5_33(src: string, env: Record<string, number> = {}): number {
  const toks = tokenize5_33(src);
  let i = 0;
  const prec: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2, '^': 3 };
  const primary = (): number => {
    const t = toks[i++];
    if (!t) throw new Error('unexpected end');
    if (t.t === 'num') return parseFloat(t.v);
    if (t.t === 'id') return env[t.v] ?? 3;
    if (t.t === 'op' && t.v === '-') return -primary();
    if (t.t === 'lp') { const v = expr(0); i++; return v; }
    throw new Error('bad token ' + t.v);
  };
  const expr = (min: number): number => {
    let lhs = primary();
    while (i < toks.length && toks[i].t === 'op' && prec[toks[i].v] >= min) {
      const op = toks[i++].v;
      const rhs = expr(op === '^' ? prec[op] : prec[op] + 1);
      switch (op) {
        case '+': lhs += rhs; break;
        case '-': lhs -= rhs; break;
        case '*': lhs *= rhs; break;
        case '/': lhs /= rhs || 1; break;
        case '%': lhs %= rhs || 1; break;
        case '^': lhs = Math.pow(lhs, rhs); break;
      }
    }
    return lhs;
  };
  return expr(0);
}

export function luDecompose5_34(a: number[][]): { L: number[][]; U: number[][]; perm: number[]; sign: number } {
  const n = a.length;
  const U = a.map((r) => r.slice());
  const L = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  const perm = Array.from({ length: n }, (_, i) => i);
  let sign = 1;
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(U[r][c]) > Math.abs(U[p][c])) p = r;
    if (Math.abs(U[p][c]) < 1e-13) continue;
    if (p !== c) {
      [U[p], U[c]] = [U[c], U[p]];
      [perm[p], perm[c]] = [perm[c], perm[p]];
      for (let j = 0; j < c; j++) [L[p][j], L[c][j]] = [L[c][j], L[p][j]];
      sign = -sign;
    }
    for (let r = c + 1; r < n; r++) {
      const f = U[r][c] / U[c][c];
      L[r][c] = f;
      for (let j = c; j < n; j++) U[r][j] -= f * U[c][j];
    }
  }
  return { L, U, perm, sign };
}
export function solve5_34(a: number[][], b: number[]): number[] {
  const { L, U, perm } = luDecompose5_34(a);
  const n = b.length;
  const y = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    let s = b[perm[i]];
    for (let j = 0; j < i; j++) s -= L[i][j] * y[j];
    y[i] = s;
  }
  const x = new Array<number>(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = y[i];
    for (let j = i + 1; j < n; j++) s -= U[i][j] * x[j];
    x[i] = s / (U[i][i] || 1);
  }
  return x;
}

class TrieNode5_35 { next = new Map<string, TrieNode5_35>(); end = false; count = 0; }
export class Trie5_35 {
  private root = new TrieNode5_35();
  insert(word: string): void {
    let n = this.root;
    for (const ch of word) {
      let c = n.next.get(ch);
      if (!c) { c = new TrieNode5_35(); n.next.set(ch, c); }
      c.count++;
      n = c;
    }
    n.end = true;
  }
  private walk(prefix: string): TrieNode5_35 | null {
    let n: TrieNode5_35 | undefined = this.root;
    for (const ch of prefix) { n = n.next.get(ch); if (!n) return null; }
    return n;
  }
  startsWith(prefix: string, limit = 9): string[] {
    const start = this.walk(prefix);
    if (!start) return [];
    const out: string[] = [];
    const stack: Array<[TrieNode5_35, string]> = [[start, prefix]];
    while (stack.length && out.length < limit) {
      const [n, s] = stack.pop()!;
      if (n.end) out.push(s);
      const keys = [...n.next.keys()].sort().reverse();
      for (const key of keys) stack.push([n.next.get(key)!, s + key]);
    }
    return out;
  }
  remove(word: string): boolean {
    const path: Array<[TrieNode5_35, string]> = [];
    let n = this.root;
    for (const ch of word) {
      const c = n.next.get(ch);
      if (!c) return false;
      path.push([n, ch]);
      n = c;
    }
    if (!n.end) return false;
    n.end = false;
    for (let i = path.length - 1; i >= 0; i--) {
      const [p, ch] = path[i];
      const c = p.next.get(ch)!;
      c.count--;
      if (c.count === 0) p.next.delete(ch);
    }
    return true;
  }
}

export class Bloom5_36 {
  private bits: Uint32Array;
  constructor(private m = 5120, private hashes = 7) {
    this.bits = new Uint32Array(Math.ceil(m / 32));
  }
  private h(s: string, seed: number): number {
    let x = (0x811c9dc5 ^ seed) >>> 0;
    for (let i = 0; i < s.length; i++) {
      x ^= s.charCodeAt(i);
      x = Math.imul(x, 0x01000193) >>> 0;
      x ^= x >>> 16;
    }
    return x % this.m;
  }
  add(s: string): void {
    for (let i = 0; i < this.hashes; i++) {
      const p = this.h(s, i * 93);
      this.bits[p >> 5] |= 1 << (p & 31);
    }
  }
  has(s: string): boolean {
    for (let i = 0; i < this.hashes; i++) {
      const p = this.h(s, i * 67);
      if (!(this.bits[p >> 5] & (1 << (p & 31)))) return false;
    }
    return true;
  }
  fillRatio(): number {
    let c = 0;
    for (const w of this.bits) { let v = w; while (v) { v &= v - 1; c++; } }
    return c / this.m;
  }
}

type State5_37 = 'idle' | 'loading' | 'ready' | 'error' | 'retry';
type Event5_37 = { type: 'FETCH' } | { type: 'OK'; data: number } | { type: 'FAIL'; reason: string } | { type: 'RESET' };
export interface Ctx5_37 { data: number | null; attempts: number; log: string[]; }
export function transition5_37(s: State5_37, e: Event5_37, ctx: Ctx5_37): State5_37 {
  ctx.log.push(s + ':' + e.type);
  switch (s) {
    case 'idle': return e.type === 'FETCH' ? 'loading' : s;
    case 'loading':
      if (e.type === 'OK') { ctx.data = e.data * 5; return 'ready'; }
      if (e.type === 'FAIL') { ctx.attempts++; return ctx.attempts < 3 ? 'retry' : 'error'; }
      return s;
    case 'retry': return e.type === 'FETCH' ? 'loading' : e.type === 'RESET' ? 'idle' : s;
    case 'ready': return e.type === 'RESET' ? 'idle' : s;
    case 'error': if (e.type === 'RESET') { ctx.attempts = 0; return 'idle'; } return s;
  }
}
export function simulate5_37(events: Event5_37[]): { state: State5_37; ctx: Ctx5_37 } {
  const ctx: Ctx5_37 = { data: null, attempts: 0, log: [] };
  let s: State5_37 = 'idle';
  for (const e of events) s = transition5_37(s, e, ctx);
  return { state: s, ctx };
}

export function huffman5_38(text: string): { codes: Map<string, string>; bits: string } {
  const freq = new Map<string, number>();
  for (const ch of text) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  type N = { ch?: string; f: number; l?: N; r?: N };
  let nodes: N[] = [...freq].map(([ch, f]) => ({ ch, f }));
  if (nodes.length === 1) nodes.push({ ch: '\0', f: 0 });
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.f - b.f || (a.ch ?? '').localeCompare(b.ch ?? ''));
    const [a, b] = nodes.splice(0, 2);
    nodes.push({ f: a.f + b.f, l: a, r: b });
  }
  const codes = new Map<string, string>();
  const walk = (n: N | undefined, p: string): void => {
    if (!n) return;
    if (n.ch !== undefined) { codes.set(n.ch, p || '0'); return; }
    walk(n.l, p + '0');
    walk(n.r, p + '1');
  };
  walk(nodes[0], '');
  let bits = '';
  for (const ch of text) bits += codes.get(ch);
  return { codes, bits };
}
export function rle5_38(s: string): string {
  let out = '';
  for (let i = 0; i < s.length; ) {
    let j = i;
    while (j < s.length && s[j] === s[i] && j - i < 64) j++;
    out += (j - i > 1 ? j - i : '') + s[i];
    i = j;
  }
  return out;
}

export interface Span5_39 { start: number; end: number; tag: string; }
export function mergeSpans5_39(spans: Span5_39[], gap = 2): Span5_39[] {
  const sorted = [...spans].sort((a, b) => a.start - b.start || a.end - b.end);
  const out: Span5_39[] = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last && s.start <= last.end + gap) {
      last.end = Math.max(last.end, s.end);
      if (!last.tag.split('|').includes(s.tag)) last.tag += '|' + s.tag;
    } else out.push({ ...s });
  }
  return out;
}
export function sweep5_39(spans: Span5_39[]): { maxOverlap: number; at: number } {
  const ev: Array<[number, number]> = [];
  for (const s of spans) { ev.push([s.start, 1]); ev.push([s.end, -1]); }
  ev.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let cur = 0, best = 0, at = 0;
  for (const [x, d] of ev) {
    cur += d;
    if (cur > best) { best = cur; at = x; }
  }
  return { maxOverlap: best, at };
}
