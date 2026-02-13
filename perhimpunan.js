const tg = window.Telegram.WebApp;
tg.expand();

/* =========================
   SEARCH NAMA DROPDOWN
========================= */
function searchNama(inputElement) {

    if (!window.NAME_SET) return;

    const keyword = inputElement.value.toLowerCase().trim();

    // buang dropdown lama
    const oldBox = document.querySelector(".suggestion-box");
    if (oldBox) oldBox.remove();

    if (!keyword) return;

    const filtered = window.NAME_SET.filter(nama =>
        nama.toLowerCase().includes(keyword)
    );

    if (filtered.length === 0) return;

    const list = document.createElement("div");
    list.className = "suggestion-box";
    list.style.width = inputElement.offsetWidth + "px";

    const rect = inputElement.getBoundingClientRect();
    list.style.left = rect.left + window.scrollX + "px";
    list.style.top = rect.bottom + window.scrollY + "px";

    filtered.slice(0, 10).forEach(nama => {

        const item = document.createElement("div");
        item.style.padding = "10px";
        item.style.cursor = "pointer";
        item.innerText = nama;

        item.onmouseover = () => item.style.background = "#eeeeee";
        item.onmouseout = () => item.style.background = "white";

        item.onclick = function () {
            inputElement.value = nama;
            list.remove();
        };

        list.appendChild(item);
    });

    document.body.appendChild(list);
}

/* =========================
   CLOSE DROPDOWN
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

    const inputs = document.querySelectorAll(".nama-search");

    const namaPentadbir = inputs[0]?.value || "";
    const namaGuru = inputs[1]?.value || "";
    const namaPelapor = inputs[2]?.value || "";

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

    tg.close();
}
