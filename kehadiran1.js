document.addEventListener("DOMContentLoaded", function () {

    const tg = window.Telegram.WebApp;
    tg.expand();

    const params = new URLSearchParams(window.location.search);
    const tingkatan = params.get("tingkatan");

    console.log("TINGKATAN:", tingkatan);

    document.getElementById("tajuk").innerText =
        "TINGKATAN " + tingkatan;

    if (typeof KELAS_BY_TINGKATAN === "undefined") {
        alert("KELAS_BY_TINGKATAN tidak load");
        return;
    }

    const kelasList = KELAS_BY_TINGKATAN[tingkatan];

    if (!kelasList) {
        alert("kelasList kosong untuk tingkatan: " + tingkatan);
        return;
    }

    const kelasContainer = document.getElementById("kelasContainer");

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

        kelasList.forEach((kelasNama, index) => {

            const hadir = parseInt(document.getElementById(`hadir_${index}`).value) || 0;
            const daftar = parseInt(document.getElementById(`daftar_${index}`).value) || 0;

            data[kelasNama] = {
                hadir: hadir,
                daftar: daftar
            };
        });

        tg.sendData(JSON.stringify({
            type: "section_kehadiran",
            tingkatan: tingkatan,
            data: data
        }));
    };

});
