const MAX_LOGIN_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

const loginAttempts = new Map();

const getClientKey = (req) => {
    return (
        req.ip ||
        req.headers['x-forwarded-for'] ||
        (req.connection && req.connection.remoteAddress) ||
        'unknown'
    );
};

const cleanExpiredAttempts = (entry, now) => {
    if (!entry) {
        return {
            attempts: 0,
            firstAttemptAt: now,
            blockedUntil: null,
        };
    }

    if (entry.blockedUntil && now >= entry.blockedUntil) {
        return {
            attempts: 0,
            firstAttemptAt: now,
            blockedUntil: null,
        };
    }

    if (now - entry.firstAttemptAt > WINDOW_MS) {
        return {
            attempts: 0,
            firstAttemptAt: now,
            blockedUntil: null,
        };
    }

    return entry;
};

const loginRateLimiter = (req, res, next) => {
    const key = getClientKey(req);
    const now = Date.now();
    const existing = loginAttempts.get(key);
    const entry = cleanExpiredAttempts(existing, now);

    if (entry.blockedUntil && now < entry.blockedUntil) {
        const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
        res.set('Retry-After', String(retryAfter));
        return res.status(429).json({
            message: 'Too many login attempts. Please try again later.',
        });
    }

    loginAttempts.set(key, entry);
    req.loginRateLimitKey = key;
    next();
};

const recordFailedLoginAttempt = (key) => {
    const now = Date.now();
    const existing = loginAttempts.get(key);
    const entry = cleanExpiredAttempts(existing, now);

    entry.attempts += 1;
    if (entry.attempts >= MAX_LOGIN_ATTEMPTS) {
        entry.blockedUntil = now + BLOCK_DURATION_MS;
    }

    loginAttempts.set(key, entry);
};

const resetLoginAttempts = (key) => {
    if (key) {
        loginAttempts.delete(key);
    }
};

module.exports = {
    loginRateLimiter,
    recordFailedLoginAttempt,
    resetLoginAttempts,
};
