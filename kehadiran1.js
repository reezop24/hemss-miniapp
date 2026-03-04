document.addEventListener("DOMContentLoaded", function () {
    const tg = window.Telegram.WebApp;
    tg.expand();


if (typeof tg.ready === "function") {
    tg.ready();
}

let isSubmitted = false;

function closeWarningText() {
    return "Semua maklumat tidak akan disimpan jika anda menutup halaman ini sekarang.";
}

function enableCloseWarning() {
    if (typeof tg.enableClosingConfirmation === "function") {
        tg.enableClosingConfirmation();
        return;
    }
    if (typeof tg.setClosingConfirmation === "function") {
        tg.setClosingConfirmation(true);
    }
}

function disableCloseWarning() {
    if (typeof tg.disableClosingConfirmation === "function") {
        tg.disableClosingConfirmation();
        return;
    }
    if (typeof tg.setClosingConfirmation === "function") {
        tg.setClosingConfirmation(false);
    }
}

function setupCloseWarning() {
    if (isReadOnly) return;

    enableCloseWarning();

    if (typeof tg.BackButton === "object") {
        tg.BackButton.show();
        tg.onEvent("backButtonClicked", function () {
            if (isSubmitted) {
                tg.close();
                return;
            }
            const ok = window.confirm(closeWarningText());
            if (ok) {
                disableCloseWarning();
                tg.close();
            }
        });
    }

    window.addEventListener("beforeunload", function (e) {
        if (isSubmitted) return;
        e.preventDefault();
        e.returnValue = closeWarningText();
        return closeWarningText();
    });
}

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

    setupCloseWarning();

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
                <input type="text" class="input-box hadir" id="hadir_${index}" inputmode="numeric" pattern="[0-9]*" maxlength="2" autocomplete="off">
                <span class="separator">/</span>
                <input type="text" class="input-box daftar" id="daftar_${index}" inputmode="numeric" pattern="[0-9]*" maxlength="2" autocomplete="off">
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

    function getInputOrder() {
        return Array.from(document.querySelectorAll(".input-box"));
    }

    function focusNextInput(currentInput) {
        const all = getInputOrder();
        const idx = all.indexOf(currentInput);
        if (idx >= 0 && idx < all.length - 1) {
            all[idx + 1].focus();
            all[idx + 1].select();
        }
    }

    function focusPrevInput(currentInput) {
        const all = getInputOrder();
        const idx = all.indexOf(currentInput);
        if (idx > 0) {
            all[idx - 1].focus();
            all[idx - 1].select();
        }
    }

    // Trigger auto kira + auto gerak fokus bila capai 2 digit.
    document.addEventListener("input", function (e) {
        if (!e.target.classList.contains("input-box")) return;

        const cleaned = (e.target.value || "").replace(/\D/g, "").slice(0, 2);
        e.target.value = cleaned;

        if (!isReadOnly && cleaned.length === 2 && document.activeElement === e.target) {
            focusNextInput(e.target);
        }

        kiraSemula();
    });

    // Backspace pada input kosong akan kembali ke input sebelumnya.
    document.addEventListener("keydown", function (e) {
        if (!e.target.classList.contains("input-box")) return;
        if (e.key === "Backspace" && !e.target.value) {
            focusPrevInput(e.target);
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
                isSubmitted = true;
    disableCloseWarning();
    if (typeof tg.BackButton === "object") {
        tg.BackButton.hide();
    }

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

        isSubmitted = true;
    disableCloseWarning();
    if (typeof tg.BackButton === "object") {
        tg.BackButton.hide();
    }

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
