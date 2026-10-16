import { activities } from './activities.mjs';

// Durations are planning estimates in minutes. Omit filters to include all ideas.
export function findActivities({ category, maxMinutes = Infinity } = {}) {
  if (typeof maxMinutes !== 'number' || Number.isNaN(maxMinutes) || maxMinutes < 0) {
    throw new RangeError('maxMinutes must be a non-negative number.');
  }
  if (category !== undefined && typeof category !== 'string') {
    throw new TypeError('category must be a string.');
  }

  return activities.filter(activity =>
    (category === undefined || activity.category === category) &&
    activity.minutes <= maxMinutes,
  );
}

// Returns undefined when no activity matches. An injectable RNG supports callers
// that need repeatable selections; it must return a number in [0, 1).
export function pickActivity(filters = {}, random = Math.random) {
  const matches = findActivities(filters);
  if (matches.length === 0) return undefined;

  const value = random();
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError('random must return a number from 0 (inclusive) to 1 (exclusive).');
  }

  return matches[Math.floor(value * matches.length)];
}





import { activities } from './activities.mjs';

// Durations are planning estimates in minutes. Omit filters to include all ideas.
export function findActivities({ category, maxMinutes = Infinity } = {}) {
  if (typeof maxMinutes !== 'number' || Number.isNaN(maxMinutes) || maxMinutes < 0) {
    throw new RangeError('maxMinutes must be a non-negative number.');
  }
  if (category !== undefined && typeof category !== 'string') {
    throw new TypeError('category must be a string.');
  }

  return activities.filter(activity =>
    (category === undefined || activity.category === category) &&
    activity.minutes <= maxMinutes,
  );
}

// Returns undefined when no activity matches. An injectable RNG supports callers
// that need repeatable selections; it must return a number in [0, 1).
export function pickActivity(filters = {}, random = Math.random) {
  const matches = findActivities(filters);
  if (matches.length === 0) return undefined;

  const value = random();
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError('random must return a number from 0 (inclusive) to 1 (exclusive).');
  }

  return matches[Math.floor(value * matches.length)];
}





import { activities } from './activities.mjs';

// Durations are planning estimates in minutes. Omit filters to include all ideas.
export function findActivities({ category, maxMinutes = Infinity } = {}) {
  if (typeof maxMinutes !== 'number' || Number.isNaN(maxMinutes) || maxMinutes < 0) {
    throw new RangeError('maxMinutes must be a non-negative number.');
  }
  if (category !== undefined && typeof category !== 'string') {
    throw new TypeError('category must be a string.');
  }

  return activities.filter(activity =>
    (category === undefined || activity.category === category) &&
    activity.minutes <= maxMinutes,
  );
}

// Returns undefined when no activity matches. An injectable RNG supports callers
// that need repeatable selections; it must return a number in [0, 1).
export function pickActivity(filters = {}, random = Math.random) {
  const matches = findActivities(filters);
  if (matches.length === 0) return undefined;

  const value = random();
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError('random must return a number from 0 (inclusive) to 1 (exclusive).');
  }

  return matches[Math.floor(value * matches.length)];
}





import { activities } from './activities.mjs';

// Durations are planning estimates in minutes. Omit filters to include all ideas.
export function findActivities({ category, maxMinutes = Infinity } = {}) {
  if (typeof maxMinutes !== 'number' || Number.isNaN(maxMinutes) || maxMinutes < 0) {
    throw new RangeError('maxMinutes must be a non-negative number.');
  }
  if (category !== undefined && typeof category !== 'string') {
    throw new TypeError('category must be a string.');
  }

  return activities.filter(activity =>
    (category === undefined || activity.category === category) &&
    activity.minutes <= maxMinutes,
  );
}

// Returns undefined when no activity matches. An injectable RNG supports callers
// that need repeatable selections; it must return a number in [0, 1).
export function pickActivity(filters = {}, random = Math.random) {
  const matches = findActivities(filters);
  if (matches.length === 0) return undefined;

  const value = random();
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError('random must return a number from 0 (inclusive) to 1 (exclusive).');
  }

  return matches[Math.floor(value * matches.length)];
}





import { activities } from './activities.mjs';

// Durations are planning estimates in minutes. Omit filters to include all ideas.
export function findActivities({ category, maxMinutes = Infinity } = {}) {
  if (typeof maxMinutes !== 'number' || Number.isNaN(maxMinutes) || maxMinutes < 0) {
    throw new RangeError('maxMinutes must be a non-negative number.');
  }
  if (category !== undefined && typeof category !== 'string') {
    throw new TypeError('category must be a string.');
  }

  return activities.filter(activity =>
    (category === undefined || activity.category === category) &&
    activity.minutes <= maxMinutes,
  );
}

// Returns undefined when no activity matches. An injectable RNG supports callers
// that need repeatable selections; it must return a number in [0, 1).
export function pickActivity(filters = {}, random = Math.random) {
  const matches = findActivities(filters);
  if (matches.length === 0) return undefined;

  const value = random();
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError('random must return a number from 0 (inclusive) to 1 (exclusive).');
  }

  return matches[Math.floor(value * matches.length)];
}





import { activities } from './activities.mjs';

// Durations are planning estimates in minutes. Omit filters to include all ideas.
export function findActivities({ category, maxMinutes = Infinity } = {}) {
  if (typeof maxMinutes !== 'number' || Number.isNaN(maxMinutes) || maxMinutes < 0) {
    throw new RangeError('maxMinutes must be a non-negative number.');
  }
  if (category !== undefined && typeof category !== 'string') {
    throw new TypeError('category must be a string.');
  }

  return activities.filter(activity =>
    (category === undefined || activity.category === category) &&
    activity.minutes <= maxMinutes,
  );
}

// Returns undefined when no activity matches. An injectable RNG supports callers
// that need repeatable selections; it must return a number in [0, 1).
export function pickActivity(filters = {}, random = Math.random) {
  const matches = findActivities(filters);
  if (matches.length === 0) return undefined;

  const value = random();
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError('random must return a number from 0 (inclusive) to 1 (exclusive).');
  }

  return matches[Math.floor(value * matches.length)];
}





import { activities } from './activities.mjs';

// Durations are planning estimates in minutes. Omit filters to include all ideas.
export function findActivities({ category, maxMinutes = Infinity } = {}) {
  if (typeof maxMinutes !== 'number' || Number.isNaN(maxMinutes) || maxMinutes < 0) {
    throw new RangeError('maxMinutes must be a non-negative number.');
  }
  if (category !== undefined && typeof category !== 'string') {
    throw new TypeError('category must be a string.');
  }

  return activities.filter(activity =>
    (category === undefined || activity.category === category) &&
    activity.minutes <= maxMinutes,
  );
}

// Returns undefined when no activity matches. An injectable RNG supports callers
// that need repeatable selections; it must return a number in [0, 1).
export function pickActivity(filters = {}, random = Math.random) {
  const matches = findActivities(filters);
  if (matches.length === 0) return undefined;

  const value = random();
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError('random must return a number from 0 (inclusive) to 1 (exclusive).');
  }

  return matches[Math.floor(value * matches.length)];
}





import { activities } from './activities.mjs';

// Durations are planning estimates in minutes. Omit filters to include all ideas.
export function findActivities({ category, maxMinutes = Infinity } = {}) {
  if (typeof maxMinutes !== 'number' || Number.isNaN(maxMinutes) || maxMinutes < 0) {
    throw new RangeError('maxMinutes must be a non-negative number.');
  }
  if (category !== undefined && typeof category !== 'string') {
    throw new TypeError('category must be a string.');
  }

  return activities.filter(activity =>
    (category === undefined || activity.category === category) &&
    activity.minutes <= maxMinutes,
  );
}

// Returns undefined when no activity matches. An injectable RNG supports callers
// that need repeatable selections; it must return a number in [0, 1).
export function pickActivity(filters = {}, random = Math.random) {
  const matches = findActivities(filters);
  if (matches.length === 0) return undefined;

  const value = random();
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError('random must return a number from 0 (inclusive) to 1 (exclusive).');
  }

  return matches[Math.floor(value * matches.length)];
}





import { activities } from './activities.mjs';

// Durations are planning estimates in minutes. Omit filters to include all ideas.
export function findActivities({ category, maxMinutes = Infinity } = {}) {
  if (typeof maxMinutes !== 'number' || Number.isNaN(maxMinutes) || maxMinutes < 0) {
    throw new RangeError('maxMinutes must be a non-negative number.');
  }
  if (category !== undefined && typeof category !== 'string') {
    throw new TypeError('category must be a string.');
  }

  return activities.filter(activity =>
    (category === undefined || activity.category === category) &&
    activity.minutes <= maxMinutes,
  );
}

// Returns undefined when no activity matches. An injectable RNG supports callers
// that need repeatable selections; it must return a number in [0, 1).
export function pickActivity(filters = {}, random = Math.random) {
  const matches = findActivities(filters);
  if (matches.length === 0) return undefined;

  const value = random();
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError('random must return a number from 0 (inclusive) to 1 (exclusive).');
  }

  return matches[Math.floor(value * matches.length)];
}





import { activities } from './activities.mjs';

// Durations are planning estimates in minutes. Omit filters to include all ideas.
export function findActivities({ category, maxMinutes = Infinity } = {}) {
  if (typeof maxMinutes !== 'number' || Number.isNaN(maxMinutes) || maxMinutes < 0) {
    throw new RangeError('maxMinutes must be a non-negative number.');
  }
  if (category !== undefined && typeof category !== 'string') {
    throw new TypeError('category must be a string.');
  }

  return activities.filter(activity =>
    (category === undefined || activity.category === category) &&
    activity.minutes <= maxMinutes,
  );
}

// Returns undefined when no activity matches. An injectable RNG supports callers
// that need repeatable selections; it must return a number in [0, 1).
export function pickActivity(filters = {}, random = Math.random) {
  const matches = findActivities(filters);
  if (matches.length === 0) return undefined;

  const value = random();
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError('random must return a number from 0 (inclusive) to 1 (exclusive).');
  }

  return matches[Math.floor(value * matches.length)];
}





import { activities } from './activities.mjs';

// Durations are planning estimates in minutes. Omit filters to include all ideas.
export function findActivities({ category, maxMinutes = Infinity } = {}) {
  if (typeof maxMinutes !== 'number' || Number.isNaN(maxMinutes) || maxMinutes < 0) {
    throw new RangeError('maxMinutes must be a non-negative number.');
  }
  if (category !== undefined && typeof category !== 'string') {
    throw new TypeError('category must be a string.');
  }

  return activities.filter(activity =>
    (category === undefined || activity.category === category) &&
    activity.minutes <= maxMinutes,
  );
}

// Returns undefined when no activity matches. An injectable RNG supports callers
// that need repeatable selections; it must return a number in [0, 1).
export function pickActivity(filters = {}, random = Math.random) {
  const matches = findActivities(filters);
  if (matches.length === 0) return undefined;

  const value = random();
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError('random must return a number from 0 (inclusive) to 1 (exclusive).');
  }

  return matches[Math.floor(value * matches.length)];
}





