let reports = [];
let currentReport = null;
let matchedReport = null;


/* =========================================
   LOAD VERIFICATION DATA
   ========================================= */

function loadVerificationData() {

    reports =
        JSON.parse(
            localStorage.getItem("lostlinkReports")
        ) || [];


    if (reports.length < 2) {
        showNoData();
        return;
    }


    /*
        The newest report is the user's
        current report.
    */

    currentReport =
        reports[reports.length - 1];


    /*
        Get the EXACT match selected
        from the matches page.
    */

    const selectedMatchId =
        localStorage.getItem(
            "lostlinkSelectedMatch"
        );


    if (!selectedMatchId) {
        showNoData();
        return;
    }


    matchedReport =
        reports.find(
            report =>
                String(report.id) ===
                String(selectedMatchId)
        );


    if (!matchedReport) {
        showNoData();
        return;
    }


    /*
        Make sure we don't accidentally
        verify the current report against itself.
    */

    if (
        matchedReport.id ===
        currentReport.id
    ) {
        showNoData();
        return;
    }


    displayMatch();
}


/* =========================================
   DISPLAY MATCH
   ========================================= */

function displayMatch() {

    const category =
        matchedReport.category;


    document.getElementById("itemName")
        .textContent = category;


    document.getElementById("itemLocation")
        .textContent =
        "📍 " + matchedReport.location;


    document.getElementById("itemColor")
        .textContent =
        "🎨 " + matchedReport.color;


    document.getElementById("itemDate")
        .textContent =
        "📅 " + matchedReport.date;


    document.getElementById("itemSymbol")
        .textContent =
        getEmoji(category);


    document.getElementById("matchScore")
        .textContent =
        "Possible";
}


/* =========================================
   VERIFY OWNERSHIP
   ========================================= */

function verifyOwnership() {

    const input =
        document.getElementById("answer");


    const result =
        document.getElementById(
            "verificationResult"
        );


    const answer =
        input.value.trim();


    if (!answer) {

        result.className =
            "verification-result error";

        result.textContent =
            "Please enter the private detail.";

        return;
    }


    /*
        Get the private verification detail
        from the exact matched report.
    */

    const correctAnswer =
        matchedReport.verification
            .trim()
            .toLowerCase();


    const userAnswer =
        answer.toLowerCase();


    if (userAnswer === correctAnswer) {

        verificationSuccess();

    } else {

        verificationFailed();

    }
}


/* =========================================
   VERIFICATION SUCCESS
   ========================================= */

function verificationSuccess() {

    const result =
        document.getElementById(
            "verificationResult"
        );


    result.className =
        "verification-result success";


    result.innerHTML = `
        <strong>✓ Ownership detail verified.</strong>
        <br>
        The private detail matches the original report.
        You can now continue to the recovery step.
    `;


    /*
        Remember that verification succeeded.
    */

    localStorage.setItem(
        "lostlinkVerificationStatus",
        "Verified"
    );


    /*
        Change button to recovery button.
    */

    const button =
        document.querySelector(
            ".verify-button"
        );


    button.textContent =
        "Continue to Recovery →";


    button.onclick =
        goToRecovery;
}


/* =========================================
   VERIFICATION FAILED
   ========================================= */

function verificationFailed() {

    const result =
        document.getElementById(
            "verificationResult"
        );


    result.className =
        "verification-result error";


    result.innerHTML = `
        <strong>✕ Detail doesn't match.</strong>
        <br>
        Check the information and try again.
    `;


    document.getElementById(
        "answer"
    ).value = "";
}


/* =========================================
   GO TO RECOVERY
   ========================================= */

function goToRecovery() {

    /*
        Only allow recovery after verification.
    */

    const status =
        localStorage.getItem(
            "lostlinkVerificationStatus"
        );


    if (status !== "Verified") {

        alert(
            "Please verify ownership first."
        );

        return;
    }


    window.location.href =
        "recovery.html";
}


/* =========================================
   NO DATA
   ========================================= */

function showNoData() {

    document.querySelector(
        ".verification-card"
    ).innerHTML = `

        <div class="verification-icon">
            🔎
        </div>

        <h2>
            No match selected
        </h2>

        <p class="question-description">
            Please return to the matches page
            and select a possible match first.
        </p>

        <button
            class="verify-button"
            onclick="
                window.location.href='matches.html'
            "
        >
            Back to Matches
        </button>

    `;
}


/* =========================================
   EMOJI
   ========================================= */

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


/* =========================================
   START
   ========================================= */

loadVerificationData();