console.log("🚀 DSA Companion Loaded");

/**
 * Extract problem details from HackerRank page
 */
function getProblemData() {

    const titleElement = document.querySelector("h1");

    const title = titleElement
        ? titleElement.innerText.trim()
        : "Unknown Problem";

    const url =
        window.location.origin +
        window.location.pathname;

    let track = "Unknown";
    let subTrack = "Unknown";

    // Find all links and look for HackerRank learning path links
    const links = [...document.querySelectorAll("a")]
        .map(el => el.textContent.trim())
        .filter(Boolean);

    console.log("Links Found:", links);

    if (links.includes("Python")) {
        track = "Python";
    }

    if (links.includes("Introduction")) {
        subTrack = "Introduction";
    }

    return {
        platform: "HackerRank",
        title,
        track,
        subTrack,
        url
    };
}

/**
 * Save problem to Chrome local storage
 */
function saveProblem(problem) {

    chrome.storage.local.get(
        ["problems"],
        (data) => {

            const problems = data.problems || [];

            const alreadyExists = problems.some(
                (p) => p.url === problem.url
            );

            if (!alreadyExists) {

                const problemToSave = {
                    ...problem,
                    savedAt: new Date().toISOString()
                };

                problems.push(problemToSave);

                chrome.storage.local.set(
                    { problems },
                    () => {

                        console.log("✅ Problem Saved");
                        console.log(problemToSave);

                        chrome.storage.local.get(
                            ["problems"],
                            (updatedData) => {

                                console.log(
                                    "📦 Current Storage:"
                                );

                                console.log(
                                    updatedData.problems
                                );
                            }
                        );
                    }
                );

            } else {

                console.log(
                    "⚠️ Problem Already Saved"
                );
            }
        }
    );
}

/**
 * Initialize page detection
 */
function init() {

    const currentUrl = window.location.href;

    console.log(
        "Current URL:",
        currentUrl
    );

    if (currentUrl.includes("/challenges/")) {

        console.log(
            "✅ HackerRank Challenge Detected"
        );

        const problem =
            getProblemData();

        console.log(
            "Problem Details:"
        );

        console.log(problem);
    }
}

/**
 * Watch for successful submissions
 */
function startSubmissionWatcher() {

    let alreadyDetected = false;

    const observer =
        new MutationObserver(() => {

            if (alreadyDetected) {
                return;
            }

            const successHeading =
                document.querySelector(
                    "h6.congrats-heading"
                );

            if (successHeading) {

                alreadyDetected = true;

                console.log(
                    "🎉 Challenge Solved!"
                );

                const problem =
                    getProblemData();

                console.log(
                    "==== METADATA CHECK ===="
                );

                console.log(problem);

                saveProblem(problem);

                observer.disconnect();
            }
        });

    observer.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );

    console.log(
        "👀 Submission Watcher Started"
    );
}

/**
 * Run extension
 */
init();
startSubmissionWatcher();