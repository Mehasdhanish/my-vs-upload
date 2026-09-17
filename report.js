let reportType = "Lost";


/* =========================
   LOST / FOUND SELECTION
========================= */

function selectType(type) {

    reportType = type;

    const lostBtn =
        document.getElementById("lostBtn");

    const foundBtn =
        document.getElementById("foundBtn");


    if (type === "Lost") {

        lostBtn.classList.add("active");

        foundBtn.classList.remove("active");

    } else {

        foundBtn.classList.add("active");

        lostBtn.classList.remove("active");

    }

}


/* =========================
   FORM SUBMIT
========================= */

document
    .getElementById("reportForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const category =
            document.getElementById("category").value;

        const color =
            document.getElementById("color").value;

        const location =
            document.getElementById("location").value;

        const date =
            document.getElementById("date").value;

        const description =
            document.getElementById("description").value;

        const verification =
            document.getElementById("verification").value;


        /* Create report */

        const report = {

            id: Date.now(),

            type: reportType,

            category: category,

            color: color,

            location: location,

            date: date,

            description: description,

            verification: verification,

            createdAt: new Date().toISOString()

        };


        /* Get existing reports */

        let reports =
            JSON.parse(
                localStorage.getItem("lostlinkReports")
            ) || [];


        /* Add new report */

        reports.push(report);


        /* Save */

        localStorage.setItem(
            "lostlinkReports",
            JSON.stringify(reports)
        );


        /* Success */

        alert(
            "Your " +
            reportType.toLowerCase() +
            " item has been reported successfully!"
        );


        /* Go to matches */

        window.location.href =
            "matches.html";

    });