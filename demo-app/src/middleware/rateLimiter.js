const hits = new Map();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 100;

export const rateLimiter = (req, res, next) => {
  const now = Date.now();
  const key = req.ip;
  const record = hits.get(key) || { count: 0, resetAt: now + WINDOW_MS };

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + WINDOW_MS;
  }

  record.count += 1;
  hits.set(key, record);

  if (record.count > MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  next();
};
