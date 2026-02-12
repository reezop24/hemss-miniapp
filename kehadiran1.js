console.log("JS load");
console.log(KE_LAS);

document.addEventListener("DOMContentLoaded", function () {

    const tg = window.Telegram?.WebApp;
    if (!tg) {
        alert("Telegram WebApp tidak dikesan.");
        return;
    }

    tg.expand();

    // ===============================
    // Ambil tingkatan dari URL
    // ===============================
    const params = new URLSearchParams(window.location.search);
    const tingkatan = params.get("tingkatan"); // t1, t2, t3...

    if (!tingkatan) {
        alert("Tingkatan tidak dijumpai.");
        return;
    }

    // Pastikan KE_LAS wujud
    if (typeof KE_LAS === "undefined") {
        alert("KE_LAS tidak load dari nameset.js");
        return;
    }

    const kelasList = KE_LAS[tingkatan];

    if (!kelasList) {
        alert("Senarai kelas untuk tingkatan ini tiada.");
        return;
    }

    // ===============================
    // Set Tajuk
    // ===============================
    document.getElementById("tajuk").innerText =
        "📊 Kehadiran Pelajar - " + tingkatan.toUpperCase();

    const container = document.getElementById("kelasContainer");

    // ===============================
    // Generate Row Kelas
    // ===============================
    kelasList.forEach((namaKelas, index) => {

        const row = document.createElement("div");
        row.className = "row";

        const kelas = document.createElement("div");
        kelas.className = "kelas";
        kelas.innerText = namaKelas;

        const hadir = document.createElement("input");
        hadir.type = "number";
        hadir.className = "input-box";
        hadir.id = "hadir_" + index;
        hadir.min = 0;

        const sep = document.createElement("div");
        sep.className = "separator";
        sep.innerText = "/";

        const daftar = document.createElement("input");
        daftar.type = "number";
        daftar.className = "input-box";
        daftar.id = "daftar_" + index;
        daftar.min = 0;

        hadir.addEventListener("input", kiraJumlah);
        daftar.addEventListener("input", kiraJumlah);

        row.appendChild(kelas);
        row.appendChild(hadir);
        row.appendChild(sep);
        row.appendChild(daftar);

        container.appendChild(row);
    });

    // ===============================
    // Kira Jumlah & Peratus
    // ===============================
    function kiraJumlah() {

        let totalHadir = 0;
        let totalDaftar = 0;

        kelasList.forEach((_, index) => {

            const h = parseInt(document.getElementById("hadir_" + index).value) || 0;
            const d = parseInt(document.getElementById("daftar_" + index).value) || 0;

            totalHadir += h;
            totalDaftar += d;
        });

        document.getElementById("jumlah").innerText =
            "Jumlah Kehadiran: " + totalHadir + " / " + totalDaftar;

        let peratus = 0;
        if (totalDaftar > 0) {
            peratus = ((totalHadir / totalDaftar) * 100).toFixed(2);
        }

        document.getElementById("peratus").innerText =
            "Peratusan: " + peratus + "%";
    }

    // ===============================
    // Submit Data
    // ===============================
    window.submitData = function () {

        let dataKelas = {};

        kelasList.forEach((namaKelas, index) => {

            const hadir = parseInt(document.getElementById("hadir_" + index).value) || 0;
            const daftar = parseInt(document.getElementById("daftar_" + index).value) || 0;

            dataKelas[namaKelas] = {
                hadir: hadir,
                daftar: daftar
            };
        });

        const payload = {
            type: "section_kehadiran",
            tingkatan: tingkatan,
            data: dataKelas
        };

        tg.sendData(JSON.stringify(payload));
        tg.close();
    };

});
