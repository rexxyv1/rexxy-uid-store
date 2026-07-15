const tableBody = document.getElementById("uidTable");
const searchInput = document.getElementById("searchInput");

const totalStock = document.getElementById("totalStock");
const readyStock = document.getElementById("readyStock");
const soldStock = document.getElementById("soldStock");

const filterButtons = document.querySelectorAll(".filterBtn");

let currentFilter = "all";

function updateCounter() {
    totalStock.textContent = uidData.length;

    const ready = uidData.filter(item => item.status === "Ready").length;
    const sold = uidData.filter(item => item.status === "Sold").length;

    readyStock.textContent = ready;
    soldStock.textContent = sold;
}

function renderTable() {

    const keyword = searchInput.value.toLowerCase().trim();

    tableBody.innerHTML = "";

    const filteredData = uidData.filter(item => {

        const matchSearch =
       item.uid.toLowerCase().includes(keyword) ||
       String(item.harga).includes(keyword);

        const matchFilter =
        currentFilter === "all"
        ? true
        : String(item.status).toLowerCase() === currentFilter.toLowerCase();

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

        const hargaHTML = item.promo
        ? `
        <div class="old-price">
        ${new Intl.NumberFormat("id-ID",{
            style:"currency",
            currency:"IDR",
            minimumFractionDigits:0
        }).format(item.hargaAsli)}
        </div>
        
        <div class="price">
        ${new Intl.NumberFormat("id-ID",{
            style:"currency",
            currency:"IDR",
            minimumFractionDigits:0
        }).format(item.harga)}
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

        tableBody.innerHTML += `
<div class="uid-card">

    ${item.promo ? `<span class="promo-badge">🔥 PROMO</span>` : ""}

    <div class="info">
        <span class="label">🆔 UID</span>
        <h3>${item.uid}</h3>
    </div>

    <div class="info">
        <span class="label">💰 Harga</span>
        ${hargaHTML}
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

filterButtons.forEach(btn=>{

    btn.addEventListener("click",()=>{

        filterButtons.forEach(x=>x.classList.remove("active"));

        btn.classList.add("active");

        currentFilter = btn.dataset.filter;

        renderTable();

    });

});

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