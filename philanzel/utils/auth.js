export function isUserLoggedIn() {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("authToken");
    return !!token;
}

export function getLoggedInUser() {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

export function logoutUser() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
}
