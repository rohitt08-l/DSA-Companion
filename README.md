# 🚀 DSA Companion

DSA Companion is a browser extension that helps developers track solved coding problems across multiple platforms.

Currently, the extension supports HackerRank and automatically tracks successfully solved challenges.

---

## ✨ Features

### Current Features ✅

- Detect HackerRank challenge pages
- Extract challenge information
- Track only successfully solved problems
- Prevent duplicate entries
- Store solved problems in browser local storage
- Popup dashboard with:
  - Total solved problems
  - Latest solved problem

### Planned Features 🚧

- Track difficulty (Easy, Medium, Hard)
- Track categories and topics
- Language detection
- GitHub auto-sync
- LeetCode support
- CodeChef support
- GeeksForGeeks support
- Streak tracking
- Analytics dashboard
- AI-powered pattern detection
- Interview readiness score

---

## 🏗️ Architecture

```text
HackerRank Challenge
        ↓
Content Script
        ↓
Submission Watcher
        ↓
Success Detection
        ↓
Local Storage
        ↓
Popup Dashboard
```

---

## 📂 Project Structure

```text
DSA-Companion
│
├── README.md
├── .gitignore
│
├── extension
│   ├── manifest.json
│   ├── content.js
│   ├── background.js
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
│
├── docs
│
└── screenshots
```

---

## 🛠️ Tech Stack

- JavaScript
- Chrome Extension API (Manifest V3)
- Browser Local Storage
- DOM Mutation Observer

Future:

- GitHub REST API
- Azure OpenAI
- React Dashboard
- FastAPI Backend

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/rohitt08-l/DSA-Companion.git
```

### Load Extension

1. Open Edge/Chrome

```text
edge://extensions
```

or

```text
chrome://extensions
```

2. Enable Developer Mode

3. Click "Load Unpacked"

4. Select:

```text
DSA-Companion/extension
```

---

## 📸 Current Workflow

```text
Open HackerRank Challenge
          ↓
Write Solution
          ↓
Submit Code
          ↓
Congratulations Appears
          ↓
Problem Saved
          ↓
Dashboard Updated
```

---

## 🗺️ Roadmap

### Phase 1 ✅

- [x] Extension Setup
- [x] HackerRank Detection
- [x] Problem Extraction
- [x] Local Storage
- [x] Popup Dashboard

### Phase 2 ✅

- [x] Detect Successful Submission
- [x] Save Only Solved Problems
- [x] Duplicate Prevention

### Phase 3 🚧

- [ ] Track Difficulty
- [ ] Track Categories
- [ ] Track Language

### Phase 4 🚧

- [ ] GitHub Integration
- [ ] Auto Commit Solutions

### Phase 5 🚀

- [ ] LeetCode Support
- [ ] CodeChef Support
- [ ] GFG Support
- [ ] AI Insights
- [ ] Interview Analytics

---

## 👨‍💻 Author

**Rohit Patil**

Associate AI / ML Engineer

Building tools that improve learning, productivity, and developer workflows.

---

⭐ If you like the project, consider starring the repository.
