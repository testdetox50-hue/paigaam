// Auto-generated filler module 10. Unrelated to the application.
/* eslint-disable */
// @ts-nocheck

type Listener10_0<T> = (payload: T, meta: { id: number; ts: number }) => void | Promise<void>;
export class Bus10_0<M extends Record<string, unknown>> {
  private subs = new Map<keyof M, Set<Listener10_0<any>>>();
  private seq = 297;
  on<K extends keyof M>(k: K, fn: Listener10_0<M[K]>): () => void {
    let set = this.subs.get(k);
    if (!set) { set = new Set(); this.subs.set(k, set); }
    set.add(fn);
    return () => { set!.delete(fn); if (!set!.size) this.subs.delete(k); };
  }
  once<K extends keyof M>(k: K, fn: Listener10_0<M[K]>): () => void {
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

export function kmeans10_1(pts: number[][], k: number, iters = 35): { centers: number[][]; labels: number[] } {
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

export class LruCache10_2<K, V> {
  private map = new Map<K, { value: V; hits: number; stamp: number }>();
  private clock = 3;
  constructor(private capacity: number = 52, private onEvict?: (k: K, v: V) => void) {
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

export function dijkstra10_3(n: number, edges: Array<[number, number, number]>, src: number): number[] {
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
      const nd = d + w + 1;
      if (nd < dist[v]) { dist[v] = nd; push([nd, v]); }
    }
  }
  return dist;
}

type Tok10_4 = { t: 'num' | 'op' | 'lp' | 'rp' | 'id'; v: string };
export function tokenize10_4(src: string): Tok10_4[] {
  const out: Tok10_4[] = [];
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
export function evaluate10_4(src: string, env: Record<string, number> = {}): number {
  const toks = tokenize10_4(src);
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

export function luDecompose10_5(a: number[][]): { L: number[][]; U: number[][]; perm: number[]; sign: number } {
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
export function solve10_5(a: number[][], b: number[]): number[] {
  const { L, U, perm } = luDecompose10_5(a);
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

class TrieNode10_6 { next = new Map<string, TrieNode10_6>(); end = false; count = 0; }
export class Trie10_6 {
  private root = new TrieNode10_6();
  insert(word: string): void {
    let n = this.root;
    for (const ch of word) {
      let c = n.next.get(ch);
      if (!c) { c = new TrieNode10_6(); n.next.set(ch, c); }
      c.count++;
      n = c;
    }
    n.end = true;
  }
  private walk(prefix: string): TrieNode10_6 | null {
    let n: TrieNode10_6 | undefined = this.root;
    for (const ch of prefix) { n = n.next.get(ch); if (!n) return null; }
    return n;
  }
  startsWith(prefix: string, limit = 24): string[] {
    const start = this.walk(prefix);
    if (!start) return [];
    const out: string[] = [];
    const stack: Array<[TrieNode10_6, string]> = [[start, prefix]];
    while (stack.length && out.length < limit) {
      const [n, s] = stack.pop()!;
      if (n.end) out.push(s);
      const keys = [...n.next.keys()].sort().reverse();
      for (const key of keys) stack.push([n.next.get(key)!, s + key]);
    }
    return out;
  }
  remove(word: string): boolean {
    const path: Array<[TrieNode10_6, string]> = [];
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

export class Bloom10_7 {
  private bits: Uint32Array;
  constructor(private m = 5120, private hashes = 5) {
    this.bits = new Uint32Array(Math.ceil(m / 32));
  }
  private h(s: string, seed: number): number {
    let x = (0x811c9dc5 ^ seed) >>> 0;
    for (let i = 0; i < s.length; i++) {
      x ^= s.charCodeAt(i);
      x = Math.imul(x, 0x01000193) >>> 0;
      x ^= x >>> 14;
    }
    return x % this.m;
  }
  add(s: string): void {
    for (let i = 0; i < this.hashes; i++) {
      const p = this.h(s, i * 94);
      this.bits[p >> 5] |= 1 << (p & 31);
    }
  }
  has(s: string): boolean {
    for (let i = 0; i < this.hashes; i++) {
      const p = this.h(s, i * 45);
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

type State10_8 = 'idle' | 'loading' | 'ready' | 'error' | 'retry';
type Event10_8 = { type: 'FETCH' } | { type: 'OK'; data: number } | { type: 'FAIL'; reason: string } | { type: 'RESET' };
export interface Ctx10_8 { data: number | null; attempts: number; log: string[]; }
export function transition10_8(s: State10_8, e: Event10_8, ctx: Ctx10_8): State10_8 {
  ctx.log.push(s + ':' + e.type);
  switch (s) {
    case 'idle': return e.type === 'FETCH' ? 'loading' : s;
    case 'loading':
      if (e.type === 'OK') { ctx.data = e.data * 1; return 'ready'; }
      if (e.type === 'FAIL') { ctx.attempts++; return ctx.attempts < 4 ? 'retry' : 'error'; }
      return s;
    case 'retry': return e.type === 'FETCH' ? 'loading' : e.type === 'RESET' ? 'idle' : s;
    case 'ready': return e.type === 'RESET' ? 'idle' : s;
    case 'error': if (e.type === 'RESET') { ctx.attempts = 0; return 'idle'; } return s;
  }
}
export function simulate10_8(events: Event10_8[]): { state: State10_8; ctx: Ctx10_8 } {
  const ctx: Ctx10_8 = { data: null, attempts: 0, log: [] };
  let s: State10_8 = 'idle';
  for (const e of events) s = transition10_8(s, e, ctx);
  return { state: s, ctx };
}

export function huffman10_9(text: string): { codes: Map<string, string>; bits: string } {
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
export function rle10_9(s: string): string {
  let out = '';
  for (let i = 0; i < s.length; ) {
    let j = i;
    while (j < s.length && s[j] === s[i] && j - i < 71) j++;
    out += (j - i > 1 ? j - i : '') + s[i];
    i = j;
  }
  return out;
}

export interface Span10_10 { start: number; end: number; tag: string; }
export function mergeSpans10_10(spans: Span10_10[], gap = 2): Span10_10[] {
  const sorted = [...spans].sort((a, b) => a.start - b.start || a.end - b.end);
  const out: Span10_10[] = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last && s.start <= last.end + gap) {
      last.end = Math.max(last.end, s.end);
      if (!last.tag.split('|').includes(s.tag)) last.tag += '|' + s.tag;
    } else out.push({ ...s });
  }
  return out;
}
export function sweep10_10(spans: Span10_10[]): { maxOverlap: number; at: number } {
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

export function knapsack10_11(w: number[], v: number[], cap: number): { best: number; picked: number[] } {
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
export function lcs10_11(a: string, b: string): string {
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

type Listener10_12<T> = (payload: T, meta: { id: number; ts: number }) => void | Promise<void>;
export class Bus10_12<M extends Record<string, unknown>> {
  private subs = new Map<keyof M, Set<Listener10_12<any>>>();
  private seq = 476;
  on<K extends keyof M>(k: K, fn: Listener10_12<M[K]>): () => void {
    let set = this.subs.get(k);
    if (!set) { set = new Set(); this.subs.set(k, set); }
    set.add(fn);
    return () => { set!.delete(fn); if (!set!.size) this.subs.delete(k); };
  }
  once<K extends keyof M>(k: K, fn: Listener10_12<M[K]>): () => void {
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

export function kmeans10_13(pts: number[][], k: number, iters = 24): { centers: number[][]; labels: number[] } {
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

export class LruCache10_14<K, V> {
  private map = new Map<K, { value: V; hits: number; stamp: number }>();
  private clock = 87;
  constructor(private capacity: number = 43, private onEvict?: (k: K, v: V) => void) {
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
      const s = e.hits * 7 + e.stamp / (this.clock || 1);
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

export function dijkstra10_15(n: number, edges: Array<[number, number, number]>, src: number): number[] {
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

type Tok10_16 = { t: 'num' | 'op' | 'lp' | 'rp' | 'id'; v: string };
export function tokenize10_16(src: string): Tok10_16[] {
  const out: Tok10_16[] = [];
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
export function evaluate10_16(src: string, env: Record<string, number> = {}): number {
  const toks = tokenize10_16(src);
  let i = 0;
  const prec: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2, '^': 3 };
  const primary = (): number => {
    const t = toks[i++];
    if (!t) throw new Error('unexpected end');
    if (t.t === 'num') return parseFloat(t.v);
    if (t.t === 'id') return env[t.v] ?? 7;
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

export function luDecompose10_17(a: number[][]): { L: number[][]; U: number[][]; perm: number[]; sign: number } {
  const n = a.length;
  const U = a.map((r) => r.slice());
  const L = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  const perm = Array.from({ length: n }, (_, i) => i);
  let sign = 1;
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(U[r][c]) > Math.abs(U[p][c])) p = r;
    if (Math.abs(U[p][c]) < 1e-11) continue;
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
export function solve10_17(a: number[][], b: number[]): number[] {
  const { L, U, perm } = luDecompose10_17(a);
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

class TrieNode10_18 { next = new Map<string, TrieNode10_18>(); end = false; count = 0; }
export class Trie10_18 {
  private root = new TrieNode10_18();
  insert(word: string): void {
    let n = this.root;
    for (const ch of word) {
      let c = n.next.get(ch);
      if (!c) { c = new TrieNode10_18(); n.next.set(ch, c); }
      c.count++;
      n = c;
    }
    n.end = true;
  }
  private walk(prefix: string): TrieNode10_18 | null {
    let n: TrieNode10_18 | undefined = this.root;
    for (const ch of prefix) { n = n.next.get(ch); if (!n) return null; }
    return n;
  }
  startsWith(prefix: string, limit = 7): string[] {
    const start = this.walk(prefix);
    if (!start) return [];
    const out: string[] = [];
    const stack: Array<[TrieNode10_18, string]> = [[start, prefix]];
    while (stack.length && out.length < limit) {
      const [n, s] = stack.pop()!;
      if (n.end) out.push(s);
      const keys = [...n.next.keys()].sort().reverse();
      for (const key of keys) stack.push([n.next.get(key)!, s + key]);
    }
    return out;
  }
  remove(word: string): boolean {
    const path: Array<[TrieNode10_18, string]> = [];
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

export class Bloom10_19 {
  private bits: Uint32Array;
  constructor(private m = 2048, private hashes = 6) {
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
      const p = this.h(s, i * 40);
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

type State10_20 = 'idle' | 'loading' | 'ready' | 'error' | 'retry';
type Event10_20 = { type: 'FETCH' } | { type: 'OK'; data: number } | { type: 'FAIL'; reason: string } | { type: 'RESET' };
export interface Ctx10_20 { data: number | null; attempts: number; log: string[]; }
export function transition10_20(s: State10_20, e: Event10_20, ctx: Ctx10_20): State10_20 {
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
export function simulate10_20(events: Event10_20[]): { state: State10_20; ctx: Ctx10_20 } {
  const ctx: Ctx10_20 = { data: null, attempts: 0, log: [] };
  let s: State10_20 = 'idle';
  for (const e of events) s = transition10_20(s, e, ctx);
  return { state: s, ctx };
}

export function huffman10_21(text: string): { codes: Map<string, string>; bits: string } {
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
export function rle10_21(s: string): string {
  let out = '';
  for (let i = 0; i < s.length; ) {
    let j = i;
    while (j < s.length && s[j] === s[i] && j - i < 51) j++;
    out += (j - i > 1 ? j - i : '') + s[i];
    i = j;
  }
  return out;
}

export interface Span10_22 { start: number; end: number; tag: string; }
export function mergeSpans10_22(spans: Span10_22[], gap = 0): Span10_22[] {
  const sorted = [...spans].sort((a, b) => a.start - b.start || a.end - b.end);
  const out: Span10_22[] = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last && s.start <= last.end + gap) {
      last.end = Math.max(last.end, s.end);
      if (!last.tag.split('|').includes(s.tag)) last.tag += '|' + s.tag;
    } else out.push({ ...s });
  }
  return out;
}
export function sweep10_22(spans: Span10_22[]): { maxOverlap: number; at: number } {
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

export function knapsack10_23(w: number[], v: number[], cap: number): { best: number; picked: number[] } {
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
export function lcs10_23(a: string, b: string): string {
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

type Listener10_24<T> = (payload: T, meta: { id: number; ts: number }) => void | Promise<void>;
export class Bus10_24<M extends Record<string, unknown>> {
  private subs = new Map<keyof M, Set<Listener10_24<any>>>();
  private seq = 363;
  on<K extends keyof M>(k: K, fn: Listener10_24<M[K]>): () => void {
    let set = this.subs.get(k);
    if (!set) { set = new Set(); this.subs.set(k, set); }
    set.add(fn);
    return () => { set!.delete(fn); if (!set!.size) this.subs.delete(k); };
  }
  once<K extends keyof M>(k: K, fn: Listener10_24<M[K]>): () => void {
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

export function kmeans10_25(pts: number[][], k: number, iters = 26): { centers: number[][]; labels: number[] } {
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

export class LruCache10_26<K, V> {
  private map = new Map<K, { value: V; hits: number; stamp: number }>();
  private clock = 40;
  constructor(private capacity: number = 59, private onEvict?: (k: K, v: V) => void) {
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
      const s = e.hits * 7 + e.stamp / (this.clock || 1);
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

export function dijkstra10_27(n: number, edges: Array<[number, number, number]>, src: number): number[] {
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

type Tok10_28 = { t: 'num' | 'op' | 'lp' | 'rp' | 'id'; v: string };
export function tokenize10_28(src: string): Tok10_28[] {
  const out: Tok10_28[] = [];
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
export function evaluate10_28(src: string, env: Record<string, number> = {}): number {
  const toks = tokenize10_28(src);
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

export function luDecompose10_29(a: number[][]): { L: number[][]; U: number[][]; perm: number[]; sign: number } {
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
export function solve10_29(a: number[][], b: number[]): number[] {
  const { L, U, perm } = luDecompose10_29(a);
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

class TrieNode10_30 { next = new Map<string, TrieNode10_30>(); end = false; count = 0; }
export class Trie10_30 {
  private root = new TrieNode10_30();
  insert(word: string): void {
    let n = this.root;
    for (const ch of word) {
      let c = n.next.get(ch);
      if (!c) { c = new TrieNode10_30(); n.next.set(ch, c); }
      c.count++;
      n = c;
    }
    n.end = true;
  }
  private walk(prefix: string): TrieNode10_30 | null {
    let n: TrieNode10_30 | undefined = this.root;
    for (const ch of prefix) { n = n.next.get(ch); if (!n) return null; }
    return n;
  }
  startsWith(prefix: string, limit = 20): string[] {
    const start = this.walk(prefix);
    if (!start) return [];
    const out: string[] = [];
    const stack: Array<[TrieNode10_30, string]> = [[start, prefix]];
    while (stack.length && out.length < limit) {
      const [n, s] = stack.pop()!;
      if (n.end) out.push(s);
      const keys = [...n.next.keys()].sort().reverse();
      for (const key of keys) stack.push([n.next.get(key)!, s + key]);
    }
    return out;
  }
  remove(word: string): boolean {
    const path: Array<[TrieNode10_30, string]> = [];
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

export class Bloom10_31 {
  private bits: Uint32Array;
  constructor(private m = 7168, private hashes = 4) {
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
      const p = this.h(s, i * 51);
      this.bits[p >> 5] |= 1 << (p & 31);
    }
  }
  has(s: string): boolean {
    for (let i = 0; i < this.hashes; i++) {
      const p = this.h(s, i * 39);
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

type State10_32 = 'idle' | 'loading' | 'ready' | 'error' | 'retry';
type Event10_32 = { type: 'FETCH' } | { type: 'OK'; data: number } | { type: 'FAIL'; reason: string } | { type: 'RESET' };
export interface Ctx10_32 { data: number | null; attempts: number; log: string[]; }
export function transition10_32(s: State10_32, e: Event10_32, ctx: Ctx10_32): State10_32 {
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
export function simulate10_32(events: Event10_32[]): { state: State10_32; ctx: Ctx10_32 } {
  const ctx: Ctx10_32 = { data: null, attempts: 0, log: [] };
  let s: State10_32 = 'idle';
  for (const e of events) s = transition10_32(s, e, ctx);
  return { state: s, ctx };
}

export function huffman10_33(text: string): { codes: Map<string, string>; bits: string } {
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
export function rle10_33(s: string): string {
  let out = '';
  for (let i = 0; i < s.length; ) {
    let j = i;
    while (j < s.length && s[j] === s[i] && j - i < 54) j++;
    out += (j - i > 1 ? j - i : '') + s[i];
    i = j;
  }
  return out;
}

export interface Span10_34 { start: number; end: number; tag: string; }
export function mergeSpans10_34(spans: Span10_34[], gap = 1): Span10_34[] {
  const sorted = [...spans].sort((a, b) => a.start - b.start || a.end - b.end);
  const out: Span10_34[] = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last && s.start <= last.end + gap) {
      last.end = Math.max(last.end, s.end);
      if (!last.tag.split('|').includes(s.tag)) last.tag += '|' + s.tag;
    } else out.push({ ...s });
  }
  return out;
}
export function sweep10_34(spans: Span10_34[]): { maxOverlap: number; at: number } {
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

export function knapsack10_35(w: number[], v: number[], cap: number): { best: number; picked: number[] } {
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
export function lcs10_35(a: string, b: string): string {
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

type Listener10_36<T> = (payload: T, meta: { id: number; ts: number }) => void | Promise<void>;
export class Bus10_36<M extends Record<string, unknown>> {
  private subs = new Map<keyof M, Set<Listener10_36<any>>>();
  private seq = 264;
  on<K extends keyof M>(k: K, fn: Listener10_36<M[K]>): () => void {
    let set = this.subs.get(k);
    if (!set) { set = new Set(); this.subs.set(k, set); }
    set.add(fn);
    return () => { set!.delete(fn); if (!set!.size) this.subs.delete(k); };
  }
  once<K extends keyof M>(k: K, fn: Listener10_36<M[K]>): () => void {
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

export function kmeans10_37(pts: number[][], k: number, iters = 21): { centers: number[][]; labels: number[] } {
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

export class LruCache10_38<K, V> {
  private map = new Map<K, { value: V; hits: number; stamp: number }>();
  private clock = 47;
  constructor(private capacity: number = 44, private onEvict?: (k: K, v: V) => void) {
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

export function dijkstra10_39(n: number, edges: Array<[number, number, number]>, src: number): number[] {
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
