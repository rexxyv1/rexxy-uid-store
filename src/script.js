/* ==========================================
REXXY ADMIN PANEL
SCRIPT.JS
========================================== */

/* ==========================
LOGIN CHECK
========================== */

if(localStorage.getItem("admin") !== "true"){

    location.href="login.html";

}

/* ==========================
DATABASE
========================== */

let uidData = JSON.parse(
    localStorage.getItem("uidData")
) || [

{
    uid:"16132444469",
    harga:25000,
    login:"Guest",
    status:"Ready",
    deskripsi:"UID Premium"
},

{
    uid:"19222244444",
    harga:30000,
    login:"Google",
    status:"Sold",
    deskripsi:"UID Langka"
}

];

/* ==========================
ELEMENT
========================== */

const tbody =
document.getElementById("tbody");

const search =
document.getElementById("search");

const filter =
document.getElementById("filter");

const modal =
document.getElementById("modal");

const toast =
document.getElementById("toast");

/* ==========================
SAVE DATABASE
========================== */

function saveDatabase(){

    localStorage.setItem(
        "uidData",
        JSON.stringify(uidData)
    );

}

/* ==========================
TOAST
========================== */

function showToast(text){

    toast.innerHTML=text;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}

/* ==========================
OPEN MODAL
========================== */

function openModal(){

    modal.style.display="flex";

}

/* ==========================
CLOSE MODAL
========================== */

function closeModal(){

    modal.style.display="none";

}

function previewImage(event){

const file=event.target.files[0];

if(!file)return;

const reader=new FileReader();

reader.onload=function(e){

document.getElementById("preview").src=e.target.result;

document.getElementById("preview").style.display="block";

}

reader.readAsDataURL(file);

}

/* ==========================
SAVE UID
========================== */

function saveUID(){

    const uid =
    document.getElementById("uid").value;

    const harga =
    document.getElementById("harga").value;

    const login =
    document.getElementById("login").value;

    const status =
    document.getElementById("status").value;

    const deskripsi =
    document.getElementById("deskripsi").value;

    const gambar=
    document.getElementById("preview").src;
    if(uid==="" || harga===""){

        alert("Lengkapi data");

        return;

    }

    uidData.push({

    uid,
    harga:Number(harga),
    login,
    status,
    deskripsi,
    gambar
    
    });

    saveDatabase();

    render();

    closeModal();

    document.getElementById("uid").value="";
    document.getElementById("harga").value="";
    document.getElementById("deskripsi").value="";

    showToast("UID berhasil ditambahkan");

}

/* ==========================
DELETE UID
========================== */

function deleteUID(index){

    if(
        !confirm("Hapus UID ini ?")
    ) return;

    uidData.splice(index,1);

    saveDatabase();

    render();

    showToast("UID berhasil dihapus");

}

/* ==========================
EDIT UID
========================== */

function editUID(index){

    let item = uidData[index];

    const hargaBaru = prompt(
        "Harga Baru",
        item.harga
    );

    if(hargaBaru===null) return;

    item.harga = Number(hargaBaru);

    saveDatabase();

    render();

    showToast("Data berhasil diupdate");

}

/* ==========================
STATISTIC
========================== */

function updateStatistic(){

    let total =
    uidData.length;

    let ready =
    uidData.filter(
        x=>x.status==="Ready"
    ).length;

    let sold =
    uidData.filter(
        x=>x.status==="Sold"
    ).length;

    let income =
    uidData
    .filter(
        x=>x.status==="Sold"
    )
    .reduce(
        (a,b)=>a+b.harga,
        0
    );

    document.getElementById(
        "totalUID"
    ).innerHTML=total;

    document.getElementById(
        "readyUID"
    ).innerHTML=ready;

    document.getElementById(
        "soldUID"
    ).innerHTML=sold;

    document.getElementById(
        "income"
    ).innerHTML=
    "Rp" +
    income.toLocaleString(
        "id-ID"
    );

}

/* ==========================
RENDER TABLE
========================== */

function render(){

    let keyword =
    search.value.toLowerCase();

    let statusFilter =
    filter.value;

    let html="";

    uidData
    .filter(item=>{

        let cocokUID =
        item.uid
        .toLowerCase()
        .includes(keyword);

        let cocokStatus =
        statusFilter==="all"
        ||
        item.status===statusFilter;

        return cocokUID
        &&
        cocokStatus;

    })

    .forEach((item,index)=>{

        html += `

        <tr>

            <td>${item.uid}</td>

            <td>
            Rp${item.harga.toLocaleString("id-ID")}
            </td>

            <td>${item.login}</td>

            <td>

                <span class="status ${item.status.toLowerCase()}">

                ${item.status}

                </span>

            </td>

            <td>

                <div class="action">

                    <button
                    class="editBtn"
                    onclick="editUID(${index})">

                    Edit

                    </button>

                    <button
                    class="deleteBtn"
                    onclick="deleteUID(${index})">

                    Hapus

                    </button>

                </div>

            </td>

        </tr>

        `;

    });

    tbody.innerHTML=html;

    updateStatistic();

}

/* ==========================
LOGOUT
========================== */

function logout(){

    localStorage.removeItem(
        "admin"
    );

    location.href=
    "login.html";

}

/* ==========================
AUTO CLOSE MODAL
========================== */

window.onclick=function(e){

    if(e.target===modal){

        closeModal();

    }

}

/* ==========================
INIT
========================== */

render();