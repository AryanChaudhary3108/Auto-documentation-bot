/**
 * GitHub Comment Module
 * ----------------------
 * Posts a formatted comment on a GitHub pull request
 * using the GitHub REST API via Axios.
 */

const axios = require("axios");

/**
 * Post a comment on a GitHub pull request.
 *
 * @param {string} commentBody - The markdown-formatted comment text
 * @returns {Promise<void>}
 *
 * Required environment variables:
 *   - GITHUB_TOKEN: Personal access token or GitHub Actions token
 *   - GITHUB_REPO:  Repository in "owner/repo" format
 *   - PR_NUMBER:    The pull request number to comment on
 */
async function postComment(commentBody) {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;
    const prNumber = process.env.PR_NUMBER;

    // Validate required environment variables
    if (!token || !repo || !prNumber) {
        console.log("\n⚠️  Missing GitHub environment variables. Skipping PR comment.");
        console.log("   Set GITHUB_TOKEN, GITHUB_REPO, and PR_NUMBER to enable this.\n");
        console.log("📝 Comment that WOULD be posted:\n");
        console.log("─".repeat(60));
        console.log(commentBody);
        console.log("─".repeat(60));
        return;
    }

    // GitHub REST API endpoint for PR comments
    const url = `https://api.github.com/repos/${repo}/issues/${prNumber}/comments`;

    try {
        const response = await axios.post(
            url,
            { body: commentBody },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/vnd.github.v3+json",
                    "User-Agent": "DocuGen-AI-Bot",
                },
            }
        );

        console.log(`\n✅ Comment posted successfully on PR #${prNumber}`);
        console.log(`   View it at: ${response.data.html_url}`);
    } catch (error) {
        console.error(`\n❌ Failed to post comment on PR #${prNumber}`);
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Message: ${error.response.data.message || "Unknown error"}`);
        } else {
            console.error(`   Error: ${error.message}`);
        }
    }
}

module.exports = { postComment };
