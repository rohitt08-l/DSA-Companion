console.log("🚀 DSA Companion Loaded");

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

const currentUrl = window.location.href;

if (currentUrl.includes("/challenges/")) {

    console.log("✅ HackerRank Challenge Detected");

    const problem = getProblemData();

    console.log("Problem Details:");
    console.log(problem);
}