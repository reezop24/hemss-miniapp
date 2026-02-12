document.addEventListener("DOMContentLoaded", function () {

    const tg = window.Telegram.WebApp;
    tg.expand();

    const params = new URLSearchParams(window.location.search);
    const tingkatan = params.get("tingkatan");

    if (!tingkatan) {
        alert("Tingkatan tidak diterima.");
        return;
    }

    // Header
    document.getElementById("tajuk").innerText =
        "TINGKATAN " + tingkatan;

    if (typeof KELAS_BY_TINGKATAN === "undefined") {
        alert("KELAS_BY_TINGKATAN tidak load dari nameset.js");
        return;
    }

    const kelasList = KELAS_BY_TINGKATAN[tingkatan];

    if (!kelasList) {
        alert("Tiada kelas untuk tingkatan: " + tingkatan);
        return;
    }

    const kelasContainer = document.getElementById("kelasContainer");
    const jumlahDiv = document.getElementById("jumlah");
    const peratusDiv = document.getElementById("peratus");

    // =========================
    // GENERATE ROW
    // =========================

    kelasList.forEach((kelasNama, index) => {

        const row = document.createElement("div");
        row.className = "row";

        row.innerHTML = `
            <div class="kelas">${kelasNama}</div>
            <div class="input-group">
                <input type="number" class="input-box hadir" id="hadir_${index}" min="0">
                <span class="separator">/</span>
                <input type="number" class="input-box daftar" id="daftar_${index}" min="0">
            </div>
        `;

        kelasContainer.appendChild(row);
    });

    // =========================
    // AUTO KIRA
    // =========================

    function kiraSemula() {

        let totalHadir = 0;
        let totalDaftar = 0;

        kelasList.forEach((kelasNama, index) => {

            const hadir = parseInt(document.getElementById(`hadir_${index}`).value) || 0;
            const daftar = parseInt(document.getElementById(`daftar_${index}`).value) || 0;

            totalHadir += hadir;
            totalDaftar += daftar;
        });

        const peratus =
            totalDaftar > 0
                ? ((totalHadir / totalDaftar) * 100).toFixed(2)
                : 0;

        jumlahDiv.innerText =
            `Jumlah Kehadiran: ${totalHadir} / ${totalDaftar}`;

        peratusDiv.innerText =
            `Peratusan: ${peratus}%`;
    }

    // Trigger auto kira bila user taip
    document.addEventListener("input", function (e) {
        if (e.target.classList.contains("input-box")) {
            kiraSemula();
        }
    });

    // =========================
    // SUBMIT
    // =========================

    window.submitData = function () {

        const data = {};
        let totalHadir = 0;
        let totalDaftar = 0;

        kelasList.forEach((kelasNama, index) => {

            const hadir = parseInt(document.getElementById(`hadir_${index}`).value) || 0;
            const daftar = parseInt(document.getElementById(`daftar_${index}`).value) || 0;

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
