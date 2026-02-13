document.addEventListener("DOMContentLoaded", function () {

    const tg = window.Telegram.WebApp;
    tg.expand();

    // default 1 komen setiap section
    addKomen("pentadbir");
    addKomen("guru");

});


// ==========================
// SEARCH NAMA (NAME_SET)
// ==========================
function searchNama(inputElement) {

    const value = inputElement.value.toLowerCase();
    removeSuggestion();

    if (!value) return;

    const suggestionBox = document.createElement("div");
    suggestionBox.className = "suggestion-box";
    suggestionBox.style.background = "#fff";
    suggestionBox.style.color = "#000";
    suggestionBox.style.borderRadius = "8px";
    suggestionBox.style.padding = "5px";

    const matches = NAME_SET.filter(nama =>
        nama.toLowerCase().includes(value)
    );

    matches.slice(0, 5).forEach(nama => {
        const item = document.createElement("div");
        item.innerText = nama;
        item.style.padding = "6px";
        item.style.cursor = "pointer";

        item.onclick = () => {
            inputElement.value = nama;
            suggestionBox.remove();
        };

        suggestionBox.appendChild(item);
    });

    inputElement.parentNode.appendChild(suggestionBox);
}

function removeSuggestion() {
    const old = document.querySelector(".suggestion-box");
    if (old) old.remove();
}


// ==========================
// TAMBAH / BUANG KOMEN
// ==========================
function addKomen(type) {

    const container = document.getElementById(
        type === "pentadbir" ? "komen_pentadbir" : "komen_guru"
    );

    const wrapper = document.createElement("div");

    wrapper.innerHTML = `
        <textarea placeholder="Pengumuman / Ucapan"></textarea>
        <button class="btn btn-remove" onclick="this.parentElement.remove()">Buang</button>
    `;

    container.appendChild(wrapper);
}


// ==========================
// SUBMIT
// ==========================
function submitPerhimpunan() {

    const tg = window.Telegram.WebApp;

    const namaPentadbir = document.querySelectorAll(".nama-search")[0].value;
    const namaGuru = document.querySelectorAll(".nama-search")[1].value;
    const namaPelapor = document.querySelectorAll(".nama-search")[2].value;

    const komenPentadbir = [];
    document.querySelectorAll("#komen_pentadbir textarea").forEach(t => {
        if (t.value.trim()) komenPentadbir.push(t.value.trim());
    });

    const komenGuru = [];
    document.querySelectorAll("#komen_guru textarea").forEach(t => {
        if (t.value.trim()) komenGuru.push(t.value.trim());
    });

    tg.sendData(JSON.stringify({
        type: "section_laporan_perhimpunan",
        data: {
            pentadbir: {
                nama: namaPentadbir,
                ucapan: komenPentadbir
            },
            guru_bertugas: {
                nama: namaGuru,
                ucapan: komenGuru
            },
            pelapor: namaPelapor
        }
    }));

}
