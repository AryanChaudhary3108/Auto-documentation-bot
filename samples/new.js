/**
 * Sample "new" version of code.
 * This represents the codebase AFTER the pull request changes.
 *
 * Changes from old.js:
 *   - greetUser: parameter added (greeting)    → MODIFIED
 *   - getUser: REMOVED
 *   - calculateTotal: unchanged
 *   - formatDate: changed to accept options     → MODIFIED
 *   - validateEmail: unchanged
 *   - loginUser: NEW function
 *   - logoutUser: NEW function
 */

// Greeting function — now accepts a custom greeting message
function greetUser(name, greeting) {
    return `${greeting || "Hello"}, ${name}!`;
}

// calculateTotal is unchanged
function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price, 0);
}

// formatDate now supports locale options
const formatDate = (date, locale) => {
    return new Date(date).toLocaleDateString(locale || "en-US");
};

// validateEmail is unchanged
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// NEW: Log in a user with email and password
function loginUser(email, password) {
    return fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    }).then((res) => res.json());
}

// NEW: Log out the current user
const logoutUser = () => {
    return fetch("/api/auth/logout", { method: "POST" });
};
