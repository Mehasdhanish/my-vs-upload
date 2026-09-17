let cameraStream = null;

const camera = document.getElementById("camera");
const canvas = document.getElementById("canvas");

const cameraButton = document.getElementById("cameraButton");
const captureButton = document.getElementById("captureButton");

const imageUpload = document.getElementById("imageUpload");

const cameraPlaceholder =
    document.getElementById("cameraPlaceholder");

const scanStatus =
    document.getElementById("scanStatus");

const previewSection =
    document.getElementById("previewSection");

const previewImage =
    document.getElementById("previewImage");


/* =========================
   START CAMERA
========================= */

async function startCamera() {

    try {

        if (!navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia) {

            scanStatus.textContent =
                "Camera access is not supported here. Try uploading an image.";

            return;
        }


        cameraStream =
            await navigator.mediaDevices.getUserMedia({

                video: {
                    facingMode: {
                        ideal: "environment"
                    }
                },

                audio: false

            });


        camera.srcObject = cameraStream;

        camera.style.display = "block";

        cameraPlaceholder.style.display = "none";

        captureButton.disabled = false;

        cameraButton.textContent = "✓ Camera Active";

        scanStatus.textContent =
            "Position your item inside the frame.";

    }

    catch (error) {

        console.error(error);

        scanStatus.textContent =
            "Camera permission was denied or no camera was found. Try uploading an image.";

    }

}


/* =========================
   CAPTURE PHOTO
========================= */

function capturePhoto() {

    if (!cameraStream) {
        return;
    }


    const width = camera.videoWidth;

    const height = camera.videoHeight;


    canvas.width = width;
    canvas.height = height;


    const context = canvas.getContext("2d");


    context.drawImage(
        camera,
        0,
        0,
        width,
        height
    );


    const imageData =
        canvas.toDataURL("image/jpeg");


    showPreview(imageData);


    stopCamera();

}


/* =========================
   UPLOAD IMAGE
========================= */

imageUpload.addEventListener(
    "change",
    function(event) {

        const file =
            event.target.files[0];


        if (!file) {
            return;
        }


        if (!file.type.startsWith("image/")) {

            scanStatus.textContent =
                "Please choose an image file.";

            return;
        }


        const reader =
            new FileReader();


        reader.onload = function(e) {

            showPreview(e.target.result);

        };


        reader.readAsDataURL(file);

    }
);


/* =========================
   SHOW PREVIEW
========================= */

function showPreview(imageData) {

    previewImage.src = imageData;

    previewSection.style.display = "block";

    previewSection.scrollIntoView({
        behavior: "smooth"
    });

    scanStatus.textContent =
        "Image captured successfully.";

}


/* =========================
   STOP CAMERA
========================= */

function stopCamera() {

    if (!cameraStream) {
        return;
    }


    cameraStream
        .getTracks()
        .forEach(track => track.stop());


    cameraStream = null;

    camera.srcObject = null;

}


/* =========================
   RESET
========================= */

function resetScan() {

    stopCamera();

    previewSection.style.display = "none";

    camera.style.display = "none";

    cameraPlaceholder.style.display = "block";

    captureButton.disabled = true;

    cameraButton.textContent =
        "📷 Start Camera";

    scanStatus.textContent =
        "Choose camera or upload an image to continue.";

    imageUpload.value = "";

}


/* =========================
   CONTINUE
========================= */

function continueToReport() {

    window.location.href = "report.html";

}