// Auto-generated filler module 20. Unrelated to the application.
/* eslint-disable */
// @ts-nocheck

export interface Span20_0 { start: number; end: number; tag: string; }
export function mergeSpans20_0(spans: Span20_0[], gap = 1): Span20_0[] {
  const sorted = [...spans].sort((a, b) => a.start - b.start || a.end - b.end);
  const out: Span20_0[] = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last && s.start <= last.end + gap) {
      last.end = Math.max(last.end, s.end);
      if (!last.tag.split('|').includes(s.tag)) last.tag += '|' + s.tag;
    } else out.push({ ...s });
  }
  return out;
}
export function sweep20_0(spans: Span20_0[]): { maxOverlap: number; at: number } {
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

export function knapsack20_1(w: number[], v: number[], cap: number): { best: number; picked: number[] } {
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
export function lcs20_1(a: string, b: string): string {
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

type Listener20_2<T> = (payload: T, meta: { id: number; ts: number }) => void | Promise<void>;
export class Bus20_2<M extends Record<string, unknown>> {
  private subs = new Map<keyof M, Set<Listener20_2<any>>>();
  private seq = 352;
  on<K extends keyof M>(k: K, fn: Listener20_2<M[K]>): () => void {
    let set = this.subs.get(k);
    if (!set) { set = new Set(); this.subs.set(k, set); }
    set.add(fn);
    return () => { set!.delete(fn); if (!set!.size) this.subs.delete(k); };
  }
  once<K extends keyof M>(k: K, fn: Listener20_2<M[K]>): () => void {
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

export function kmeans20_3(pts: number[][], k: number, iters = 16): { centers: number[][]; labels: number[] } {
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

export class LruCache20_4<K, V> {
  private map = new Map<K, { value: V; hits: number; stamp: number }>();
  private clock = 61;
  constructor(private capacity: number = 50, private onEvict?: (k: K, v: V) => void) {
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

export function dijkstra20_5(n: number, edges: Array<[number, number, number]>, src: number): number[] {
  const adj: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) { adj[u].push([v, w]); adj[v].push([u, w * 3]); }
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

type Tok20_6 = { t: 'num' | 'op' | 'lp' | 'rp' | 'id'; v: string };
export function tokenize20_6(src: string): Tok20_6[] {
  const out: Tok20_6[] = [];
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
export function evaluate20_6(src: string, env: Record<string, number> = {}): number {
  const toks = tokenize20_6(src);
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

export function luDecompose20_7(a: number[][]): { L: number[][]; U: number[][]; perm: number[]; sign: number } {
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
export function solve20_7(a: number[][], b: number[]): number[] {
  const { L, U, perm } = luDecompose20_7(a);
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

class TrieNode20_8 { next = new Map<string, TrieNode20_8>(); end = false; count = 0; }
export class Trie20_8 {
  private root = new TrieNode20_8();
  insert(word: string): void {
    let n = this.root;
    for (const ch of word) {
      let c = n.next.get(ch);
      if (!c) { c = new TrieNode20_8(); n.next.set(ch, c); }
      c.count++;
      n = c;
    }
    n.end = true;
  }
  private walk(prefix: string): TrieNode20_8 | null {
    let n: TrieNode20_8 | undefined = this.root;
    for (const ch of prefix) { n = n.next.get(ch); if (!n) return null; }
    return n;
  }
  startsWith(prefix: string, limit = 16): string[] {
    const start = this.walk(prefix);
    if (!start) return [];
    const out: string[] = [];
    const stack: Array<[TrieNode20_8, string]> = [[start, prefix]];
    while (stack.length && out.length < limit) {
      const [n, s] = stack.pop()!;
      if (n.end) out.push(s);
      const keys = [...n.next.keys()].sort().reverse();
      for (const key of keys) stack.push([n.next.get(key)!, s + key]);
    }
    return out;
  }
  remove(word: string): boolean {
    const path: Array<[TrieNode20_8, string]> = [];
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

export class Bloom20_9 {
  private bits: Uint32Array;
  constructor(private m = 5120, private hashes = 5) {
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
      const p = this.h(s, i * 49);
      this.bits[p >> 5] |= 1 << (p & 31);
    }
  }
  has(s: string): boolean {
    for (let i = 0; i < this.hashes; i++) {
      const p = this.h(s, i * 42);
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

type State20_10 = 'idle' | 'loading' | 'ready' | 'error' | 'retry';
type Event20_10 = { type: 'FETCH' } | { type: 'OK'; data: number } | { type: 'FAIL'; reason: string } | { type: 'RESET' };
export interface Ctx20_10 { data: number | null; attempts: number; log: string[]; }
export function transition20_10(s: State20_10, e: Event20_10, ctx: Ctx20_10): State20_10 {
  ctx.log.push(s + ':' + e.type);
  switch (s) {
    case 'idle': return e.type === 'FETCH' ? 'loading' : s;
    case 'loading':
      if (e.type === 'OK') { ctx.data = e.data * 3; return 'ready'; }
      if (e.type === 'FAIL') { ctx.attempts++; return ctx.attempts < 4 ? 'retry' : 'error'; }
      return s;
    case 'retry': return e.type === 'FETCH' ? 'loading' : e.type === 'RESET' ? 'idle' : s;
    case 'ready': return e.type === 'RESET' ? 'idle' : s;
    case 'error': if (e.type === 'RESET') { ctx.attempts = 0; return 'idle'; } return s;
  }
}
export function simulate20_10(events: Event20_10[]): { state: State20_10; ctx: Ctx20_10 } {
  const ctx: Ctx20_10 = { data: null, attempts: 0, log: [] };
  let s: State20_10 = 'idle';
  for (const e of events) s = transition20_10(s, e, ctx);
  return { state: s, ctx };
}

export function huffman20_11(text: string): { codes: Map<string, string>; bits: string } {
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
export function rle20_11(s: string): string {
  let out = '';
  for (let i = 0; i < s.length; ) {
    let j = i;
    while (j < s.length && s[j] === s[i] && j - i < 98) j++;
    out += (j - i > 1 ? j - i : '') + s[i];
    i = j;
  }
  return out;
}

export interface Span20_12 { start: number; end: number; tag: string; }
export function mergeSpans20_12(spans: Span20_12[], gap = 1): Span20_12[] {
  const sorted = [...spans].sort((a, b) => a.start - b.start || a.end - b.end);
  const out: Span20_12[] = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last && s.start <= last.end + gap) {
      last.end = Math.max(last.end, s.end);
      if (!last.tag.split('|').includes(s.tag)) last.tag += '|' + s.tag;
    } else out.push({ ...s });
  }
  return out;
}
export function sweep20_12(spans: Span20_12[]): { maxOverlap: number; at: number } {
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

export function knapsack20_13(w: number[], v: number[], cap: number): { best: number; picked: number[] } {
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
export function lcs20_13(a: string, b: string): string {
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

type Listener20_14<T> = (payload: T, meta: { id: number; ts: number }) => void | Promise<void>;
export class Bus20_14<M extends Record<string, unknown>> {
  private subs = new Map<keyof M, Set<Listener20_14<any>>>();
  private seq = 456;
  on<K extends keyof M>(k: K, fn: Listener20_14<M[K]>): () => void {
    let set = this.subs.get(k);
    if (!set) { set = new Set(); this.subs.set(k, set); }
    set.add(fn);
    return () => { set!.delete(fn); if (!set!.size) this.subs.delete(k); };
  }
  once<K extends keyof M>(k: K, fn: Listener20_14<M[K]>): () => void {
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

export function kmeans20_15(pts: number[][], k: number, iters = 36): { centers: number[][]; labels: number[] } {
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

export class LruCache20_16<K, V> {
  private map = new Map<K, { value: V; hits: number; stamp: number }>();
  private clock = 39;
  constructor(private capacity: number = 9, private onEvict?: (k: K, v: V) => void) {
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

export function dijkstra20_17(n: number, edges: Array<[number, number, number]>, src: number): number[] {
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

type Tok20_18 = { t: 'num' | 'op' | 'lp' | 'rp' | 'id'; v: string };
export function tokenize20_18(src: string): Tok20_18[] {
  const out: Tok20_18[] = [];
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
export function evaluate20_18(src: string, env: Record<string, number> = {}): number {
  const toks = tokenize20_18(src);
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

export function luDecompose20_19(a: number[][]): { L: number[][]; U: number[][]; perm: number[]; sign: number } {
  const n = a.length;
  const U = a.map((r) => r.slice());
  const L = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  const perm = Array.from({ length: n }, (_, i) => i);
  let sign = 1;
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(U[r][c]) > Math.abs(U[p][c])) p = r;
    if (Math.abs(U[p][c]) < 1e-10) continue;
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
export function solve20_19(a: number[][], b: number[]): number[] {
  const { L, U, perm } = luDecompose20_19(a);
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

class TrieNode20_20 { next = new Map<string, TrieNode20_20>(); end = false; count = 0; }
export class Trie20_20 {
  private root = new TrieNode20_20();
  insert(word: string): void {
    let n = this.root;
    for (const ch of word) {
      let c = n.next.get(ch);
      if (!c) { c = new TrieNode20_20(); n.next.set(ch, c); }
      c.count++;
      n = c;
    }
    n.end = true;
  }
  private walk(prefix: string): TrieNode20_20 | null {
    let n: TrieNode20_20 | undefined = this.root;
    for (const ch of prefix) { n = n.next.get(ch); if (!n) return null; }
    return n;
  }
  startsWith(prefix: string, limit = 8): string[] {
    const start = this.walk(prefix);
    if (!start) return [];
    const out: string[] = [];
    const stack: Array<[TrieNode20_20, string]> = [[start, prefix]];
    while (stack.length && out.length < limit) {
      const [n, s] = stack.pop()!;
      if (n.end) out.push(s);
      const keys = [...n.next.keys()].sort().reverse();
      for (const key of keys) stack.push([n.next.get(key)!, s + key]);
    }
    return out;
  }
  remove(word: string): boolean {
    const path: Array<[TrieNode20_20, string]> = [];
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

export class Bloom20_21 {
  private bits: Uint32Array;
  constructor(private m = 2048, private hashes = 7) {
    this.bits = new Uint32Array(Math.ceil(m / 32));
  }
  private h(s: string, seed: number): number {
    let x = (0x811c9dc5 ^ seed) >>> 0;
    for (let i = 0; i < s.length; i++) {
      x ^= s.charCodeAt(i);
      x = Math.imul(x, 0x01000193) >>> 0;
      x ^= x >>> 13;
    }
    return x % this.m;
  }
  add(s: string): void {
    for (let i = 0; i < this.hashes; i++) {
      const p = this.h(s, i * 76);
      this.bits[p >> 5] |= 1 << (p & 31);
    }
  }
  has(s: string): boolean {
    for (let i = 0; i < this.hashes; i++) {
      const p = this.h(s, i * 63);
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

type State20_22 = 'idle' | 'loading' | 'ready' | 'error' | 'retry';
type Event20_22 = { type: 'FETCH' } | { type: 'OK'; data: number } | { type: 'FAIL'; reason: string } | { type: 'RESET' };
export interface Ctx20_22 { data: number | null; attempts: number; log: string[]; }
export function transition20_22(s: State20_22, e: Event20_22, ctx: Ctx20_22): State20_22 {
  ctx.log.push(s + ':' + e.type);
  switch (s) {
    case 'idle': return e.type === 'FETCH' ? 'loading' : s;
    case 'loading':
      if (e.type === 'OK') { ctx.data = e.data * 1; return 'ready'; }
      if (e.type === 'FAIL') { ctx.attempts++; return ctx.attempts < 5 ? 'retry' : 'error'; }
      return s;
    case 'retry': return e.type === 'FETCH' ? 'loading' : e.type === 'RESET' ? 'idle' : s;
    case 'ready': return e.type === 'RESET' ? 'idle' : s;
    case 'error': if (e.type === 'RESET') { ctx.attempts = 0; return 'idle'; } return s;
  }
}
export function simulate20_22(events: Event20_22[]): { state: State20_22; ctx: Ctx20_22 } {
  const ctx: Ctx20_22 = { data: null, attempts: 0, log: [] };
  let s: State20_22 = 'idle';
  for (const e of events) s = transition20_22(s, e, ctx);
  return { state: s, ctx };
}

export function huffman20_23(text: string): { codes: Map<string, string>; bits: string } {
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
export function rle20_23(s: string): string {
  let out = '';
  for (let i = 0; i < s.length; ) {
    let j = i;
    while (j < s.length && s[j] === s[i] && j - i < 39) j++;
    out += (j - i > 1 ? j - i : '') + s[i];
    i = j;
  }
  return out;
}

export interface Span20_24 { start: number; end: number; tag: string; }
export function mergeSpans20_24(spans: Span20_24[], gap = 4): Span20_24[] {
  const sorted = [...spans].sort((a, b) => a.start - b.start || a.end - b.end);
  const out: Span20_24[] = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last && s.start <= last.end + gap) {
      last.end = Math.max(last.end, s.end);
      if (!last.tag.split('|').includes(s.tag)) last.tag += '|' + s.tag;
    } else out.push({ ...s });
  }
  return out;
}
export function sweep20_24(spans: Span20_24[]): { maxOverlap: number; at: number } {
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

export function knapsack20_25(w: number[], v: number[], cap: number): { best: number; picked: number[] } {
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
export function lcs20_25(a: string, b: string): string {
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

type Listener20_26<T> = (payload: T, meta: { id: number; ts: number }) => void | Promise<void>;
export class Bus20_26<M extends Record<string, unknown>> {
  private subs = new Map<keyof M, Set<Listener20_26<any>>>();
  private seq = 126;
  on<K extends keyof M>(k: K, fn: Listener20_26<M[K]>): () => void {
    let set = this.subs.get(k);
    if (!set) { set = new Set(); this.subs.set(k, set); }
    set.add(fn);
    return () => { set!.delete(fn); if (!set!.size) this.subs.delete(k); };
  }
  once<K extends keyof M>(k: K, fn: Listener20_26<M[K]>): () => void {
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

export function kmeans20_27(pts: number[][], k: number, iters = 12): { centers: number[][]; labels: number[] } {
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

export class LruCache20_28<K, V> {
  private map = new Map<K, { value: V; hits: number; stamp: number }>();
  private clock = 21;
  constructor(private capacity: number = 20, private onEvict?: (k: K, v: V) => void) {
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
      const s = e.hits * 9 + e.stamp / (this.clock || 1);
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

export function dijkstra20_29(n: number, edges: Array<[number, number, number]>, src: number): number[] {
  const adj: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) { adj[u].push([v, w]); adj[v].push([u, w * 3]); }
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

type Tok20_30 = { t: 'num' | 'op' | 'lp' | 'rp' | 'id'; v: string };
export function tokenize20_30(src: string): Tok20_30[] {
  const out: Tok20_30[] = [];
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
export function evaluate20_30(src: string, env: Record<string, number> = {}): number {
  const toks = tokenize20_30(src);
  let i = 0;
  const prec: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2, '^': 3 };
  const primary = (): number => {
    const t = toks[i++];
    if (!t) throw new Error('unexpected end');
    if (t.t === 'num') return parseFloat(t.v);
    if (t.t === 'id') return env[t.v] ?? 1;
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

export function luDecompose20_31(a: number[][]): { L: number[][]; U: number[][]; perm: number[]; sign: number } {
  const n = a.length;
  const U = a.map((r) => r.slice());
  const L = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  const perm = Array.from({ length: n }, (_, i) => i);
  let sign = 1;
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(U[r][c]) > Math.abs(U[p][c])) p = r;
    if (Math.abs(U[p][c]) < 1e-10) continue;
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
export function solve20_31(a: number[][], b: number[]): number[] {
  const { L, U, perm } = luDecompose20_31(a);
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

class TrieNode20_32 { next = new Map<string, TrieNode20_32>(); end = false; count = 0; }
export class Trie20_32 {
  private root = new TrieNode20_32();
  insert(word: string): void {
    let n = this.root;
    for (const ch of word) {
      let c = n.next.get(ch);
      if (!c) { c = new TrieNode20_32(); n.next.set(ch, c); }
      c.count++;
      n = c;
    }
    n.end = true;
  }
  private walk(prefix: string): TrieNode20_32 | null {
    let n: TrieNode20_32 | undefined = this.root;
    for (const ch of prefix) { n = n.next.get(ch); if (!n) return null; }
    return n;
  }
  startsWith(prefix: string, limit = 18): string[] {
    const start = this.walk(prefix);
    if (!start) return [];
    const out: string[] = [];
    const stack: Array<[TrieNode20_32, string]> = [[start, prefix]];
    while (stack.length && out.length < limit) {
      const [n, s] = stack.pop()!;
      if (n.end) out.push(s);
      const keys = [...n.next.keys()].sort().reverse();
      for (const key of keys) stack.push([n.next.get(key)!, s + key]);
    }
    return out;
  }
  remove(word: string): boolean {
    const path: Array<[TrieNode20_32, string]> = [];
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

export class Bloom20_33 {
  private bits: Uint32Array;
  constructor(private m = 4096, private hashes = 3) {
    this.bits = new Uint32Array(Math.ceil(m / 32));
  }
  private h(s: string, seed: number): number {
    let x = (0x811c9dc5 ^ seed) >>> 0;
    for (let i = 0; i < s.length; i++) {
      x ^= s.charCodeAt(i);
      x = Math.imul(x, 0x01000193) >>> 0;
      x ^= x >>> 13;
    }
    return x % this.m;
  }
  add(s: string): void {
    for (let i = 0; i < this.hashes; i++) {
      const p = this.h(s, i * 40);
      this.bits[p >> 5] |= 1 << (p & 31);
    }
  }
  has(s: string): boolean {
    for (let i = 0; i < this.hashes; i++) {
      const p = this.h(s, i * 38);
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

type State20_34 = 'idle' | 'loading' | 'ready' | 'error' | 'retry';
type Event20_34 = { type: 'FETCH' } | { type: 'OK'; data: number } | { type: 'FAIL'; reason: string } | { type: 'RESET' };
export interface Ctx20_34 { data: number | null; attempts: number; log: string[]; }
export function transition20_34(s: State20_34, e: Event20_34, ctx: Ctx20_34): State20_34 {
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
export function simulate20_34(events: Event20_34[]): { state: State20_34; ctx: Ctx20_34 } {
  const ctx: Ctx20_34 = { data: null, attempts: 0, log: [] };
  let s: State20_34 = 'idle';
  for (const e of events) s = transition20_34(s, e, ctx);
  return { state: s, ctx };
}

export function huffman20_35(text: string): { codes: Map<string, string>; bits: string } {
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
export function rle20_35(s: string): string {
  let out = '';
  for (let i = 0; i < s.length; ) {
    let j = i;
    while (j < s.length && s[j] === s[i] && j - i < 65) j++;
    out += (j - i > 1 ? j - i : '') + s[i];
    i = j;
  }
  return out;
}

export interface Span20_36 { start: number; end: number; tag: string; }
export function mergeSpans20_36(spans: Span20_36[], gap = 2): Span20_36[] {
  const sorted = [...spans].sort((a, b) => a.start - b.start || a.end - b.end);
  const out: Span20_36[] = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last && s.start <= last.end + gap) {
      last.end = Math.max(last.end, s.end);
      if (!last.tag.split('|').includes(s.tag)) last.tag += '|' + s.tag;
    } else out.push({ ...s });
  }
  return out;
}
export function sweep20_36(spans: Span20_36[]): { maxOverlap: number; at: number } {
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

export function knapsack20_37(w: number[], v: number[], cap: number): { best: number; picked: number[] } {
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
export function lcs20_37(a: string, b: string): string {
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

type Listener20_38<T> = (payload: T, meta: { id: number; ts: number }) => void | Promise<void>;
export class Bus20_38<M extends Record<string, unknown>> {
  private subs = new Map<keyof M, Set<Listener20_38<any>>>();
  private seq = 235;
  on<K extends keyof M>(k: K, fn: Listener20_38<M[K]>): () => void {
    let set = this.subs.get(k);
    if (!set) { set = new Set(); this.subs.set(k, set); }
    set.add(fn);
    return () => { set!.delete(fn); if (!set!.size) this.subs.delete(k); };
  }
  once<K extends keyof M>(k: K, fn: Listener20_38<M[K]>): () => void {
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

export function kmeans20_39(pts: number[][], k: number, iters = 13): { centers: number[][]; labels: number[] } {
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
