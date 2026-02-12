document.addEventListener("DOMContentLoaded", function () {

    const tg = window.Telegram.WebApp;
    tg.expand();

    const params = new URLSearchParams(window.location.search);
    const tingkatan = params.get("tingkatan");

    document.getElementById("tajuk").innerText =
        "📊 Kehadiran Pelajar - Tingkatan " + tingkatan;

    const kelasContainer = document.getElementById("kelasContainer");

    let totalHadir = 0;
    let totalDaftar = 0;

    // Guna KE_LAS dari nameset.js
    KE_LAS.forEach(kelas => {

        const row = document.createElement("div");
        row.className = "row";
        row.dataset.kelas = kelas;

        row.innerHTML = `
            <div class="kelas">${kelas}</div>
            <input type="number" class="input-box hadir" min="0">
            <div class="separator">/</div>
            <input type="number" class="input-box daftar" min="0">
        `;

        kelasContainer.appendChild(row);
    });

    function kiraAuto() {

        totalHadir = 0;
        totalDaftar = 0;

        document.querySelectorAll(".row").forEach(row => {

            const hadir = parseInt(row.querySelector(".hadir").value) || 0;
            const daftar = parseInt(row.querySelector(".daftar").value) || 0;

            totalHadir += hadir;
            totalDaftar += daftar;
        });

        document.getElementById("jumlah").innerText =
            `Jumlah Kehadiran: ${totalHadir} / ${totalDaftar}`;

        let peratus = 0;
        if (totalDaftar > 0) {
            peratus = ((totalHadir / totalDaftar) * 100).toFixed(1);
        }

        document.getElementById("peratus").innerText =
            `Peratusan: ${peratus}%`;
    }

    document.addEventListener("input", kiraAuto);

    window.submitData = function () {

        const kelasData = {};

        document.querySelectorAll(".row").forEach(row => {

            const kelas = row.dataset.kelas;
            const hadir = parseInt(row.querySelector(".hadir").value) || 0;
            const daftar = parseInt(row.querySelector(".daftar").value) || 0;

            kelasData[kelas] = {
                hadir: hadir,
                daftar: daftar
            };
        });

        const data = {
            type: "section_kehadiran",
            data: {
                tingkatan: tingkatan,
                classes: kelasData,
                total_hadir: totalHadir,
                total_daftar: totalDaftar,
                peratus: totalDaftar > 0
                    ? ((totalHadir / totalDaftar) * 100).toFixed(1)
                    : 0
            }
        };

        tg.sendData(JSON.stringify(data));
    };
});
