document.addEventListener("DOMContentLoaded", function () {

    const tg = window.Telegram.WebApp;
    tg.expand();

    const params = new URLSearchParams(window.location.search);
    const tingkatan = params.get("tingkatan");   // contoh: "1"

    // Tajuk betul-betul ikut nombor
    document.getElementById("tajuk").innerText =
        "TINGKATAN " + tingkatan;

    const kelasContainer = document.getElementById("kelasContainer");

    let totalHadir = 0;
    let totalDaftar = 0;

    // Pastikan data kelas load
    if (typeof KELAS_BY_TINGKATAN === "undefined") {
        alert("KELAS_BY_TINGKATAN tidak load dari nameset.js");
        return;
    }

    const kelasList = KELAS_BY_TINGKATAN[tingkatan] || [];

    // ===============================
    // BINA ROW KELAS
    // ===============================
    kelasList.forEach((kelasNama, index) => {

        const row = document.createElement("div");
        row.className = "row";

        row.innerHTML = `
            <div class="kelas">${kelasNama}</div>
            <input type="number" class="input-box hadir" id="hadir_${index}" min="0">
            <span class="separator">/</span>
            <input type="number" class="input-box daftar" id="daftar_${index}" min="0">
        `;

        kelasContainer.appendChild(row);
    });

    // ===============================
    // SUBMIT DATA
    // ===============================
    window.submitData = function () {

        const data = {};
        totalHadir = 0;
        totalDaftar = 0;

        kelasList.forEach((kelasNama, index) => {

            const hadirValue = document.getElementById(`hadir_${index}`).value || 0;
            const daftarValue = document.getElementById(`daftar_${index}`).value || 0;

            const hadir = parseInt(hadirValue);
            const daftar = parseInt(daftarValue);

            totalHadir += hadir;
            totalDaftar += daftar;

            data[kelasNama] = {
                hadir: hadir,
                daftar: daftar
            };
        });

        const peratus =
            totalDaftar > 0
                ? ((totalHadir / totalDaftar) * 100).toFixed(2)
                : 0;

        // Hantar ke bot
        tg.sendData(JSON.stringify({
            type: "section_kehadiran",
            tingkatan: tingkatan,
            data: data,
            total_hadir: totalHadir,
            total_daftar: totalDaftar,
            peratus: peratus
        }));
    };

});
