document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["problems"], data => {
        const problems = data.problems || [];
        renderDashboard(problems);
    });
});

/**
 * Render all dashboard sections.
 */
function renderDashboard(problems) {
    // Problem count
    document.getElementById("count").innerText = problems.length;

    // Latest problem
    const latestDiv = document.getElementById("latest");
    if (problems.length > 0) {
        const latest = problems[problems.length - 1];
        latestDiv.innerHTML = `
            <strong>Latest</strong><br>
            ${latest.title}<br>
            <small>${latest.track} > ${latest.subTrack}</small><br>
            <small>Language: ${latest.language || "Unknown"}</small>
        `;
    } else {
        latestDiv.innerHTML = `<strong>No problems tracked yet</strong>`;
    }

    // Calculate streak metrics
    const { current, longest, active } = computeStreakMetrics(problems);
    document.getElementById("currentStreak").innerText = `🔥 Current Streak: ${current} days`;
    document.getElementById("longestStreak").innerText = `🏆 Longest Streak: ${longest} days`;
    document.getElementById("activeDays").innerText = `📅 Active Days: ${active}`;

    // Track breakdown analytics
    const trackStats = {};
    problems.forEach(p => {
        const track = p.track || "Unknown";
        trackStats[track] = (trackStats[track] || 0) + 1;
    });
    let analyticsHtml = `<strong>Track Breakdown</strong><br><br>`;
    Object.entries(trackStats)
        .sort((a, b) => b[1] - a[1])
        .forEach(([track, count]) => {
            analyticsHtml += `${track}: ${count}<br>`;
        });
    document.getElementById("analytics").innerHTML = analyticsHtml;

    // Recent problems
    const recent = [...problems].reverse().slice(0, 5);
    let recentHtml = `<strong>Recent Problems</strong><br><br>`;
    recent.forEach(p => {
        recentHtml += `✓ ${p.title} (${p.language || "Unknown"})<br>`;
    });
    document.getElementById("recentProblems").innerHTML = recentHtml;
}

/**
 * Compute streak metrics based on unique solve dates.
 */
function computeStreakMetrics(problems) {
    const daySet = new Set();
    const dateStrs = [];
    const msPerDay = 24 * 60 * 60 * 1000;

    problems.forEach(p => {
        const d = new Date(p.savedAt);
        if (isNaN(d.getTime())) return; // ignore malformed
        const local = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        if (!daySet.has(local)) {
            daySet.add(local);
            dateStrs.push(local);
        }
    });

    if (dateStrs.length === 0) return { current: 0, longest: 0, active: 0 };

    dateStrs.sort(); // ascending

    // compute longest streak and track current seg length
    let longest = 0;
    let currentSeg = 0;
    let prev = null;
    dateStrs.forEach(ds => {
        const d = new Date(ds);
        if (prev) {
            const diff = Math.round((d - prev) / msPerDay);
            if (diff === 1) {
                currentSeg += 1;
            } else {
                longest = Math.max(longest, currentSeg);
                currentSeg = 1;
            }
        } else {
            currentSeg = 1;
        }
        prev = d;
    });
    longest = Math.max(longest, currentSeg);

    // Current streak: only if most recent solve is today or yesterday
    const lastDate = new Date(dateStrs[dateStrs.length - 1]);
    const today = new Date();
    const yesterday = new Date(today.getTime() - msPerDay);
    const format = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const todayStr = format(today);
    const yesterdayStr = format(yesterday);
    const lastDayStr = format(lastDate);
    const current = (lastDayStr === todayStr || lastDayStr === yesterdayStr) ? currentSeg : 0;

    return { current, longest, active: dateStrs.length };
}
