/**
 * Sample "old" version of code.
 * This represents the codebase BEFORE the pull request changes.
 */

// A simple greeting function
function greetUser(name) {
    return `Hello, ${name}!`;
}

// Fetch user data from an API
function getUser(id) {
    return fetch(`/api/users/${id}`).then((res) => res.json());
}

// Calculate the total price of items
function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price, 0);
}

// Format a date string
const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

// Validate an email address
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
