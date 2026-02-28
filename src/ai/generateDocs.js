/**
 * AI Documentation Generator
 * ---------------------------
 * Sends the change summary to Groq AI and receives back
 * a generated changelog entry and README update section.
 *
 * Groq is 100% FREE with generous limits and blazing fast inference.
 * Get your free API key at: https://console.groq.com/keys
 */

const axios = require("axios");

// Groq API endpoint (OpenAI-compatible)
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Generate documentation from a change summary using Groq AI.
 *
 * @param {string} changeSummary - Human-readable summary of code changes
 * @returns {Promise<string>} Generated documentation text
 */
async function generateDocs(changeSummary) {
    // If no API key is set, return a mock response (useful for local testing)
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.startsWith("your")) {
        console.log("⚠️  No valid GROQ_API_KEY found. Using mock AI response.\n");
        return getMockResponse(changeSummary);
    }

    try {
        const prompt = `
You are a technical documentation assistant. Based on the following code changes, 
generate two sections:

1. **Changelog Entry** — A concise bullet-point list of what changed.
2. **README Update** — A short paragraph that could be added to a project README 
   describing the new/updated functionality.

Code Changes:
${changeSummary}

Please keep it concise and professional.
    `.trim();

        const response = await axios.post(
            GROQ_API_URL,
            {
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 500,
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data.choices[0].message.content.trim();
    } catch (error) {
        const msg = error.response?.data?.error?.message || error.message;
        console.error("❌ Groq API error:", msg);
        // Fall back to mock response on error
        return getMockResponse(changeSummary);
    }
}

/**
 * Generate a mock documentation response for demo/testing purposes.
 * Used when no Groq API key is available.
 *
 * @param {string} changeSummary - The change summary text
 * @returns {string} Mock documentation output
 */
function getMockResponse(changeSummary) {
    return `## 📋 Changelog

${changeSummary
            .split("\n")
            .map((line) => `- ${line}`)
            .join("\n")}

## 📖 README Update

This update includes changes to the project's function signatures. 
New functions have been added to extend functionality, and deprecated 
functions have been removed to keep the codebase clean. Please refer 
to the changelog above for specific details.

> *This is a mock response. Set a valid GROQ_API_KEY for AI-generated docs.*`;
}

module.exports = { generateDocs };
