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

        const matchSearch = item.uid
            .toLowerCase()
            .includes(keyword);

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
                UID tidak ditemukan.
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
                Order
            </button>
            `
            : `
            <button
                class="orderBtn disabled"
                disabled>
                Sold Out
            </button>
            `;

        tableBody.innerHTML += `

        <tr>

            <td>${item.uid}</td>

            <td>${item.harga}</td>

            <td>

                <span class="status ${item.status}">
                    ${statusText}
                </span>

            </td>

            <td>

                <div class="action">

                    <button
                    class="copyBtn"
                    onclick="copyUID('${item.uid}')">

                    Copy

                    </button>

                    ${orderButton}

                </div>

            </td>

        </tr>

        `;

    });

}

function copyUID(uid){

    navigator.clipboard.writeText(uid);

    alert("UID berhasil disalin!");

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