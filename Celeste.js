/* =========================================================
   CONTADOR DE TEMPO
========================================================= */

function plural(v, s, p) {
    return v + " " + (v === 1 ? s : p);
}

function atualizarTempo() {
    const inicio = new Date("2025-10-27T11:55:00");
    const agora = new Date();

    let ano = inicio.getFullYear();
    let mes = inicio.getMonth();
    let dia = inicio.getDate();

    // Anos
    let anos = agora.getFullYear() - ano;
    if (
        agora.getMonth() < mes ||
        (agora.getMonth() === mes && agora.getDate() < dia)
    ) {
        anos--;
    }

    // Data auxiliar
    let aux = new Date(inicio);
    aux.setFullYear(aux.getFullYear() + anos);

    // Meses
    let meses = agora.getMonth() - aux.getMonth();
    if (agora.getDate() < aux.getDate()) meses--;
    if (meses < 0) meses += 12;

    aux.setMonth(aux.getMonth() + meses);

    // Dias
    let msPorDia = 24 * 60 * 60 * 1000;
    let dias = Math.floor((agora - aux) / msPorDia);

    // Horas, minutos e segundos
    let diff = agora - aux - dias * msPorDia;

    let horas = Math.floor(diff / (1000 * 60 * 60));
    diff -= horas * 1000 * 60 * 60;

    let minutos = Math.floor(diff / (1000 * 60));
    diff -= minutos * 1000 * 60;

    let segundos = Math.floor(diff / 1000);

    const textoFinal =
        `${plural(anos, "ano", "anos")}, ` +
        `${plural(meses, "mês", "meses")}, ` +
        `${plural(dias, "dia", "dias")}, ` +
        `${plural(horas, "hora", "horas")}, ` +
        `${plural(minutos, "minuto", "minutos")} e ` +
        `${plural(segundos, "segundo", "segundos")}`;

    document.getElementById("timer").textContent = textoFinal;
}

setInterval(atualizarTempo, 1000);
atualizarTempo();


/* =========================================================
   PLAYER DE ÁUDIO
========================================================= */

const audio = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playBtn");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progressContainer");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const iconPlay = `
<svg width="26" height="26" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 5v14l11-7z"/>
</svg>
`;

const iconPause = `
<svg width="26" height="26" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
  <rect x="6" y="4" width="4" height="16" rx="1"/>
  <rect x="14" y="4" width="4" height="16" rx="1"/>
</svg>
`;

/* AUTOPLAY AO ABRIR */
window.addEventListener("load", () => {
    audio.muted = false;
    audio.autoplay = true;

    audio.play()
        .then(() => {
            playBtn.innerHTML = iconPause;
        })
        .catch(() => {
            console.warn("Autoplay bloqueado pelo navegador.");
        });
});

playBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = iconPause;
    } else {
        audio.pause();
        playBtn.innerHTML = iconPlay;
    }
});

audio.addEventListener("timeupdate", () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = percent + "%";

    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
});

progressContainer.addEventListener("click", (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
});

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
}



/* =========================================================
   CARROSSEL DE IMAGENS
========================================================= */

const carouselImages = [
    "Conteudos/Foto 1.JPEG",
    "Conteudos/Foto 2.JPEG",
    "Conteudos/Foto 3.JPEG",
    "Conteudos/Foto 4.JPEG",
    "Conteudos/Foto 5.JPEG",
    "Conteudos/Foto 6.JPEG",
    "Conteudos/Foto 7.JPEG",
    "Conteudos/Foto 8.JPEG",
    "Conteudos/Foto 9.JPEG",
    "Conteudos/Foto 10.JPEG"
];

const leftImgEl = document.getElementById("left-img");
const centerImgEl = document.getElementById("center-img");
const rightImgEl = document.getElementById("right-img");
const dotsContainerEl = document.getElementById("carouselDots");

let idx = 0;
let autoplayTimer = null;
const AUTOPLAY_MS = 4000;

dotsContainerEl.innerHTML = "";

const dots = carouselImages.map((_, i) => {
    const s = document.createElement("span");
    s.className = "dot";
    s.addEventListener("click", () => {
        stopAndRestartAutoplay();
        goTo(i);
    });
    dotsContainerEl.appendChild(s);
    return s;
});

function renderCarousel(direction = "right") {
    const total = carouselImages.length;
    const leftIndex = (idx - 1 + total) % total;
    const rightIndex = (idx + 1) % total;

    centerImgEl.classList.remove("slide-in-right", "slide-in-left");
    leftImgEl.classList.remove("slide-in-right", "slide-in-left");
    rightImgEl.classList.remove("slide-in-right", "slide-in-left");

    leftImgEl.src = carouselImages[leftIndex];
    centerImgEl.src = carouselImages[idx];
    rightImgEl.src = carouselImages[rightIndex];

    void centerImgEl.offsetWidth;

    centerImgEl.classList.add(
        direction === "right" ? "slide-in-right" : "slide-in-left"
    );

    dots.forEach((d, i) => d.classList.toggle("active", i === idx));
}

function next() {
    idx = (idx + 1) % carouselImages.length;
    renderCarousel("right");
}

function prev() {
    idx = (idx - 1 + carouselImages.length) % carouselImages.length;
    renderCarousel("left");
}

function goTo(i) {
    const direction = i > idx ? "right" : (i < idx ? "left" : "right");
    idx = ((i % carouselImages.length) + carouselImages.length) % carouselImages.length;
    renderCarousel(direction);
}

function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(next, AUTOPLAY_MS);
}

function stopAutoplay() {
    if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
    }
}

function stopAndRestartAutoplay() {
    stopAutoplay();
    startAutoplay();
}

renderCarousel();
startAutoplay();

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        stopAndRestartAutoplay();
        next();
    }
    if (e.key === "ArrowLeft") {
        stopAndRestartAutoplay();
        prev();
    }
});

/* =========================================================
   SUPORTE A SWIPE NO CELULAR
========================================================= */

let touchStartX = 0;
let touchEndX = 0;
const swipeZone = document.querySelector(".carousel-images");

swipeZone.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

swipeZone.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeDist = touchEndX - touchStartX;

    if (Math.abs(swipeDist) < 50) return;

    stopAndRestartAutoplay();

    if (swipeDist < 0) {
        next();
    } else {
        prev();
    }
}