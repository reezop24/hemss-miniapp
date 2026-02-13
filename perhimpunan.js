const tg = window.Telegram.WebApp;
tg.expand();

/* =========================
   SEARCH NAMA GLOBAL
========================= */
function searchNama(inputElement) {

    const keyword = inputElement.value.toLowerCase();

    // remove old dropdown
    const old = document.querySelector(".suggestion-box");
    if (old) old.remove();

    if (!keyword) return;

    const filtered = NAME_SET.filter(nama =>
        nama.toLowerCase().includes(keyword)
    );

    if (filtered.length === 0) return;

    const list = document.createElement("div");
    list.className = "suggestion-box";

    // position dropdown exactly bawah input
    const rect = inputElement.getBoundingClientRect();
    list.style.top = (inputElement.offsetTop + inputElement.offsetHeight + 5) + "px";

    filtered.slice(0, 10).forEach(nama => {

        const item = document.createElement("div");
        item.style.padding = "8px";
        item.style.cursor = "pointer";
        item.innerText = nama;

        item.onclick = function () {
            inputElement.value = nama;
            list.remove();
        };

        list.appendChild(item);
    });

    inputElement.parentNode.appendChild(list);
}


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
