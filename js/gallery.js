/* ================================================================
INTERACTIVE PHOTO SLIDESHOW
Tambahkan foto baru di dalam array photos.
================================================================= */

const photos = [
{
src: "photos/photo1.jpeg",
caption: "Thank you for being a part of my life... every day with you feels like a gift."
},
{
src: "photos/photo2.jpeg",
caption: "I hope that on this special day, you are surrounded by happiness and love."
},
{
src: "photos/photo3.jpeg",
caption: "Every laugh, every hug, every little moment with you means the world to me."
},
{
src: "photos/photo4.jpeg",
caption: "Here's to many more birthdays, adventures, and memories together."
},
{
src: "photos/photo5.jpeg",
caption: "A beautiful memory that I will always cherish."
},
{
src: "photos/photo6.jpeg",
caption: "Every moment with you is a special memory."
},
];

const photoEl = document.getElementById("currentPhoto");
const captionEl = document.getElementById("currentCaption");
const counterEl = document.getElementById("counter");
const polaroidEl = document.getElementById("polaroid");
const dotsWrap = document.getElementById("dots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const photoStage = document.getElementById("photoStage");

let currentIndex = 0;
let isAnimating = false;

const tilts = ["-3deg", "2deg", "-1.5deg", "3deg"];

/* Membuat tombol titik sesuai jumlah foto */
dotsWrap.innerHTML = photos.map((photo, index) => `
<button
class="dot ${index === 0 ? "active" : ""}"
data-index="${index}"
aria-label="photo ${index + 1}"

«</button>»

`).join("");

function renderSlide(newIndex) {
if (isAnimating || newIndex === currentIndex) return;

if (newIndex < 0 || newIndex >= photos.length) return;

isAnimating = true;

photoEl.classList.add("is-transitioning");
captionEl.classList.add("is-transitioning");

setTimeout(() => {
currentIndex = newIndex;

const data = photos[currentIndex];

photoEl.src = data.src;
photoEl.alt = "memory " + (currentIndex + 1);
captionEl.textContent = data.caption;

counterEl.textContent =
  `photo ${currentIndex + 1} of ${photos.length}`;

polaroidEl.style.setProperty(
  "--tilt",
  tilts[currentIndex % tilts.length]
);

dotsWrap.querySelectorAll(".dot").forEach((dot, index) => {
  dot.classList.toggle("active", index === currentIndex);
});

requestAnimationFrame(() => {
  photoEl.classList.remove("is-transitioning");
  captionEl.classList.remove("is-transitioning");
  isAnimating = false;
});

}, 400);
}

function goNext() {
renderSlide((currentIndex + 1) % photos.length);
}

function goPrev() {
renderSlide((currentIndex - 1 + photos.length) % photos.length);
}

nextBtn.addEventListener("click", goNext);
prevBtn.addEventListener("click", goPrev);

dotsWrap.querySelectorAll(".dot").forEach((dot) => {
dot.addEventListener("click", () => {
renderSlide(Number(dot.dataset.index));
});
});

document.addEventListener("keydown", (event) => {
if (event.key === "ArrowRight") goNext();
if (event.key === "ArrowLeft") goPrev();
});

/* Navigasi dengan geseran layar */
let touchStartX = 0;

photoStage.addEventListener("touchstart", (event) => {
touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

photoStage.addEventListener("touchend", (event) => {
const touchEndX = event.changedTouches[0].screenX;
const delta = touchEndX - touchStartX;

if (Math.abs(delta) > 40) {
if (delta < 0) goNext();
else goPrev();
}
}, { passive: true });

/* Efek hati saat foto diklik */
polaroidEl.addEventListener("click", (event) => {
const rect = polaroidEl.getBoundingClientRect();

const heart = document.createElement("span");
heart.className = "mini-heart";
heart.textContent = ["💖", "💕", "✨", "🩷"][
Math.floor(Math.random() * 4)
];

heart.style.left = (event.clientX - rect.left) + "px";
heart.style.top = (event.clientY - rect.top) + "px";

polaroidEl.appendChild(heart);

setTimeout(() => heart.remove(), 1000);
});

/* Inisialisasi tampilan */
photoEl.src = photos[0].src;
photoEl.alt = "memory 1";
captionEl.textContent = photos[0].caption;
counterEl.textContent = "photo 1 of ${photos.length}";

polaroidEl.style.setProperty("--tilt", tilts[0]);