/* ============================================
   DocuGen AI – Landing Page Scripts
   ============================================ */

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});

// Navbar background on scroll
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.style.borderBottomColor = "rgba(255, 255, 255, 0.1)";
        navbar.style.background = "rgba(10, 10, 15, 0.95)";
    } else {
        navbar.style.borderBottomColor = "rgba(255, 255, 255, 0.06)";
        navbar.style.background = "rgba(10, 10, 15, 0.8)";
    }
});

// Animate elements on scroll (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and steps
document.querySelectorAll(".feature-card, .pricing-card, .step-item").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
});

// Terminal typing animation
const terminalLines = document.querySelectorAll(".terminal-line");
terminalLines.forEach((line, index) => {
    line.style.opacity = "0";
    line.style.transform = "translateX(-10px)";
    line.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    setTimeout(() => {
        line.style.opacity = "1";
        line.style.transform = "translateX(0)";
    }, 800 + index * 200);
});

// ─── Analyze Code (Try It Live) ──────────────────
async function analyzeCode() {
    const oldCode = document.getElementById("oldCode").value;
    const newCode = document.getElementById("newCode").value;
    const btn = document.getElementById("analyzeBtn");
    const results = document.getElementById("results");

    if (!oldCode.trim() || !newCode.trim()) {
        alert("Please paste code in both editors!");
        return;
    }

    // Loading state
    btn.classList.add("btn-loading");
    btn.innerHTML = "⏳ Analyzing...";

    try {
        const response = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ oldCode, newCode }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Analysis failed");
        }

        // Show results
        results.style.display = "block";
        results.scrollIntoView({ behavior: "smooth", block: "start" });

        // Stats bar
        document.getElementById("statsBar").innerHTML = `
      <div class="stat-chip functions">🌳 Old: ${data.stats.oldFunctions} functions</div>
      <div class="stat-chip functions">🌳 New: ${data.stats.newFunctions} functions</div>
      <div class="stat-chip added">✅ ${data.stats.added} Added</div>
      <div class="stat-chip removed">❌ ${data.stats.removed} Removed</div>
      <div class="stat-chip modified">✏️ ${data.stats.modified} Modified</div>
    `;

        // Changes output
        let changesHtml = "";

        if (data.changes.added.length > 0) {
            data.changes.added.forEach((fn) => {
                const params = fn.params ? fn.params.join(", ") : "";
                changesHtml += `<div class="change-line added">+ Added: ${fn.name}(${params})</div>`;
            });
        }

        if (data.changes.removed.length > 0) {
            data.changes.removed.forEach((fn) => {
                const params = fn.params ? fn.params.join(", ") : "";
                changesHtml += `<div class="change-line removed">- Removed: ${fn.name}(${params})</div>`;
            });
        }

        if (data.changes.modified.length > 0) {
            data.changes.modified.forEach((mod) => {
                const oldParams = mod.oldParams ? mod.oldParams.join(", ") : "";
                const newParams = mod.newParams ? mod.newParams.join(", ") : "";
                changesHtml += `<div class="change-line modified">~ Modified: ${mod.name}(${oldParams}) → ${mod.name}(${newParams})</div>`;
            });
        }

        if (!changesHtml) {
            changesHtml = '<div class="change-line" style="color: var(--text-muted);">No changes detected.</div>';
        }

        document.getElementById("changesOutput").innerHTML = changesHtml;

        // Docs output
        document.getElementById("docsOutput").innerHTML = `
      <h4>🤖 AI-Generated Documentation</h4>
      <div class="docs-content">${escapeHtml(data.docs)}</div>
    `;

    } catch (error) {
        alert("Error: " + error.message + "\n\nMake sure the server is running: node server.js");
    } finally {
        btn.classList.remove("btn-loading");
        btn.innerHTML = "🔍 Analyze Changes";
    }
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
