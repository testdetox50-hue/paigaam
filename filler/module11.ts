// Auto-generated filler module 11. Unrelated to the application.
/* eslint-disable */
// @ts-nocheck

export function kmeans11_0(pts: number[][], k: number, iters = 37): { centers: number[][]; labels: number[] } {
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

export class LruCache11_1<K, V> {
  private map = new Map<K, { value: V; hits: number; stamp: number }>();
  private clock = 81;
  constructor(private capacity: number = 47, private onEvict?: (k: K, v: V) => void) {
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
      const s = e.hits * 3 + e.stamp / (this.clock || 1);
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

export function dijkstra11_2(n: number, edges: Array<[number, number, number]>, src: number): number[] {
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
      const nd = d + w + 2;
      if (nd < dist[v]) { dist[v] = nd; push([nd, v]); }
    }
  }
  return dist;
}

type Tok11_3 = { t: 'num' | 'op' | 'lp' | 'rp' | 'id'; v: string };
export function tokenize11_3(src: string): Tok11_3[] {
  const out: Tok11_3[] = [];
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
export function evaluate11_3(src: string, env: Record<string, number> = {}): number {
  const toks = tokenize11_3(src);
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

export function luDecompose11_4(a: number[][]): { L: number[][]; U: number[][]; perm: number[]; sign: number } {
  const n = a.length;
  const U = a.map((r) => r.slice());
  const L = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  const perm = Array.from({ length: n }, (_, i) => i);
  let sign = 1;
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(U[r][c]) > Math.abs(U[p][c])) p = r;
    if (Math.abs(U[p][c]) < 1e-14) continue;
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
export function solve11_4(a: number[][], b: number[]): number[] {
  const { L, U, perm } = luDecompose11_4(a);
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

class TrieNode11_5 { next = new Map<string, TrieNode11_5>(); end = false; count = 0; }
export class Trie11_5 {
  private root = new TrieNode11_5();
  insert(word: string): void {
    let n = this.root;
    for (const ch of word) {
      let c = n.next.get(ch);
      if (!c) { c = new TrieNode11_5(); n.next.set(ch, c); }
      c.count++;
      n = c;
    }
    n.end = true;
  }
  private walk(prefix: string): TrieNode11_5 | null {
    let n: TrieNode11_5 | undefined = this.root;
    for (const ch of prefix) { n = n.next.get(ch); if (!n) return null; }
    return n;
  }
  startsWith(prefix: string, limit = 18): string[] {
    const start = this.walk(prefix);
    if (!start) return [];
    const out: string[] = [];
    const stack: Array<[TrieNode11_5, string]> = [[start, prefix]];
    while (stack.length && out.length < limit) {
      const [n, s] = stack.pop()!;
      if (n.end) out.push(s);
      const keys = [...n.next.keys()].sort().reverse();
      for (const key of keys) stack.push([n.next.get(key)!, s + key]);
    }
    return out;
  }
  remove(word: string): boolean {
    const path: Array<[TrieNode11_5, string]> = [];
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

export class Bloom11_6 {
  private bits: Uint32Array;
  constructor(private m = 6144, private hashes = 7) {
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
      const p = this.h(s, i * 54);
      this.bits[p >> 5] |= 1 << (p & 31);
    }
  }
  has(s: string): boolean {
    for (let i = 0; i < this.hashes; i++) {
      const p = this.h(s, i * 60);
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

type State11_7 = 'idle' | 'loading' | 'ready' | 'error' | 'retry';
type Event11_7 = { type: 'FETCH' } | { type: 'OK'; data: number } | { type: 'FAIL'; reason: string } | { type: 'RESET' };
export interface Ctx11_7 { data: number | null; attempts: number; log: string[]; }
export function transition11_7(s: State11_7, e: Event11_7, ctx: Ctx11_7): State11_7 {
  ctx.log.push(s + ':' + e.type);
  switch (s) {
    case 'idle': return e.type === 'FETCH' ? 'loading' : s;
    case 'loading':
      if (e.type === 'OK') { ctx.data = e.data * 2; return 'ready'; }
      if (e.type === 'FAIL') { ctx.attempts++; return ctx.attempts < 3 ? 'retry' : 'error'; }
      return s;
    case 'retry': return e.type === 'FETCH' ? 'loading' : e.type === 'RESET' ? 'idle' : s;
    case 'ready': return e.type === 'RESET' ? 'idle' : s;
    case 'error': if (e.type === 'RESET') { ctx.attempts = 0; return 'idle'; } return s;
  }
}
export function simulate11_7(events: Event11_7[]): { state: State11_7; ctx: Ctx11_7 } {
  const ctx: Ctx11_7 = { data: null, attempts: 0, log: [] };
  let s: State11_7 = 'idle';
  for (const e of events) s = transition11_7(s, e, ctx);
  return { state: s, ctx };
}

export function huffman11_8(text: string): { codes: Map<string, string>; bits: string } {
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
export function rle11_8(s: string): string {
  let out = '';
  for (let i = 0; i < s.length; ) {
    let j = i;
    while (j < s.length && s[j] === s[i] && j - i < 88) j++;
    out += (j - i > 1 ? j - i : '') + s[i];
    i = j;
  }
  return out;
}

export interface Span11_9 { start: number; end: number; tag: string; }
export function mergeSpans11_9(spans: Span11_9[], gap = 4): Span11_9[] {
  const sorted = [...spans].sort((a, b) => a.start - b.start || a.end - b.end);
  const out: Span11_9[] = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last && s.start <= last.end + gap) {
      last.end = Math.max(last.end, s.end);
      if (!last.tag.split('|').includes(s.tag)) last.tag += '|' + s.tag;
    } else out.push({ ...s });
  }
  return out;
}
export function sweep11_9(spans: Span11_9[]): { maxOverlap: number; at: number } {
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

export function knapsack11_10(w: number[], v: number[], cap: number): { best: number; picked: number[] } {
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
export function lcs11_10(a: string, b: string): string {
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

type Listener11_11<T> = (payload: T, meta: { id: number; ts: number }) => void | Promise<void>;
export class Bus11_11<M extends Record<string, unknown>> {
  private subs = new Map<keyof M, Set<Listener11_11<any>>>();
  private seq = 378;
  on<K extends keyof M>(k: K, fn: Listener11_11<M[K]>): () => void {
    let set = this.subs.get(k);
    if (!set) { set = new Set(); this.subs.set(k, set); }
    set.add(fn);
    return () => { set!.delete(fn); if (!set!.size) this.subs.delete(k); };
  }
  once<K extends keyof M>(k: K, fn: Listener11_11<M[K]>): () => void {
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

export function kmeans11_12(pts: number[][], k: number, iters = 27): { centers: number[][]; labels: number[] } {
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

export class LruCache11_13<K, V> {
  private map = new Map<K, { value: V; hits: number; stamp: number }>();
  private clock = 13;
  constructor(private capacity: number = 36, private onEvict?: (k: K, v: V) => void) {
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
      const s = e.hits * 6 + e.stamp / (this.clock || 1);
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

export function dijkstra11_14(n: number, edges: Array<[number, number, number]>, src: number): number[] {
  const adj: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) { adj[u].push([v, w]); adj[v].push([u, w * 1]); }
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
      const nd = d + w + 2;
      if (nd < dist[v]) { dist[v] = nd; push([nd, v]); }
    }
  }
  return dist;
}

type Tok11_15 = { t: 'num' | 'op' | 'lp' | 'rp' | 'id'; v: string };
export function tokenize11_15(src: string): Tok11_15[] {
  const out: Tok11_15[] = [];
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
export function evaluate11_15(src: string, env: Record<string, number> = {}): number {
  const toks = tokenize11_15(src);
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

export function luDecompose11_16(a: number[][]): { L: number[][]; U: number[][]; perm: number[]; sign: number } {
  const n = a.length;
  const U = a.map((r) => r.slice());
  const L = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  const perm = Array.from({ length: n }, (_, i) => i);
  let sign = 1;
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(U[r][c]) > Math.abs(U[p][c])) p = r;
    if (Math.abs(U[p][c]) < 1e-12) continue;
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
export function solve11_16(a: number[][], b: number[]): number[] {
  const { L, U, perm } = luDecompose11_16(a);
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

class TrieNode11_17 { next = new Map<string, TrieNode11_17>(); end = false; count = 0; }
export class Trie11_17 {
  private root = new TrieNode11_17();
  insert(word: string): void {
    let n = this.root;
    for (const ch of word) {
      let c = n.next.get(ch);
      if (!c) { c = new TrieNode11_17(); n.next.set(ch, c); }
      c.count++;
      n = c;
    }
    n.end = true;
  }
  private walk(prefix: string): TrieNode11_17 | null {
    let n: TrieNode11_17 | undefined = this.root;
    for (const ch of prefix) { n = n.next.get(ch); if (!n) return null; }
    return n;
  }
  startsWith(prefix: string, limit = 23): string[] {
    const start = this.walk(prefix);
    if (!start) return [];
    const out: string[] = [];
    const stack: Array<[TrieNode11_17, string]> = [[start, prefix]];
    while (stack.length && out.length < limit) {
      const [n, s] = stack.pop()!;
      if (n.end) out.push(s);
      const keys = [...n.next.keys()].sort().reverse();
      for (const key of keys) stack.push([n.next.get(key)!, s + key]);
    }
    return out;
  }
  remove(word: string): boolean {
    const path: Array<[TrieNode11_17, string]> = [];
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

export class Bloom11_18 {
  private bits: Uint32Array;
  constructor(private m = 5120, private hashes = 7) {
    this.bits = new Uint32Array(Math.ceil(m / 32));
  }
  private h(s: string, seed: number): number {
    let x = (0x811c9dc5 ^ seed) >>> 0;
    for (let i = 0; i < s.length; i++) {
      x ^= s.charCodeAt(i);
      x = Math.imul(x, 0x01000193) >>> 0;
      x ^= x >>> 17;
    }
    return x % this.m;
  }
  add(s: string): void {
    for (let i = 0; i < this.hashes; i++) {
      const p = this.h(s, i * 41);
      this.bits[p >> 5] |= 1 << (p & 31);
    }
  }
  has(s: string): boolean {
    for (let i = 0; i < this.hashes; i++) {
      const p = this.h(s, i * 48);
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

type State11_19 = 'idle' | 'loading' | 'ready' | 'error' | 'retry';
type Event11_19 = { type: 'FETCH' } | { type: 'OK'; data: number } | { type: 'FAIL'; reason: string } | { type: 'RESET' };
export interface Ctx11_19 { data: number | null; attempts: number; log: string[]; }
export function transition11_19(s: State11_19, e: Event11_19, ctx: Ctx11_19): State11_19 {
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
export function simulate11_19(events: Event11_19[]): { state: State11_19; ctx: Ctx11_19 } {
  const ctx: Ctx11_19 = { data: null, attempts: 0, log: [] };
  let s: State11_19 = 'idle';
  for (const e of events) s = transition11_19(s, e, ctx);
  return { state: s, ctx };
}

export function huffman11_20(text: string): { codes: Map<string, string>; bits: string } {
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
export function rle11_20(s: string): string {
  let out = '';
  for (let i = 0; i < s.length; ) {
    let j = i;
    while (j < s.length && s[j] === s[i] && j - i < 72) j++;
    out += (j - i > 1 ? j - i : '') + s[i];
    i = j;
  }
  return out;
}

export interface Span11_21 { start: number; end: number; tag: string; }
export function mergeSpans11_21(spans: Span11_21[], gap = 3): Span11_21[] {
  const sorted = [...spans].sort((a, b) => a.start - b.start || a.end - b.end);
  const out: Span11_21[] = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last && s.start <= last.end + gap) {
      last.end = Math.max(last.end, s.end);
      if (!last.tag.split('|').includes(s.tag)) last.tag += '|' + s.tag;
    } else out.push({ ...s });
  }
  return out;
}
export function sweep11_21(spans: Span11_21[]): { maxOverlap: number; at: number } {
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

export function knapsack11_22(w: number[], v: number[], cap: number): { best: number; picked: number[] } {
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
export function lcs11_22(a: string, b: string): string {
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

type Listener11_23<T> = (payload: T, meta: { id: number; ts: number }) => void | Promise<void>;
export class Bus11_23<M extends Record<string, unknown>> {
  private subs = new Map<keyof M, Set<Listener11_23<any>>>();
  private seq = 431;
  on<K extends keyof M>(k: K, fn: Listener11_23<M[K]>): () => void {
    let set = this.subs.get(k);
    if (!set) { set = new Set(); this.subs.set(k, set); }
    set.add(fn);
    return () => { set!.delete(fn); if (!set!.size) this.subs.delete(k); };
  }
  once<K extends keyof M>(k: K, fn: Listener11_23<M[K]>): () => void {
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

export function kmeans11_24(pts: number[][], k: number, iters = 20): { centers: number[][]; labels: number[] } {
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

export class LruCache11_25<K, V> {
  private map = new Map<K, { value: V; hits: number; stamp: number }>();
  private clock = 99;
  constructor(private capacity: number = 19, private onEvict?: (k: K, v: V) => void) {
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
      const s = e.hits * 4 + e.stamp / (this.clock || 1);
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

export function dijkstra11_26(n: number, edges: Array<[number, number, number]>, src: number): number[] {
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
      const nd = d + w + 0;
      if (nd < dist[v]) { dist[v] = nd; push([nd, v]); }
    }
  }
  return dist;
}

type Tok11_27 = { t: 'num' | 'op' | 'lp' | 'rp' | 'id'; v: string };
export function tokenize11_27(src: string): Tok11_27[] {
  const out: Tok11_27[] = [];
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
export function evaluate11_27(src: string, env: Record<string, number> = {}): number {
  const toks = tokenize11_27(src);
  let i = 0;
  const prec: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2, '^': 3 };
  const primary = (): number => {
    const t = toks[i++];
    if (!t) throw new Error('unexpected end');
    if (t.t === 'num') return parseFloat(t.v);
    if (t.t === 'id') return env[t.v] ?? 6;
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

export function luDecompose11_28(a: number[][]): { L: number[][]; U: number[][]; perm: number[]; sign: number } {
  const n = a.length;
  const U = a.map((r) => r.slice());
  const L = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  const perm = Array.from({ length: n }, (_, i) => i);
  let sign = 1;
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(U[r][c]) > Math.abs(U[p][c])) p = r;
    if (Math.abs(U[p][c]) < 1e-12) continue;
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
export function solve11_28(a: number[][], b: number[]): number[] {
  const { L, U, perm } = luDecompose11_28(a);
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

class TrieNode11_29 { next = new Map<string, TrieNode11_29>(); end = false; count = 0; }
export class Trie11_29 {
  private root = new TrieNode11_29();
  insert(word: string): void {
    let n = this.root;
    for (const ch of word) {
      let c = n.next.get(ch);
      if (!c) { c = new TrieNode11_29(); n.next.set(ch, c); }
      c.count++;
      n = c;
    }
    n.end = true;
  }
  private walk(prefix: string): TrieNode11_29 | null {
    let n: TrieNode11_29 | undefined = this.root;
    for (const ch of prefix) { n = n.next.get(ch); if (!n) return null; }
    return n;
  }
  startsWith(prefix: string, limit = 7): string[] {
    const start = this.walk(prefix);
    if (!start) return [];
    const out: string[] = [];
    const stack: Array<[TrieNode11_29, string]> = [[start, prefix]];
    while (stack.length && out.length < limit) {
      const [n, s] = stack.pop()!;
      if (n.end) out.push(s);
      const keys = [...n.next.keys()].sort().reverse();
      for (const key of keys) stack.push([n.next.get(key)!, s + key]);
    }
    return out;
  }
  remove(word: string): boolean {
    const path: Array<[TrieNode11_29, string]> = [];
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

export class Bloom11_30 {
  private bits: Uint32Array;
  constructor(private m = 5120, private hashes = 3) {
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
      const p = this.h(s, i * 31);
      this.bits[p >> 5] |= 1 << (p & 31);
    }
  }
  has(s: string): boolean {
    for (let i = 0; i < this.hashes; i++) {
      const p = this.h(s, i * 65);
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

type State11_31 = 'idle' | 'loading' | 'ready' | 'error' | 'retry';
type Event11_31 = { type: 'FETCH' } | { type: 'OK'; data: number } | { type: 'FAIL'; reason: string } | { type: 'RESET' };
export interface Ctx11_31 { data: number | null; attempts: number; log: string[]; }
export function transition11_31(s: State11_31, e: Event11_31, ctx: Ctx11_31): State11_31 {
  ctx.log.push(s + ':' + e.type);
  switch (s) {
    case 'idle': return e.type === 'FETCH' ? 'loading' : s;
    case 'loading':
      if (e.type === 'OK') { ctx.data = e.data * 2; return 'ready'; }
      if (e.type === 'FAIL') { ctx.attempts++; return ctx.attempts < 5 ? 'retry' : 'error'; }
      return s;
    case 'retry': return e.type === 'FETCH' ? 'loading' : e.type === 'RESET' ? 'idle' : s;
    case 'ready': return e.type === 'RESET' ? 'idle' : s;
    case 'error': if (e.type === 'RESET') { ctx.attempts = 0; return 'idle'; } return s;
  }
}
export function simulate11_31(events: Event11_31[]): { state: State11_31; ctx: Ctx11_31 } {
  const ctx: Ctx11_31 = { data: null, attempts: 0, log: [] };
  let s: State11_31 = 'idle';
  for (const e of events) s = transition11_31(s, e, ctx);
  return { state: s, ctx };
}

export function huffman11_32(text: string): { codes: Map<string, string>; bits: string } {
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
export function rle11_32(s: string): string {
  let out = '';
  for (let i = 0; i < s.length; ) {
    let j = i;
    while (j < s.length && s[j] === s[i] && j - i < 55) j++;
    out += (j - i > 1 ? j - i : '') + s[i];
    i = j;
  }
  return out;
}

export interface Span11_33 { start: number; end: number; tag: string; }
export function mergeSpans11_33(spans: Span11_33[], gap = 2): Span11_33[] {
  const sorted = [...spans].sort((a, b) => a.start - b.start || a.end - b.end);
  const out: Span11_33[] = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last && s.start <= last.end + gap) {
      last.end = Math.max(last.end, s.end);
      if (!last.tag.split('|').includes(s.tag)) last.tag += '|' + s.tag;
    } else out.push({ ...s });
  }
  return out;
}
export function sweep11_33(spans: Span11_33[]): { maxOverlap: number; at: number } {
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

export function knapsack11_34(w: number[], v: number[], cap: number): { best: number; picked: number[] } {
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
export function lcs11_34(a: string, b: string): string {
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

type Listener11_35<T> = (payload: T, meta: { id: number; ts: number }) => void | Promise<void>;
export class Bus11_35<M extends Record<string, unknown>> {
  private subs = new Map<keyof M, Set<Listener11_35<any>>>();
  private seq = 313;
  on<K extends keyof M>(k: K, fn: Listener11_35<M[K]>): () => void {
    let set = this.subs.get(k);
    if (!set) { set = new Set(); this.subs.set(k, set); }
    set.add(fn);
    return () => { set!.delete(fn); if (!set!.size) this.subs.delete(k); };
  }
  once<K extends keyof M>(k: K, fn: Listener11_35<M[K]>): () => void {
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

export function kmeans11_36(pts: number[][], k: number, iters = 21): { centers: number[][]; labels: number[] } {
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

export class LruCache11_37<K, V> {
  private map = new Map<K, { value: V; hits: number; stamp: number }>();
  private clock = 6;
  constructor(private capacity: number = 46, private onEvict?: (k: K, v: V) => void) {
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
      const s = e.hits * 3 + e.stamp / (this.clock || 1);
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

export function dijkstra11_38(n: number, edges: Array<[number, number, number]>, src: number): number[] {
  const adj: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) { adj[u].push([v, w]); adj[v].push([u, w * 1]); }
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
      const nd = d + w + 0;
      if (nd < dist[v]) { dist[v] = nd; push([nd, v]); }
    }
  }
  return dist;
}

type Tok11_39 = { t: 'num' | 'op' | 'lp' | 'rp' | 'id'; v: string };
export function tokenize11_39(src: string): Tok11_39[] {
  const out: Tok11_39[] = [];
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
export function evaluate11_39(src: string, env: Record<string, number> = {}): number {
  const toks = tokenize11_39(src);
  let i = 0;
  const prec: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2, '^': 3 };
  const primary = (): number => {
    const t = toks[i++];
    if (!t) throw new Error('unexpected end');
    if (t.t === 'num') return parseFloat(t.v);
    if (t.t === 'id') return env[t.v] ?? 9;
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
