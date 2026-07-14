const tableBody = document.getElementById("uidTable");
const searchInput = document.getElementById("searchInput");

const totalStock = document.getElementById("totalStock");
const readyStock = document.getElementById("readyStock");
const soldStock = document.getElementById("soldStock");

const filterButtons = document.querySelectorAll(".filterBtn");

let currentFilter = "all";

function updateCounter() {
    totalStock.textContent = uidData.length;

    const ready = uidData.filter(item => item.status === "ready").length;
    const sold = uidData.filter(item => item.status === "sold").length;

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
            : item.status === currentFilter;

        return matchSearch && matchFilter;

    });

    if(filteredData.length === 0){

    tableBody.innerHTML = `
    <tr>
    <td colspan="4">
        🔍 Tidak ada UID yang cocok.
    </td>
</tr>
`;

        return;
    }

    filteredData.forEach(item => {

        const statusText =
            item.status === "ready"
            ? "🟢 Ready"
            : "🔴 Sold";

        const orderButton =
            item.status === "ready"
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

        <span class="status ${item.status}">
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

searchInput.addEventListener("input",renderTable);

updateCounter();
renderTable();
