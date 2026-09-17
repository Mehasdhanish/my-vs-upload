let selectedRecoveryMethod =
    "Campus Help Desk";

let reports = [];
let currentReport = null;
let matchedReport = null;


/* =========================================
   LOAD RECOVERY DATA
   ========================================= */

function loadRecoveryData() {

    reports =
        JSON.parse(
            localStorage.getItem(
                "lostlinkReports"
            )
        ) || [];


    if (reports.length < 2) {
        showNoRecoveryData();
        return;
    }


    /*
        Current user's report
    */

    currentReport =
        reports[reports.length - 1];


    /*
        Get the exact match selected
        on the matches page.
    */

    const selectedMatchId =
        localStorage.getItem(
            "lostlinkSelectedMatch"
        );


    if (!selectedMatchId) {
        showNoRecoveryData();
        return;
    }


    matchedReport =
        reports.find(
            report =>
                String(report.id) ===
                String(selectedMatchId)
        );


    if (!matchedReport) {
        showNoRecoveryData();
        return;
    }


    /*
        Make sure the user has actually
        passed verification.
    */

    const verificationStatus =
        localStorage.getItem(
            "lostlinkVerificationStatus"
        );


    if (verificationStatus !== "Verified") {

        alert(
            "Please complete verification first."
        );

        window.location.href =
            "verification.html";

        return;
    }


    displayRecoveryData();
}


/* =========================================
   DISPLAY ITEM
   ========================================= */

function displayRecoveryData() {

    document.getElementById(
        "itemName"
    ).textContent =
        matchedReport.category;


    document.getElementById(
        "itemLocation"
    ).textContent =
        matchedReport.location;


    document.getElementById(
        "itemColor"
    ).textContent =
        matchedReport.color;


    document.getElementById(
        "itemDate"
    ).textContent =
        matchedReport.date;
}


/* =========================================
   SELECT RECOVERY METHOD
   ========================================= */

function selectRecoveryMethod(
    element,
    method
) {

    const options =
        document.querySelectorAll(
            ".option"
        );


    options.forEach(
        function(option) {

            option.classList.remove(
                "selected"
            );

        }
    );


    element.classList.add(
        "selected"
    );


    selectedRecoveryMethod =
        method;
}


/* =========================================
   COMPLETE RECOVERY
   ========================================= */

function completeRecovery() {

    if (!matchedReport) {

        alert(
            "No matched item was found."
        );

        return;
    }


    /*
        Update the selected matched report.
    */

    matchedReport.status =
        "Recovered";


    matchedReport.recoveryMethod =
        selectedRecoveryMethod;


    matchedReport.recoveredAt =
        new Date().toISOString();


    /*
        Update the reports array.
    */

    const updatedReports =
        reports.map(
            function(report) {

                if (
                    report.id ===
                    matchedReport.id
                ) {
                    return matchedReport;
                }

                return report;

            }
        );


    /*
        Save updated reports.
    */

    localStorage.setItem(
        "lostlinkReports",
        JSON.stringify(
            updatedReports
        )
    );


    /*
        Save recovery information.
    */

    localStorage.setItem(
        "lostlinkRecoveryStatus",
        "Recovered"
    );


    localStorage.setItem(
        "lostlinkRecoveryMethod",
        selectedRecoveryMethod
    );


    /*
        Hide recovery card.
    */

    const recoveryCard =
        document.querySelector(
            ".recovery-card"
        );


    recoveryCard.style.display =
        "none";


    /*
        Show completion card.
    */

    const completionCard =
        document.getElementById(
            "completionCard"
        );


    completionCard.classList.add(
        "show"
    );


    completionCard.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


/* =========================================
   NO RECOVERY DATA
   ========================================= */

function showNoRecoveryData() {

    const recoveryCard =
        document.querySelector(
            ".recovery-card"
        );


    recoveryCard.innerHTML = `

        <div style="
            text-align:center;
            padding:30px 10px;
        ">

            <div style="
                font-size:50px;
                margin-bottom:20px;
            ">
                🔎
            </div>

            <h2>
                No recovery case found
            </h2>

            <p style="
                color:#969bab;
                line-height:1.6;
                margin:15px auto 25px;
                max-width:500px;
            ">
                We couldn't find a verified match.
                Please return to the matches page
                and select a possible match first.
            </p>

            <button
                class="home-button"
                onclick="
                    window.location.href='matches.html'
                "
            >
                Back to Matches
            </button>

        </div>

    `;
}


/* =========================================
   START
   ========================================= */

loadRecoveryData();