const startBtn = document.getElementById("startBtn");
const snapBtn = document.getElementById("snapBtn");
const camera = document.getElementById("camera");
const frameOverlay = document.getElementById("frameOverlay");
const finalPhotos = document.getElementById("finalPhotos");
const countdownDisplay = document.getElementById("countdown");
const modal = document.getElementById("popupModal");
const confirmBtn = document.getElementById("confirmBtn");

const selectA = document.getElementById("selectA");
const selectB = document.getElementById("selectB");
const selectC = document.getElementById("selectC");

const frameSets = {
  A: {
    frames: [
    "https://i.ibb.co.com/1tHVMFCR/frame-A-01.png",
    "https://i.ibb.co.com/4nLrRYjD/frame-A-02.png",
    "https://i.ibb.co.com/FbG2CQdj/frame-A-03.png",
    "https://i.ibb.co.com/VWTkj8cC/frame-A-04.png",
    ],
    footer: "https://i.ibb.co.com/TB2fVdV9/frame-A-05.png"
  },
  B: {
    frames: [
    "https://i.ibb.co.com/0VZDRj9y/frame-B-01.png",
    "https://i.ibb.co.com/VcHCcCkf/frame-B-02.png",
    "https://i.ibb.co.com/4nQtc5n9/frame-B-03.png",
    "https://i.ibb.co.com/BHtfjs4f/frame-B-04.png",
    ],
    footer: "https://i.ibb.co.com/fGpvpq7V/frame-B-05.png"
  },
  C: {
    frames: [
    "https://i.ibb.co.com/wZW5kycX/frame-C-01.png",
    "https://i.ibb.co.com/m73b44W/frame-C-02.png",
    "https://i.ibb.co.com/M5xRB3Ns/frame-C-03.png",
    "https://i.ibb.co.com/wFY3Crsp/frame-C-04.png",
    ],
    footer: "https://i.ibb.co.com/VcX7pGTm/frame-C-05.png"
  },
};

let selectedFrameSet = frameSets.A; // default awal
let currentFrameIndex = 0;

let stream;
let snapCount = 0; // Untuk menghitung jumlah klik

  // Saat "Start" diklik, tampilkan popup dan set frame pertama
startBtn.addEventListener("click", () => {
    frameOverlay.src = selectedFrameSet.frames[currentFrameIndex]; // Set frame pertama
    frameOverlay.style.width = "300px";
    frameOverlay.style.height = "200px";
    frameOverlay.style.objectFit = "contain"; // Jaga proporsi gambar
    popupModal.style.display = "flex"; // Tampilkan popup
});

// Saat "Mengerti" diklik, popup hilang, kamera menyala, dan snapBtn aktif
confirmBtn.addEventListener("click", () => {
    popupModal.style.display = "none"; // Sembunyikan popup
    startCamera(); // Aktifkan kamera
    snapBtn.disabled = false; // Aktifkan tombol Snap
});

    // Fungsi untuk menyalakan kamera
    function startCamera() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                camera.srcObject = stream;
                camera.style.transform = "scaleX(-1)"; // Mirroring efek
            })
            .catch(error => {
                console.error("Error accessing camera:", error);
            });
    }

snapBtn.addEventListener("click", () => {
    startCountdown(() => {
        capturePhoto(() => {
            if (currentFrameIndex < selectedFrameSet.frames.length - 1) {
                currentFrameIndex++;
                frameOverlay.src = selectedFrameSet.frames[currentFrameIndex];
                snapBtn.disabled = false; // Ensure button is re-enabled
            } else {
                snapBtn.disabled = true;
            }
          // Disable SelectA, SelectB, SelectC buttons after photo capture or snap count >= 1
            if (photoCount >= 1) {
                disableSelectButtons();
            }
        });
    });
});

// Disable the select buttons
function disableSelectButtons() {
    selectA.disabled = true;
    selectB.disabled = true;
    selectC.disabled = true;
}

function startCountdown(callback) {
    let countdown = 3;
    countdownDisplay.textContent = countdown;
    countdownDisplay.style.display = "block"; // Munculkan countdown
    snapBtn.disabled = true;

    const interval = setInterval(() => {
        countdown--;
        countdownDisplay.textContent = countdown;

        if (countdown === 0) {
            clearInterval(interval);
            countdownDisplay.style.display = "none"; // Sembunyikan setelah hitungan selesai
            callback();
        }
    }, 1000);
}

function capturePhoto(callback) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 1500;
    canvas.height = 1000;

    const videoWidth = camera.videoWidth;
    const videoHeight = camera.videoHeight;

    const cropWidth = videoWidth;
    const cropHeight = (videoWidth / 3) * 2;

    const startX = 0;
    const startY = (videoHeight - cropHeight) / 2;

    // 1. Draw camera feed
    context.save();
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    context.drawImage(camera, startX, startY, cropWidth, cropHeight, 0, 0, 1500, 1000);
    context.restore();

    // 2. Draw frame
    const frameImg = new Image();
    frameImg.crossOrigin = "anonymous";
    frameImg.src = selectedFrameSet.frames[currentFrameIndex];

    frameImg.onload = () => {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.filter = "none";
        context.drawImage(frameImg, 0, 0, 1500, 1000);

        // ⛔️ Jangan gambar footer di canvas
        savePhoto(canvas);

        if (finalPhotos.children.length >= 4) {
            snapBtn.disabled = true;
            downloadBtn.disabled = false;
        }

        if (callback) callback();
    };

    frameImg.onerror = () => {
        console.error("Gagal load frame.");
        savePhoto(canvas);
        if (callback) callback();
    };
}


let photoCount = 0;

function savePhoto(canvas) {
    photoCount++;

    const imgElement = document.createElement("img");
    imgElement.src = canvas.toDataURL("image/png");
    imgElement.classList.add("result-image");
    imgElement.style.display = "block"; 
    imgElement.style.margin = "0px";
    imgElement.style.width = "50%";

    finalPhotos.appendChild(imgElement);

    // ⬇️ Hanya tampilkan footer saat capture ke-4
    if (photoCount === 4) {
        const footerImg = document.createElement("img");
        footerImg.src = selectedFrameSet.footer
        footerImg.classList.add("footer-image");
        footerImg.style.display = "block";
        footerImg.style.margin = "0px";
        footerImg.style.width = "50%";

        finalPhotos.appendChild(footerImg);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Code di dalam script.js
});

/// Download hasil foto
downloadBtn.addEventListener("click", () => {
    const images = document.querySelectorAll("#finalPhotos img");
    if (images.length === 0) return;

    // SET ukuran fixed
    const PHOTO_W = 1500;
    const PHOTO_H = 1000;
    const FOOTER_H = 500;

    const footerIndex = images.length - 1; // gambar terakhir = footer
    const totalHeight = (images.length - 1) * PHOTO_H + FOOTER_H;

    // siapkan canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = PHOTO_W;
    canvas.height = totalHeight;

    let y = 0;

    images.forEach((img, index) => {
        const isFooter = index === footerIndex;

        img.crossOrigin = "Anonymous";

        const draw = () => {
            let drawW = PHOTO_W;
            let drawH = isFooter ? FOOTER_H : PHOTO_H;

            // menjaga rasio agar tidak stretch
            const ratio = img.naturalWidth / img.naturalHeight;

            if (!isFooter) {
                // scale tinggi
                drawH = drawW / ratio;
                if (drawH > PHOTO_H) {
                    drawH = PHOTO_H;
                    drawW = drawH * ratio;
                }
            } else {
                // scale footer
                drawH = drawW / ratio;
                if (drawH > FOOTER_H) {
                    drawH = FOOTER_H;
                    drawW = drawH * ratio;
                }
            }

            const x = (PHOTO_W - drawW) / 2;

            ctx.drawImage(img, x, y, drawW, drawH);
            y += isFooter ? FOOTER_H : PHOTO_H;

            if (index === footerIndex) {
                const link = document.createElement("a");
                link.href = canvas.toDataURL("image/png");
                link.download = "photostrip.png";
                link.click();
            }
        };

        if (img.complete) draw();
        else img.onload = draw;
    });
});

// 0. button function
document.getElementById("a1TemplateBtn").addEventListener("click", function () {
    // Hapus semua foto dari preview
    let previewImages = document.querySelectorAll(".preview img");
    previewImages.forEach(img => img.remove());

    // Hapus semua foto dari resultContainer
    let resultContainer = document.getElementById("resultContainer");
    if (resultContainer) {
        while (resultContainer.firstChild) {
            resultContainer.removeChild(resultContainer.firstChild);
        }
    }

    // Hapus semua foto dari finalPhotos
    let finalPhotos = document.getElementById("finalPhotos");
    if (finalPhotos) {
        while (finalPhotos.firstChild) {
            finalPhotos.removeChild(finalPhotos.firstChild);
        }
    }

    // 🔁 Reset hitungan foto
    photoCount = 0;

    // Reset frame ke awal
    currentFrameIndex = 0;
    frameOverlay.src = selectedFrameSet.frames[currentFrameIndex];

    // Aktifkan kembali tombol snapBtn
    snapBtn.disabled = false;

    // Mulai ulang kamera
    startCamera();

    console.log("Semua foto dihapus dan sesi reset ke frame pertama.");
  
    // Download
  downloadBtn.disabled = true; // reset tombol download
  
      // Reset the session (including enabling the select buttons)
    resetSession();
});


document.getElementById("a2TemplateBtn").addEventListener("click", function () {
    window.open("https://padlet.com/artchivebydifs/SunooCellmateMessages"); // Link letter
});    

document.getElementById("a3TemplateBtn").addEventListener("click", function () {
    window.open("https://open.spotify.com/track/5elW2CKSoqjYoJ32AGDxf1?si=b0206d9b7c674309", "_blank"); // Link Spotify
});

document.getElementById("a4TemplateBtn").addEventListener("click", function () {
    window.location.href = "/game/game.html"; // Link Game
});

let brightness = 100;
let contrast = 100;

document.getElementById("brightness").addEventListener("input", function () {
    brightness = this.value;
    updateFilter();
});

document.getElementById("contrast").addEventListener("input", function () {
    contrast = this.value;
    updateFilter();
});

function updateFilter() {
    document.getElementById("camera").style.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
}

navigator.mediaDevices.getUserMedia({
  video: { 
    width: { ideal: 300 }, // Bisa 1280 untuk 720p
    height: { ideal: 200 }, 
    aspectRatio: 3/2,
    facingMode: "user"        // kamera depan
  }
})
.then(stream => {
  const video = document.getElementById("camera");
  video.srcObject = stream;
  console.log(stream.getVideoTracks()[0].getSettings()); // Cek apakah berhasil
})
.catch(error => {
  console.error("Error accessing webcam:", error);
});

const toggleBtn = document.getElementById("toggle-mv");
const mvGallery = document.getElementById("mv-gallery");

toggleBtn.addEventListener("click", () => {
  mvGallery.style.display = mvGallery.style.display === "none" ? "flex" : "none";
});

document.getElementById("selectA").addEventListener("click", () => {
  selectedFrameSet = frameSets.A;
  resetSession();
});

document.getElementById("selectB").addEventListener("click", () => {
  selectedFrameSet = frameSets.B;
  resetSession();
});

document.getElementById("selectC").addEventListener("click", () => {
  selectedFrameSet = frameSets.C;
  resetSession();
});

function resetSession() {
  currentFrameIndex = 0;
  photoCount = 0;
  finalPhotos.innerHTML = "";
  frameOverlay.src = selectedFrameSet.frames[currentFrameIndex];
  snapBtn.disabled = false;
  startCamera();
  downloadBtn.disabled = true; // reset tombol download
 
  // Enable SelectA, SelectB, SelectC buttons again when session is reset
    selectA.disabled = false;
    selectB.disabled = false;
    selectC.disabled = false;
}

function setButtonsEnabled(enabled) {
    snapBtn.disabled = !enabled;
    downloadBtn.disabled = !enabled;

    document.getElementById("a1TemplateBtn").disabled = !enabled;
    document.getElementById("a2TemplateBtn").disabled = !enabled;
    document.getElementById("a3TemplateBtn").disabled = !enabled;
    document.getElementById("a4TemplateBtn").disabled = !enabled;

    document.getElementById("brightness").disabled = !enabled;
    document.getElementById("contrast").disabled = !enabled;
     
  document.getElementById("selectA").disabled = !enabled;
    document.getElementById("selectB").disabled = !enabled;
    document.getElementById("selectC").disabled = !enabled;
  
}



document.addEventListener("DOMContentLoaded", function () {
    setButtonsEnabled(false); // Nonaktifkan semua tombol selain startBtn
});

confirmBtn.addEventListener("click", () => {
  popupModal.style.display = "none";
  startCamera();
  setButtonsEnabled(true); // Aktifkan semua

  // Nonaktifkan kembali downloadBtn
  const downloadBtn = document.getElementById("downloadBtn");
  if (downloadBtn) {
    downloadBtn.disabled = true;
  }
});

document.querySelectorAll('input[type="range"]').forEach(slider => {

  function updateSlider() {
    const percent =
      ((slider.value - slider.min) /
      (slider.max - slider.min)) * 100;

    slider.style.setProperty('--value', percent + '%');
  }

  updateSlider();

  slider.addEventListener('input', updateSlider);
});
