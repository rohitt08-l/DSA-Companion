// --- Updated content.js ---

console.log("🚀 DSA Companion Loaded");

/**
 * Known language strings that HackerRank provides in the language selector
 * or as Monaco mode identifiers. Used for mapping to a readable name.
 */
const LANG_MAP = {
    python: "Python 3",
    python3: "Python 3",
    js: "JavaScript",
    javascript: "JavaScript",
    typescript: "TypeScript",
    java: "Java",
    cpp: "C++",
    c: "C",
    csharp: "C#",
    go: "Go",
    rust: "Rust",
    swift: "Swift",
    php: "PHP",
    ruby: "Ruby",
    sql: "SQL",
};

/**
 * Determine the current language by inspecting HackerRank’s language selector.
 * Falls back to inspecting a visible button that reflects the selected
 * language in the editor status bar.
 */
function extractLanguageFromDropdown() {
    const select = document.querySelector('select.language-select');
    if (select && select.value) {
        const val = select.value; // e.g. "python3"
        console.debug("Detected language selector value:", val);
        return LANG_MAP[val] ?? val.charAt(0).toUpperCase() + val.slice(1) || "Unknown";
    }

    const btn = document.querySelector('.monaco-editor .monaco-editor-statusbar-item-language');
    if (btn) {
        const txt = btn.textContent.trim();
        console.debug("Detected language button text:", txt);
        return txt || "Unknown";
    }

    console.debug("extractLanguageFromDropdown: no selector matched");
    return "Unknown";
}

/**
 * Pull source code from the editor.  We first try to execute a small
 * snippet in the page’s context via a temporary <script> element.
 * The snippet attempts to read Monaco, then Ace, then plain textareas.
 * The result is exposed as the global `window.__DSACC__`.
 */
function extractSourceCode() {
    const snippet = `(
        (function() {
            const result = { code: "", language: "Unknown", status: "unavailable" };
            try {
                const monaco = window.monaco;
                if (monaco && monaco.editor && monaco.editor.getModels) {
                    const models = monaco.editor.getModels();
                    if (models.length > 0) {
                        const model = models[0];
                        result.code = model.getValue();
                        const modeId = model.getModeId();
                        result.language = modeId || "Unknown";
                        result.status = "success";
                    }
                }
            } catch (e) {
                // ignore; fall back below
            }

            if (result.status !== "success") {
                const ace = window.ace;
                if (ace) {
                    const layer = document.querySelector('.ace_text-layer');
                    if (layer) {
                        result.code = layer.innerText;
                        result.status = "success";
                    }
                }
            }

            if (result.status !== "success") {
                const textarea = document.querySelector('textarea');
                if (textarea) {
                    result.code = textarea.value || textarea.innerText;
                    result.status = "success";
                }
            }

            window.__DSACC__ = JSON.stringify(result);
        })();
    )`;

    const script = document.createElement("script");
    script.textContent = snippet;
    document.documentElement.appendChild(script);
    script.remove();

    const dataStr = window.__DSACC__;
    delete window.__DSACC__;

    if (!dataStr) {
        console.debug("extractSourceCode: no data returned");
        return { code: "", language: "Unknown", codeExtractionStatus: "unavailable" };
    }

    try {
        const data = JSON.parse(dataStr);
        const status = data.status === "success" ? "success" : "failed";
        const mappedLang = LANG_MAP[data.language] || data.language || "Unknown";
        return {
            code: data.code || "",
            language: mappedLang,
            codeExtractionStatus: status,
        };
    } catch (e) {
        console.error("extractSourceCode: JSON parse error", e);
        return { code: "", language: "Unknown", codeExtractionStatus: "failed" };
    }
}

/**
 * Extract the track and sub‑track from the breadcrumb navigation.
 */
function extractTrackInfo() {
    const crumbSelectors = [
        '.breadcrumb',
        'ul.breadcrumb',
        'nav[aria-label="breadcrumb"]',
        '.page__breadcrumb',
    ];
    let crumb = null;
    for (const sel of crumbSelectors) {
        crumb = document.querySelector(sel);
        if (crumb) break;
    }
    if (!crumb) {
        console.debug("extractTrackInfo: breadcrumb not found");
        return { track: "Unknown", subTrack: "Unknown" };
    }

    const links = crumb.querySelectorAll('a');
    const track = links[0]?.textContent.trim() || "Unknown";
    const subTrack = links[1]?.textContent.trim() || "Unknown";
    return { track, subTrack };
}

/**
 * Grab all relevant metadata for a challenge.
 */
function getProblemData() {
    const titleEl = document.querySelector("h1");
    const title = titleEl ? titleEl.innerText.trim() : "Unknown Problem";

    const url = window.location.origin + window.location.pathname;

    const { track, subTrack } = extractTrackInfo();

    const { code, language } = extractSourceCode();

    return {
        platform: "HackerRank",
        title,
        track,
        subTrack,
        language,
        code,
        url,
    };
}

/**
 * Upsert a problem into storage.
 */
function saveProblem(problem) {
    chrome.storage.local.get(["problems"], data => {
        const problems = data.problems || [];
        const idx = problems.findIndex(p => p.url === problem.url);
        if (idx >= 0) {
            // Preserve savedAt; update rest
            const existing = problems[idx];
            existing.title = problem.title;
            existing.track = problem.track;
            existing.subTrack = problem.subTrack;
            existing.language = problem.language;
            existing.code = problem.code;
            console.log(`🚀 Updated existing problem: ${existing.title}`);
        } else {
            const newEntry = {
                ...problem,
                savedAt: new Date().toISOString(),
                schemaVersion: 2,
            };
            problems.push(newEntry);
            console.log(`🚀 Added new problem: ${newEntry.title}`);
        }
        chrome.storage.local.set({ problems }, () => {
            if (chrome.runtime.lastError) {
                console.error("Failed to store problems:", chrome.runtime.lastError);
                return;
            }
            console.log("✅ Problems storage updated");
        });
    });
}

/**
 * Initialization on page load.
 */
function init() {
    const currentUrl = window.location.href;
    console.log("Current URL:", currentUrl);
    if (currentUrl.includes("/challenges/")) {
        console.log("✅ HackerRank Challenge Detected");
        const problem = getProblemData();
        console.log("Problem Details:");
        console.log(problem);
    }
}

/**
 * Observe the DOM for a successful submission banner.
 */
function startSubmissionWatcher() {
    let alreadyDetected = false;
    const observer = new MutationObserver(() => {
        if (alreadyDetected) return;
        const successHeading = document.querySelector("h6.congrats-heading");
        if (successHeading) {
            alreadyDetected = true;
            console.log("🎉 Challenge Solved!");
            const problem = getProblemData();
            console.log("==== METADATA CHECK ====");
            console.log(problem);
            saveProblem(problem);
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.log("👀 Submission Watcher Started");
}

// Execute
init();
startSubmissionWatcher();