/**
 * Diff / Change Detection Module
 * --------------------------------
 * Compares two arrays of extracted functions (from the AST analyzer)
 * and determines which functions were added, removed, or modified.
 *
 * "Modified" means the function exists in both versions but its
 * parameters have changed.
 */

/**
 * Compare old and new function lists to detect changes.
 *
 * @param {Array<{name: string, params: string[]}>} oldFunctions
 * @param {Array<{name: string, params: string[]}>} newFunctions
 * @returns {{added: Array, removed: Array, modified: Array}}
 *
 * @example
 *   const changes = detectChanges(
 *     [{ name: "foo", params: ["a"] }],
 *     [{ name: "foo", params: ["a", "b"] }, { name: "bar", params: [] }]
 *   );
 *   // => {
 *   //   added: [{ name: "bar", params: [] }],
 *   //   removed: [],
 *   //   modified: [{ name: "foo", oldParams: ["a"], newParams: ["a", "b"] }]
 *   // }
 */
function detectChanges(oldFunctions, newFunctions) {
    // Build lookup maps by function name for O(1) access
    const oldMap = new Map(oldFunctions.map((fn) => [fn.name, fn]));
    const newMap = new Map(newFunctions.map((fn) => [fn.name, fn]));

    const added = [];
    const removed = [];
    const modified = [];

    // Check for added and modified functions
    for (const [name, newFn] of newMap) {
        if (!oldMap.has(name)) {
            // Function exists in new but not in old → it was added
            added.push(newFn);
        } else {
            // Function exists in both → check if parameters changed
            const oldFn = oldMap.get(name);
            const oldParams = oldFn.params.join(", ");
            const newParams = newFn.params.join(", ");

            if (oldParams !== newParams) {
                modified.push({
                    name,
                    oldParams: oldFn.params,
                    newParams: newFn.params,
                });
            }
        }
    }

    // Check for removed functions
    for (const [name, oldFn] of oldMap) {
        if (!newMap.has(name)) {
            // Function exists in old but not in new → it was removed
            removed.push(oldFn);
        }
    }

    return { added, removed, modified };
}

/**
 * Format the change summary into a human-readable string.
 *
 * @param {{added: Array, removed: Array, modified: Array}} changes
 * @returns {string} Formatted summary text
 */
function formatSummary(changes) {
    const lines = [];

    if (changes.added.length > 0) {
        const names = changes.added.map((fn) => `${fn.name}(${fn.params.join(", ")})`);
        lines.push(`✅ Added: ${names.join(", ")}`);
    }

    if (changes.removed.length > 0) {
        const names = changes.removed.map((fn) => `${fn.name}(${fn.params.join(", ")})`);
        lines.push(`❌ Removed: ${names.join(", ")}`);
    }

    if (changes.modified.length > 0) {
        const descs = changes.modified.map(
            (fn) =>
                `${fn.name}(${fn.oldParams.join(", ")}) → ${fn.name}(${fn.newParams.join(", ")})`
        );
        lines.push(`✏️ Modified: ${descs.join(", ")}`);
    }

    if (lines.length === 0) {
        lines.push("No functional changes detected.");
    }

    return lines.join("\n");
}

module.exports = { detectChanges, formatSummary };
