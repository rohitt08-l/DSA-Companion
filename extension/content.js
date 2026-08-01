console.log("🚀 DSA Companion Loaded");

/**
 * Extract problem details from HackerRank page
 */
function getProblemData() {
    const titleElement = document.querySelector("h1");

    const title = titleElement
        ? titleElement.innerText.trim()
        : "Unknown Problem";

    const url = window.location.href;

    return {
        title,
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
                    }
                );

            } else {

                console.log("⚠️ Problem Already Saved");
            }
        }
    );
}

/**
 * Initialize tracker
 */
function init() {

    const currentUrl = window.location.href;

    console.log("Current URL:", currentUrl);

    if (currentUrl.includes("/challenges/")) {

        console.log("✅ HackerRank Challenge Detected");

        const problem = getProblemData();

        console.log("Problem Details:");
        console.log(problem);

        saveProblem(problem);
    }
}

init();