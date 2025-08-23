// Simple in-memory blacklist for demonstration. Use Redis or DB for production.
const blacklistedTokens = new Set();

export function blacklistToken(token) {
    blacklistedTokens.add(token);
}

export function isTokenBlacklisted(token) {
    return blacklistedTokens.has(token);
}

export function clearBlacklistedTokens() {
    blacklistedTokens.clear();
}
