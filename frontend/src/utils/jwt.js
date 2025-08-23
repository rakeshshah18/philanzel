// Utility to check if a JWT token is expired
export function isJwtExpired(token) {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // exp is in seconds, Date.now() is in ms
        return payload.exp * 1000 < Date.now();
    } catch (e) {
        return true;
    }
}
