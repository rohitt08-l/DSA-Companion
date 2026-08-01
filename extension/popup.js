document.addEventListener("DOMContentLoaded", () => {

    chrome.storage.local.get(
        ["problems"],
        (data) => {

            const problems = data.problems || [];

            document.getElementById("count").innerText =
                problems.length;

            const latestDiv =
                document.getElementById("latest");

            if (problems.length === 0) {

                latestDiv.innerHTML =
                    "No problems tracked yet.";

                return;
            }

            const latest =
                problems[problems.length - 1];

            latestDiv.innerHTML = `
                <strong>Latest Problem</strong>
                <br><br>
                ${latest.title}
            `;
        }
    );

});