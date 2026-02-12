document.addEventListener("DOMContentLoaded", function () {

    const tg = window.Telegram.WebApp;
    tg.expand();

    const params = new URLSearchParams(window.location.search);
    const tingkatan = params.get("tingkatan");

    if (!tingkatan) {
        alert("Tingkatan tidak diterima.");
        return;
    }

    document.getElementById("tajuk").innerText =
        "TINGKATAN " + tingkatan;

    if (typeof KELAS_BY_TINGKATAN === "undefined") {
        alert("KELAS_BY_TINGKATAN tidak load.");
        return;
    }

    const kelasList = KELAS_BY_TINGKATAN[tingkatan] || [];
    const kelasContainer = document.getElementById("kelasContainer");

    let totalHadir = 0;
    let totalDaftar = 0;

    kelasList.forEach((kelasNama, index) => {

        const row = document.createElement("div");
        row.className = "row";

        row.innerHTML = `
            <div class="kelas">${kelasNama}</div>
            <div class="input-group">
                <input type="number" class="input-box" id="hadir_${index}" min="0">
                <span class="separator">/</span>
                <input type="number" class="input-box" id="daftar_${index}" min="0">
            </div>
        `;

        kelasContainer.appendChild(row);
    });

    window.submitData = function () {

        const data = {};
        totalHadir = 0;
        totalDaftar = 0;

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

});document.addEventListener("DOMContentLoaded", function () {

    const tg = window.Telegram.WebApp;
    tg.expand();

    const params = new URLSearchParams(window.location.search);
    const tingkatan = params.get("tingkatan");

    if (!tingkatan) {
        alert("Tingkatan tidak diterima.");
        return;
    }

    document.getElementById("tajuk").innerText =
        "TINGKATAN " + tingkatan;

    if (typeof KELAS_BY_TINGKATAN === "undefined") {
        alert("KELAS_BY_TINGKATAN tidak load.");
        return;
    }

    const kelasList = KELAS_BY_TINGKATAN[tingkatan] || [];
    const kelasContainer = document.getElementById("kelasContainer");

    let totalHadir = 0;
    let totalDaftar = 0;

    kelasList.forEach((kelasNama, index) => {

        const row = document.createElement("div");
        row.className = "row";

        row.innerHTML = `
            <div class="kelas">${kelasNama}</div>
            <div class="input-group">
                <input type="number" class="input-box" id="hadir_${index}" min="0">
                <span class="separator">/</span>
                <input type="number" class="input-box" id="daftar_${index}" min="0">
            </div>
        `;

        kelasContainer.appendChild(row);
    });

    window.submitData = function () {

        const data = {};
        totalHadir = 0;
        totalDaftar = 0;

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
