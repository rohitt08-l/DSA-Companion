document.addEventListener("DOMContentLoaded", () => {

    chrome.storage.local.get(
        ["problems"],
        (data) => {

            const problems = data.problems || [];

            document.getElementById("count").innerText =
                problems.length;

            const latestDiv =
                document.getElementById("latest");

            if (problems.length > 0) {

                const latest =
                    problems[problems.length - 1];

                latestDiv.innerHTML = `
                    <strong>Latest</strong>
                    <br>
                    ${latest.title}
                    <br><br>
                `;
            }

            const analytics = {};

            problems.forEach(problem => {

                const track =
                    problem.track || "Unknown";

                analytics[track] =
                    (analytics[track] || 0) + 1;
            });

            let html =
                "<strong>Track Breakdown</strong><br><br>";

            Object.entries(analytics)
                .forEach(([track, count]) => {

                    html += `
                        ${track}: ${count}<br>
                    `;
                });

            document.getElementById(
                "analytics"
            ).innerHTML = html;

        }
    );
});