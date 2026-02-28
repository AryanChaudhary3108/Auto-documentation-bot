# 🤖 DocuGen AI – Auto Documentation Bot

An automated bot that integrates with GitHub CI/CD to analyze pull request code changes using **AST (Abstract Syntax Tree)** analysis, generate documentation using **OpenAI**, and post structured summary comments on pull requests.

## 📁 Project Structure

```
docugen-ai/
├── bot.js                        # Main entry point – orchestrates the pipeline
├── package.json                  # Dependencies and scripts
├── .env.example                  # Environment variable template
├── .gitignore                    # Git ignore rules
├── samples/
│   ├── old.js                    # Sample "before" code for testing
│   └── new.js                    # Sample "after" code for testing
├── src/
│   ├── ast/
│   │   └── analyzer.js           # AST parser – extracts functions from code
│   ├── utils/
│   │   └── diff.js               # Change detector – finds added/removed/modified functions
│   ├── ai/
│   │   └── generateDocs.js       # AI doc generator – uses OpenAI to write docs
│   └── github/
│       └── comment.js            # GitHub integration – posts PR comments
└── .github/
    └── workflows/
        └── pr.yml                # GitHub Actions workflow
```

## 🚀 Quick Start

### 1. Clone and install

```bash
git clone <your-repo-url>
cd docugen-ai
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

| Variable         | Description                          | Required |
|------------------|--------------------------------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key                  | For AI docs |
| `GITHUB_TOKEN`   | GitHub Personal Access Token         | For PR comments |
| `GITHUB_REPO`    | Repository (`owner/repo` format)     | For PR comments |
| `PR_NUMBER`      | Pull request number                  | For PR comments |

### 3. Run in demo mode (no API keys needed!)

```bash
npm run local
# or
node bot.js --local
```

This will use the sample files and mock AI responses – perfect for demos!

### 4. Run with custom files

```bash
node bot.js path/to/old.js path/to/new.js
```

## 📦 Module Explanations

### `src/ast/analyzer.js` – AST Analyzer
Reads JavaScript code and uses **Babel Parser** to convert it into an Abstract Syntax Tree. Then it walks through the tree to find all function declarations, arrow functions, and function expressions. For each function, it extracts the name and parameter list. This is more reliable than text-based diffing because it understands code *structure*.

### `src/utils/diff.js` – Change Detector
Takes two lists of functions (from the old and new code) and compares them. It identifies:
- **Added functions** – exist in new code but not in old
- **Removed functions** – exist in old code but not in new
- **Modified functions** – exist in both but with different parameters

### `src/ai/generateDocs.js` – AI Doc Generator
Sends the change summary to OpenAI's GPT model and gets back a professional changelog entry and README update section. If no API key is configured, it falls back to a mock response so the demo still works.

### `src/github/comment.js` – GitHub Commenter
Posts a formatted markdown comment on the pull request using the GitHub REST API. If the required environment variables aren't set, it prints the comment to the console instead.

### `bot.js` – Main Orchestrator
Ties everything together in a 5-step pipeline:
1. Read old/new source files
2. Parse with AST analyzer
3. Detect changes
4. Generate docs via AI
5. Post PR comment

## ⚙️ GitHub Actions Setup

The included workflow (`.github/workflows/pr.yml`) automatically runs on every pull request.

### Setup steps:
1. Push this project to a GitHub repository
2. Add `OPENAI_API_KEY` as a repository secret (Settings → Secrets → Actions)
3. `GITHUB_TOKEN` is automatically provided by GitHub Actions
4. Create a pull request – the bot will run automatically!

## 🔧 Example Output

```
🤖 DocuGen AI – Auto Documentation Bot

Changes Detected:
  ✅ Added: loginUser(email, password), logoutUser()
  ❌ Removed: getUser(id)
  ✏️ Modified: greetUser(name) → greetUser(name, greeting)
  ✏️ Modified: formatDate(date) → formatDate(date, locale)

Generated Documentation:
  ## Changelog
  - Added loginUser and logoutUser for authentication
  - Removed getUser (deprecated)
  - Updated greetUser to support custom greetings
  - Updated formatDate with locale support
```

## 🚀 Ideas to Extend

| Feature | Description |
|---------|-------------|
| **Fetch PR diff from GitHub** | Use the GitHub API to get actual changed files instead of local samples |
| **Multi-file analysis** | Scan all changed `.js` files in a PR, not just one pair |
| **TypeScript support** | Add `@babel/plugin-transform-typescript` to parse `.ts` files |
| **Function body diffing** | Detect changes inside function bodies, not just signatures |
| **Dashboard** | Build a web UI to view documentation history |
| **Auto-commit docs** | Commit generated docs directly to the PR branch |
| **Slack/Discord notifications** | Send change summaries to team channels |

## 📜 License

MIT
