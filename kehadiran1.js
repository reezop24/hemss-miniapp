document.addEventListener("DOMContentLoaded", function () {

    const tg = window.Telegram.WebApp;
    tg.expand();

    const params = new URLSearchParams(window.location.search);
    const tingkatan = params.get("tingkatan");
    const mode = (params.get("mode") || "edit").toLowerCase();
    const isReadOnly = mode === "view";
    let prefill = {};
    try {
        const rawPrefill = params.get("prefill");
        if (rawPrefill) {
            prefill = JSON.parse(rawPrefill);
        }
    } catch (e) {
        prefill = {};
    }

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

    // Prefill data jika dibuka mode view/edit dengan data sedia ada
    const savedClasses = prefill.classes && typeof prefill.classes === "object"
        ? prefill.classes
        : {};
    kelasList.forEach((kelasNama, index) => {
        const saved = savedClasses[kelasNama];
        if (!saved) return;
        const hadirInput = document.getElementById(`hadir_${index}`);
        const daftarInput = document.getElementById(`daftar_${index}`);
        if (typeof saved.hadir !== "undefined") hadirInput.value = saved.hadir;
        if (typeof saved.daftar !== "undefined") daftarInput.value = saved.daftar;
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
    kiraSemula();

    if (isReadOnly) {
        document.querySelectorAll(".input-box").forEach(input => {
            input.disabled = true;
        });

        const saveBtn = document.querySelector("button[onclick='submitData()']");
        const statusBox = document.getElementById("read-only-status");
        const editBtn = document.getElementById("edit-btn");

        if (saveBtn) saveBtn.style.display = "none";
        if (statusBox) statusBox.style.display = "block";
        if (editBtn) {
            editBtn.style.display = "block";
            editBtn.onclick = function () {
                tg.sendData(JSON.stringify({
                    type: "request_edit_section",
                    section: "kehadiran",
                    tingkatan: tingkatan
                }));
                tg.close();
            };
        }
    }

    // =========================
    // SUBMIT
    // =========================

    window.submitData = function () {
        if (isReadOnly) return;

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

        tg.close();
    };

});

function searchNama(inputElement) {

    removeSuggestion();

    const value = inputElement.value.toLowerCase();
    if (!value) return;

    const box = document.createElement("div");
    box.className = "suggestion-box";
    box.style.background = "#ffffff";
    box.style.color = "#000";
    box.style.borderRadius = "8px";
    box.style.marginTop = "5px";

    const matches = NAME_SET.filter(nama =>
        nama.toLowerCase().includes(value)
    );

    matches.slice(0, 5).forEach(nama => {
        const item = document.createElement("div");
        item.innerText = nama;
        item.style.padding = "8px";
        item.style.cursor = "pointer";

        item.onclick = () => {
            inputElement.value = nama;
            box.remove();
        };

        box.appendChild(item);
    });

    inputElement.parentNode.appendChild(box);
}

function removeSuggestion() {
    document.querySelectorAll(".suggestion-box").forEach(e => e.remove());
}
