/**
 * DocuGen AI – Express Server
 * Serves the landing page and provides API for live code analysis
 */

require("dotenv").config();
const express = require("express");
const path = require("path");
const { extractFunctions } = require("./src/ast/analyzer");
const { detectChanges, formatSummary } = require("./src/utils/diff");
const { generateDocs } = require("./src/ai/generateDocs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "website")));

// ─── API: Analyze Code ──────────────────────────────
app.post("/api/analyze", async (req, res) => {
    try {
        const { oldCode, newCode } = req.body;

        if (!oldCode || !newCode) {
            return res.status(400).json({ error: "Both oldCode and newCode are required." });
        }

        console.log("\n🔄 API request: /api/analyze");

        // Step 1: AST Parse
        const oldFunctions = extractFunctions(oldCode);
        const newFunctions = extractFunctions(newCode);
        console.log(`   🌳 Old: ${oldFunctions.length} functions, New: ${newFunctions.length} functions`);

        // Step 2: Detect Changes
        const changes = detectChanges(oldFunctions, newFunctions);
        const summary = formatSummary(changes);
        console.log(`   🔍 ${changes.added.length} added, ${changes.removed.length} removed, ${changes.modified.length} modified`);

        // Step 3: Generate AI Docs
        console.log("   🤖 Generating AI docs...");
        const docs = await generateDocs(summary);
        console.log("   ✅ Done!");

        res.json({
            success: true,
            stats: {
                oldFunctions: oldFunctions.length,
                newFunctions: newFunctions.length,
                added: changes.added.length,
                removed: changes.removed.length,
                modified: changes.modified.length,
            },
            changes: {
                added: changes.added,
                removed: changes.removed,
                modified: changes.modified,
            },
            summary,
            docs,
        });
    } catch (error) {
        console.error("❌ API error:", error.message);
        res.status(500).json({ error: "Failed to analyze code: " + error.message });
    }
});

// ─── Serve Website ──────────────────────────────────
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "website", "index.html"));
});

// ─── Start Server ───────────────────────────────────
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════╗
║  🤖 DocuGen AI – Web Server Running      ║
╚══════════════════════════════════════════╝

   🌐 Website: http://localhost:${PORT}
   📡 API:     http://localhost:${PORT}/api/analyze
  `);
});
