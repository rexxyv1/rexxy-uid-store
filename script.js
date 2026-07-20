const tableBody = document.getElementById("uidTable");
const searchInput = document.getElementById("searchInput");

const totalStock = document.getElementById("totalStock");
const readyStock = document.getElementById("readyStock");
const soldStock = document.getElementById("soldStock");

const filterSelect = document.getElementById("filterSelect");

let currentFilter = "all";

function updateCounter() {
    totalStock.textContent = uidData.length;

    const ready = uidData.filter(item => item.status === "Ready").length;
    const sold = uidData.filter(item => item.status === "Sold").length;

    readyStock.textContent = ready;
    soldStock.textContent = sold;
}

function getCountdown(endTime){

    if(!endTime) return "";

    const now = new Date().getTime();
    const end = endTime.toDate().getTime();

    let diff = end - now;

    if(diff <= 0){
    return "";
    }

    const hari = Math.floor(diff / (1000*60*60*24));
    diff %= 1000*60*60*24;

    const jam = Math.floor(diff / (1000*60*60));

    diff %= 1000*60*60;

    const menit = Math.floor(diff / (1000*60));

    return `${hari}H ${jam}J ${menit}M`;

}

function renderTable() {

    const keyword = searchInput.value.toLowerCase().trim();

    tableBody.innerHTML = "";

    const filteredData = uidData.filter(item => {

        const matchSearch =
       item.uid.toLowerCase().includes(keyword) ||
       String(item.harga).includes(keyword);

let matchFilter = false;

switch(currentFilter){

    case "all":
    matchFilter = true;
    break;
    
    case "promo":
    matchFilter =
        item.promo &&
        item.promoEnd &&
        item.promoEnd.toDate().getTime() > Date.now();
    break;

    case "Ready":
    case "Sold":
        matchFilter = item.status === currentFilter;
        break;

    case "murah":
        matchFilter = Number(item.harga) < 50000;
        break;

    case "mahal":
        matchFilter = Number(item.harga) >= 50000;
        break;

    case "cantik":

        // Pola angka cantik
        matchFilter =
            /(1234|4321|5678|8765|111222|222333|112233|223344|334455|445566|556677|667788|778899)/.test(item.uid);

        break;

    case "spam":

        // Minimal 4 angka sama berurutan
        matchFilter = /(.)\1{3,}/.test(item.uid);

        break;

}

        return matchSearch && matchFilter;

    });

    if(filteredData.length === 0){

    tableBody.innerHTML = `
    <div class="empty">
    🔍 Tidak ada UID yang cocok.
    </div>
    `;

        return;
    }

    filteredData.forEach(item => {

        const isReady = String(item.status).toLowerCase() === "ready";

        const statusText = isReady
            ? "🟢 Ready"
            : "🔴 Sold";
        
        const orderButton = isReady
            ? `
                <button
                    class="orderBtn"
                    onclick="orderUID('${item.uid}','${item.harga}')">
                    🛒 Order
                </button>
              `
            : `
                <button
                    class="orderBtn disabled"
                    disabled>
                    ❌ Sold Out
                </button>
              `;
              
        const isNew = item.createdAt &&
        (Date.now() - item.createdAt.toDate().getTime()) < 24 * 60 * 60 * 1000;

        const countdown = getCountdown(item.promoEnd);
        
        const promoAktif =
        item.promo &&
        item.promoEnd &&
        item.promoEnd.toDate().getTime() > Date.now();

        const hargaHTML = promoAktif
        ? `
        <div class="old-price">
        ${new Intl.NumberFormat("id-ID",{
            style:"currency",
            currency:"IDR",
            minimumFractionDigits:0
        }).format(item.harga)}
        </div>
        
        <div class="price promo-price">
        ${new Intl.NumberFormat("id-ID",{
            style:"currency",
            currency:"IDR",
            minimumFractionDigits:0
        }).format(item.hargaPromo)}
        </div>
        `
        : `
        <div class="price">
        ${new Intl.NumberFormat("id-ID",{
            style:"currency",
            currency:"IDR",
            minimumFractionDigits:0
        }).format(item.harga)}
        </div>
        `;

        tableBody.innerHTML += `<div class="uid-card">

        ${promoAktif ? `
        <span class="promo-badge">
        🔥 PROMO
        </span>
        ` : (isNew ? `
        <span class="new-badge">
        🆕 NEW
        </span>
        ` : "")}

        <div class="info">
            <span class="label">🆔 UID</span>
            <h3>${item.uid}</h3>
        </div>

        <div class="info">
            <span class="label">💰 Harga</span>
        
            ${hargaHTML}
        
            ${promoAktif ? `
            <div class="promo-countdown">
                ⏰ Berakhir ${countdown}
            </div>
            ` : ""}
        
        </div>

    <div class="info">
        <span class="label">🔑 Login</span>
        <h4 class="login-type">${item.login}</h4>
    </div>

    <div class="info">
        <span class="label">📦 Status</span>

        <span class="status ${isReady ? "ready" : "sold"}">
            ${statusText}
        </span>
    </div>

    <div class="button-group">

        <button
            class="copyBtn"
            onclick="copyUID('${item.uid}')">

            📋 COPY

        </button>

        ${orderButton}

    </div>

</div>
`;

    });

}

function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 50);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

async function copyUID(uid) {
    try {
        await navigator.clipboard.writeText(uid);
        showToast("✅ UID berhasil disalin");
    } catch (err) {
        showToast("❌ Gagal menyalin UID");
    }
}

function orderUID(uid,harga){

    const text =
`Halo Admin, saya ingin membeli UID berikut.

UID : ${uid}
Harga : ${harga}

Apakah masih tersedia?`;

    const url =
`https://wa.me/6285167335472?text=${encodeURIComponent(text)}`;

    window.open(url,"_blank");

}

/* ==========================================
DATABASE FIREBASE
========================================== */

/* ==========================================
DATABASE FIREBASE
========================================== */

let uidData = [];

console.log("DB =", db);
db.collection("uids")
.orderBy("createdAt", "desc")
.onSnapshot((snapshot) => {

    uidData = [];

    snapshot.forEach((doc) => {

        uidData.push(doc.data());

    });

    updateCounter();
    renderTable();

});

searchInput.addEventListener("input", renderTable);

filterSelect.addEventListener("change", () => {

    currentFilter = filterSelect.value;

    renderTable();

});

// Refresh tampilan setiap 1 menit
setInterval(() => {
    renderTable();
}, 60000);

/* ===========================
   HERO SLIDER
=========================== */

document.addEventListener("DOMContentLoaded", () => {

const track = document.querySelector(".slider-track");
const slides = document.querySelectorAll(".slider-track img");
const dots = document.querySelectorAll(".dot");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");

if(!track || slides.length === 0) return;

let index = 0;

function updateSlider(){

    track.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach((dot,i)=>{
        dot.classList.toggle("active", i === index);
    });

}

function nextSlide(){

    index = (index + 1) % slides.length;
    updateSlider();

}

function prevSlide(){

    index = (index - 1 + slides.length) % slides.length;
    updateSlider();

}

next.addEventListener("click", nextSlide);
prev.addEventListener("click", prevSlide);

dots.forEach((dot,i)=>{

    dot.addEventListener("click",()=>{

        index=i;

        updateSlider();

    });

});

setInterval(nextSlide,4000);

updateSlider();

});