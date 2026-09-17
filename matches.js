let reports = [];

let currentReport = null;

let matchResults = [];


/* =========================
   LOAD REPORTS
========================= */

function loadReports() {

    reports =
        JSON.parse(
            localStorage.getItem("lostlinkReports")
        ) || [];


    if (reports.length === 0) {

        showEmptyState();

        return;

    }


    /*
       The newest report is treated
       as the current user's report.
    */

    currentReport =
        reports[reports.length - 1];


    displayCurrentReport();


    findMatches();

}


/* =========================
   CURRENT REPORT
========================= */

function displayCurrentReport() {

    const currentItem =
        document.getElementById("currentItem");

    const currentDetails =
        document.getElementById("currentDetails");


    currentItem.textContent =
        currentReport.type +
        " — " +
        currentReport.category;


    currentDetails.textContent =
        currentReport.color +
        " • " +
        currentReport.location +
        " • " +
        currentReport.date;

}


/* =========================
   FIND MATCHES
========================= */

function findMatches() {

    matchResults = [];


    reports.forEach(function(report) {


        /* Don't compare item with itself */

        if (report.id === currentReport.id) {
            return;
        }


        /*
            Only compare opposite types.

            Lost ↔ Found

            Lost ↔ Lost doesn't make sense.
        */

        if (report.type === currentReport.type) {
            return;
        }


        const result =
            calculateMatch(
                currentReport,
                report
            );


        /*
           Only show reasonably strong
           matches.
        */

        if (result.score >= 35) {

            matchResults.push(result);

        }

    });


    matchResults.sort(
        (a, b) =>
            b.score - a.score
    );


    displayMatches();

}


/* =========================
   MATCH CALCULATION
========================= */

function calculateMatch(itemA, itemB) {

    let score = 0;

    let reasons = [];


    /* Category */

    if (
        itemA.category ===
        itemB.category
    ) {

        score += 25;

        reasons.push(
            "Same category"
        );

    }


    /* Location */

    if (
        itemA.location ===
        itemB.location
    ) {

        score += 25;

        reasons.push(
            "Same location"
        );

    }


    /* Color */

    if (
        itemA.color ===
        itemB.color
    ) {

        score += 15;

        reasons.push(
            "Same color"
        );

    }


    /* Date */

    const dateA =
        new Date(itemA.date);

    const dateB =
        new Date(itemB.date);


    const difference =
        Math.abs(
            dateA - dateB
        );


    const days =
        difference /
        (1000 * 60 * 60 * 24);


    if (days <= 1) {

        score += 15;

        reasons.push(
            "Within 1 day"
        );

    }

    else if (days <= 3) {

        score += 10;

        reasons.push(
            "Within 3 days"
        );

    }

    else if (days <= 7) {

        score += 5;

        reasons.push(
            "Within 1 week"
        );

    }


    /* Description */

    const wordsA =
        getWords(
            itemA.description
        );

    const wordsB =
        getWords(
            itemB.description
        );


    const commonWords =
        wordsA.filter(
            word =>
                wordsB.includes(word)
        );


    if (commonWords.length >= 3) {

        score += 20;

        reasons.push(
            "Similar description"
        );

    }

    else if (commonWords.length >= 1) {

        score += 10;

        reasons.push(
            "Some description similarity"
        );

    }


    return {

        report: itemB,

        score: score,

        reasons: reasons

    };

}


/* =========================
   WORD PROCESSING
========================= */

function getWords(text) {

    const ignoredWords = [

        "the",
        "and",
        "with",
        "a",
        "an",
        "is",
        "has",
        "my",
        "this",
        "item",
        "small",
        "large"

    ];


    return text
        .toLowerCase()
        .replace(
            /[^a-z0-9\s]/g,
            ""
        )
        .split(/\s+/)
        .filter(
            word =>
                word.length > 2 &&
                !ignoredWords.includes(word)
        );

}


/* =========================
   DISPLAY MATCHES
========================= */

function displayMatches() {

    const grid =
        document.getElementById(
            "resultsGrid"
        );

    const count =
        document.getElementById(
            "matchCount"
        );

    const empty =
        document.getElementById(
            "emptyState"
        );


    grid.innerHTML = "";


    count.textContent =
        matchResults.length;


    if (matchResults.length === 0) {

        empty.style.display =
            "block";

        return;

    }


    empty.style.display =
        "none";


    matchResults.forEach(
        function(match) {

            const card =
                createMatchCard(match);


            grid.appendChild(card);

        }
    );

}


/* =========================
   CREATE CARD
========================= */

function createMatchCard(match) {

    const report =
        match.report;


    const card =
        document.createElement("article");

    card.className =
        "match-card";


    card.innerHTML = `

        <div class="item-image">

            ${getEmoji(report.category)}

            <div class="match-badge">
                ${match.score}% match
            </div>

        </div>


        <div class="match-content">

            <h3>
                ${report.category}
            </h3>


            <div class="item-info">

                <span>
                    📍 ${report.location}
                </span>

                <span>
                    🎨 ${report.color}
                </span>

                <span>
                    📅 ${report.date}
                </span>

            </div>


            <div class="reasons">

                ${match.reasons
                    .slice(0, 3)
                    .map(
                        reason =>
                            `<span class="reason">
                                ✓ ${reason}
                            </span>`
                    )
                    .join("")
                }

            </div>


            <button
                class="view-match"
                onclick="viewMatch(${report.id})"
            >
                View Match →
            </button>

        </div>

    `;


    return card;

}


/* =========================
   EMOJI
========================= */

function getEmoji(category) {

    const icons = {

        "Phone": "📱",

        "Laptop": "💻",

        "Wallet": "👛",

        "Backpack": "🎒",

        "Keys": "🔑",

        "ID Card": "🪪",

        "Earphones": "🎧",

        "Watch": "⌚",

        "Books": "📚",

        "Other": "📦"

    };


    return icons[category] || "📦";

}


/* =========================
   VIEW MATCH
========================= */

function viewMatch(id) {

    const match =
        matchResults.find(item => item.report.id === id);

    if (!match) return;


    // Save the exact selected match
    localStorage.setItem(
        "lostlinkSelectedMatch",
        match.report.id
    );


    document.getElementById("modalTitle").textContent =
        match.report.category;

    document.getElementById("modalScore").textContent =
        match.score + "%";


    const reasons =
        document.getElementById("matchReasons");


    reasons.innerHTML =
        match.reasons
            .map(reason =>
                `<div class="modal-reason">✓ ${reason}</div>`
            )
            .join("");


    document.getElementById("matchModal")
        .classList.add("show");
}


/* =========================
   CLOSE MODAL
========================= */

function closeModal() {

    document
        .getElementById("matchModal")
        .classList.remove("show");

}


/* =========================
   VERIFICATION
========================= */

function startVerification() {

    const selectedMatchId =
        localStorage.getItem("lostlinkSelectedMatch");

    if (!selectedMatchId) {
        alert("Please select a match first.");
        return;
    }

    const selectedMatch =
        matchResults.find(
            match =>
                String(match.report.id) ===
                String(selectedMatchId)
        );

    if (!selectedMatch) {
        alert("This match is no longer available.");
        return;
    }

    window.location.href = "verification.html";
}

/* =========================
   EMPTY
========================= */

function showEmptyState() {

    document
        .getElementById("emptyState")
        .style.display = "block";

}


/* =========================
   SORTING
========================= */

document
    .getElementById("sortMatches")
    .addEventListener(
        "change",
        function() {

            if (
                this.value === "score"
            ) {

                matchResults.sort(
                    (a, b) =>
                        b.score - a.score
                );

            }

            else {

                matchResults.sort(
                    (a, b) =>
                        new Date(
                            b.report.date
                        ) -
                        new Date(
                            a.report.date
                        )
                );

            }


            displayMatches();

        }
    );


/* Start */

loadReports();