/* ==========================================
REXXY ADMIN PANEL
SCRIPT.JS
========================================== */

// ===============================
// FIREBASE FIRESTORE
// ===============================

const uidCollection = db.collection("uids");

async function simpanUIDFirebase(data) {
    try {
        await uidCollection.add(data);
        alert("✅ UID berhasil disimpan ke Firebase");
    } catch (err) {
        console.error(err);
        alert("❌ Gagal menyimpan UID");
    }
}

/* ==========================
LOGIN CHECK
========================== */

if(localStorage.getItem("admin") !== "true"){

    location.href="login.html";

}

/* ==========================
DATABASE
========================== */

let uidData = [];

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

function openEditModal(index){

    const item = uidData[index];

    currentDoc = item.id;

    document.getElementById("editUID").value = item.uid;
    document.getElementById("editHarga").value = item.harga;
    document.getElementById("editLogin").value = item.login;
    document.getElementById("editStatus").value = item.status;

    document.getElementById("editModal").style.display = "flex";
}

function closeEditModal(){

    document.getElementById("editModal").style.display = "none";
}

const toast =
document.getElementById("toast");

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
    modal.style.display = "flex";
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

async function saveUID(){

    const uid = document.getElementById("uid").value.trim();

    const harga = Number(document.getElementById("harga").value);

    const login = document.getElementById("login").value;

    const status = document.getElementById("status").value;

    const deskripsi = document.getElementById("deskripsi").value;

    const gambar = document.getElementById("preview").src || "";

    if(uid==="" || !harga){

        alert("Lengkapi data");

        return;

    }

    const data={

        uid,
        harga,
        login,
        status,
        deskripsi,
        gambar,
        createdAt:firebase.firestore.FieldValue.serverTimestamp()

    };

    try{

        await db.collection("uids").add(data);

        showToast("UID berhasil ditambahkan");

        closeModal();

        document.getElementById("uid").value="";
        document.getElementById("harga").value="";
        document.getElementById("deskripsi").value="";
        document.getElementById("preview").style.display="none";

    }catch(err){

        console.error(err);

        alert(err.message);

    }

}

/* ==========================
DELETE UID
========================== */

async function deleteUID(index){

    if(!confirm("Hapus UID ini ?")) return;

    try{

        await db.collection("uids")
        .doc(uidData[index].id)
        .delete();

        showToast("UID berhasil dihapus");

    }catch(err){

        console.error(err);
        alert(err.message);

    }

}

/* ==========================
EDIT UID
========================== */

async function editUID(index){

    const item = uidData[index];

    const hargaBaru = prompt(
        "Harga Baru",
        item.harga
    );

    if(hargaBaru===null) return;

    try{

        await db.collection("uids")
        .doc(item.id)
        .update({

            harga:Number(hargaBaru)

        });

        showToast("Data berhasil diupdate");

    }catch(err){

        console.error(err);
        alert(err.message);

    }

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
                    onclick="openEditModal(${index})">
                    
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
EDIT STOK ADMIN PANEL
========================== */

let currentDoc = "";

function openEditModal(index){

    const item = uidData[index];

    currentDoc = item.id;

    document.getElementById("editUID").value = item.uid;
    document.getElementById("editHarga").value = item.harga;
    document.getElementById("editLogin").value = item.login;
    document.getElementById("editStatus").value = item.status;

    editModal.style.display = "flex";
}

function closeEditModal(){

    editModal.style.display = "none";
}

async function saveEdit(){

    const harga = Number(document.getElementById("editHarga").value);

    const login = document.getElementById("editLogin").value;

    const status = document.getElementById("editStatus").value;

    try{

        await db.collection("uids")
        .doc(currentDoc)
        .update({
            harga,
            login,
            status
        });
        
        console.log("UPDATE BERHASIL");
        
        editModal.style.display = "none";
        
        showToast("✅ Data berhasil diupdate");

        closeEditModal();

    }catch(err){

        console.error(err);

        alert(err.message);

    }

}


/* ==========================
INIT
========================== */

db.collection("uids")

.onSnapshot((snapshot)=>{

    uidData=[];

    snapshot.forEach((doc)=>{

        uidData.push({

            id:doc.id,

            ...doc.data()

        });

    });

    render();

});

render();