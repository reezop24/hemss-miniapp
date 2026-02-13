const tg = window.Telegram.WebApp;
tg.expand();

/* =========================
   SEARCH NAMA GLOBAL
========================= */
/* =========================
   SEARCH NAMA GLOBAL (STABLE)
========================= */

function searchNama(inputElement) {

    if (typeof NAME_SET === "undefined") return;

    const keyword = inputElement.value.toLowerCase().trim();

    // remove dropdown lama
    const oldBox = document.querySelector(".suggestion-box");
    if (oldBox) oldBox.remove();

    if (!keyword) return;

    const filtered = NAME_SET.filter(nama =>
        nama.toLowerCase().includes(keyword)
    );

    if (filtered.length === 0) return;

    // buat container dropdown
    const list = document.createElement("div");
    list.className = "suggestion-box";

    // styling
    list.style.position = "absolute";
    list.style.background = "white";
    list.style.color = "black";
    list.style.borderRadius = "10px";
    list.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
    list.style.maxHeight = "180px";
    list.style.overflowY = "auto";
    list.style.zIndex = "9999";
    list.style.width = inputElement.offsetWidth + "px";

    // kira posisi betul2 bawah input
    const rect = inputElement.getBoundingClientRect();
    list.style.left = rect.left + window.scrollX + "px";
    list.style.top = rect.bottom + window.scrollY + "px";

    // masukkan suggestion
    filtered.slice(0, 10).forEach(nama => {

        const item = document.createElement("div");
        item.style.padding = "10px";
        item.style.cursor = "pointer";
        item.innerText = nama;

        item.onmouseover = function() {
            item.style.background = "#eeeeee";
        };

        item.onmouseout = function() {
            item.style.background = "white";
        };

        item.onclick = function () {
            inputElement.value = nama;
            list.remove();
        };

        list.appendChild(item);
    });

    document.body.appendChild(list);
}


/* =========================
   CLOSE DROPDOWN BILA CLICK LUAR
========================= */

document.addEventListener("click", function(e) {
    if (!e.target.classList.contains("nama-search")) {
        const box = document.querySelector(".suggestion-box");
        if (box) box.remove();
    }
});

/* =========================
   TAMBAH / BUANG KOMEN
========================= */
function addKomen(type) {

    const container = document.getElementById(
        type === "pentadbir" ? "komen_pentadbir" : "komen_guru"
    );

    const wrapper = document.createElement("div");

    const textarea = document.createElement("textarea");
    textarea.placeholder = "Pengumuman / Ucapan";

    const removeBtn = document.createElement("button");
    removeBtn.innerText = "Buang";
    removeBtn.className = "btn btn-remove";
    removeBtn.onclick = function () {
        wrapper.remove();
    };

    wrapper.appendChild(textarea);
    wrapper.appendChild(removeBtn);

    container.appendChild(wrapper);
}


/* =========================
   SUBMIT DATA
========================= */
function submitPerhimpunan() {

    const namaPentadbir =
        document.querySelectorAll(".nama-search")[0].value;

    const namaGuru =
        document.querySelectorAll(".nama-search")[1].value;

    const namaPelapor =
        document.querySelectorAll(".nama-search")[2].value;

    const komenPentadbir = [];
    document.querySelectorAll("#komen_pentadbir textarea")
        .forEach(t => {
            if (t.value.trim())
                komenPentadbir.push(t.value.trim());
        });

    const komenGuru = [];
    document.querySelectorAll("#komen_guru textarea")
        .forEach(t => {
            if (t.value.trim())
                komenGuru.push(t.value.trim());
        });

    tg.sendData(JSON.stringify({
        type: "section_perhimpunan",
        data: {
            pentadbir: {
                nama: namaPentadbir,
                komen: komenPentadbir
            },
            guru_bertugas: {
                nama: namaGuru,
                komen: komenGuru
            },
            pelapor: namaPelapor
        }
    }));
}
