document.addEventListener("DOMContentLoaded", () => {

    chrome.storage.local.get(
        ["problems"],
        (data) => {

            const problems = data.problems || [];

            document.getElementById("count").innerText =
                problems.length;

            // Latest Problem
            const latestDiv =
                document.getElementById("latest");

            if (problems.length > 0) {

                const latest =
                    problems[problems.length - 1];

                latestDiv.innerHTML = `
                    <strong>Latest</strong><br>
                    ${latest.title}<br>
                    <small>
                        ${latest.track} > ${latest.subTrack}
                    </small>
                `;
            } else {
                latestDiv.innerHTML = `
                    <strong>No problems tracked yet</strong>
                `;
            }

            // Analytics
            const trackStats = {};

            problems.forEach(problem => {

                const track =
                    problem.track || "Unknown";

                trackStats[track] =
                    (trackStats[track] || 0) + 1;
            });

            let analyticsHtml =
                "<strong>Track Breakdown</strong><br><br>";

            Object.entries(trackStats)
                .sort((a, b) => b[1] - a[1])
                .forEach(([track, count]) => {

                    analyticsHtml += `
                        ${track}: ${count}<br>
                    `;
                });

            document.getElementById(
                "analytics"
            ).innerHTML = analyticsHtml;

            // Recent Problems
            const recentProblems =
                [...problems]
                    .reverse()
                    .slice(0, 5);

            let recentHtml =
                "<strong>Recent Problems</strong><br><br>";

            recentProblems.forEach(problem => {

                recentHtml += `
                    ✓ ${problem.title}<br>
                `;
            });

            document.getElementById(
                "recentProblems"
            ).innerHTML = recentHtml;
        }
    );

});