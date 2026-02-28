/**
 * AST Analyzer Module
 * -------------------
 * Parses JavaScript source code using Babel and extracts
 * all function declarations with their parameter names.
 *
 * This uses Abstract Syntax Tree (AST) analysis instead of
 * simple text diffing, so it understands code structure — not
 * just line-by-line changes.
 */

const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

/**
 * Parse JavaScript source code and extract all functions.
 *
 * @param {string} code - The JavaScript source code to analyze
 * @returns {Array<{name: string, params: string[], type: string}>}
 *   Array of function objects with name, parameter list, and declaration type
 *
 * @example
 *   const fns = extractFunctions("function greet(name) { return name; }");
 *   // => [{ name: "greet", params: ["name"], type: "FunctionDeclaration" }]
 */
function extractFunctions(code) {
  // Parse the source code into an AST
  const ast = parser.parse(code, {
    sourceType: "module", // Support import/export syntax
    plugins: ["jsx"],     // Support JSX (React) syntax too
  });

  const functions = [];

  // Walk through every node in the AST
  traverse(ast, {
    // Captures: function myFunc() {}
    FunctionDeclaration(path) {
      if (path.node.id) {
        functions.push({
          name: path.node.id.name,
          params: path.node.params.map(paramToString),
          type: "FunctionDeclaration",
        });
      }
    },

    // Captures: const myFunc = () => {} and const myFunc = function() {}
    VariableDeclarator(path) {
      const init = path.node.init;
      if (
        init &&
        (init.type === "ArrowFunctionExpression" ||
          init.type === "FunctionExpression")
      ) {
        functions.push({
          name: path.node.id.name,
          params: init.params.map(paramToString),
          type: init.type,
        });
      }
    },
  });

  return functions;
}

/**
 * Convert an AST parameter node to a readable string.
 * Handles regular params, default values, rest params, and destructuring.
 *
 * @param {Object} param - Babel AST parameter node
 * @returns {string} Human-readable parameter representation
 */
function paramToString(param) {
  switch (param.type) {
    case "Identifier":
      return param.name;
    case "AssignmentPattern":
      // Default parameter: function(a = 5)
      return `${paramToString(param.left)}=${param.right.raw || "..."}`;
    case "RestElement":
      // Rest parameter: function(...args)
      return `...${paramToString(param.argument)}`;
    case "ObjectPattern":
      return "{ destructured }";
    case "ArrayPattern":
      return "[ destructured ]";
    default:
      return "unknown";
  }
}

module.exports = { extractFunctions };
