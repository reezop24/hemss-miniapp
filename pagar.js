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

document.addEventListener("DOMContentLoaded", function () {

    setupCloseWarning();

    const pelaporDatangSelect = document.getElementById("pelapor_datang");
    const pelaporBalikSelect = document.getElementById("pelapor_balik");
    const allowedPelapor = Array.isArray(prefill.guru_pelapor_list)
        ? prefill.guru_pelapor_list.map(v => (v || "").trim()).filter(Boolean)
        : [];

    allowedPelapor.forEach(name => {
        const opt1 = document.createElement("option");
        opt1.value = name;
        opt1.textContent = name;
        pelaporDatangSelect.appendChild(opt1);

        const opt2 = document.createElement("option");
        opt2.value = name;
        opt2.textContent = name;
        pelaporBalikSelect.appendChild(opt2);
    });

    const savedWaktuDatang = prefill.waktu_datang && typeof prefill.waktu_datang === "object"
        ? prefill.waktu_datang
        : {};
    const savedWaktuBalik = prefill.waktu_balik && typeof prefill.waktu_balik === "object"
        ? prefill.waktu_balik
        : {};

    const savedPelajar = Array.isArray(savedWaktuDatang.pelajar_lewat)
        ? savedWaktuDatang.pelajar_lewat
        : (Array.isArray(prefill.pelajar_lewat) ? prefill.pelajar_lewat : []);

    const savedCatatanBalik = Array.isArray(savedWaktuBalik.catatan)
        ? savedWaktuBalik.catatan
        : (Array.isArray(prefill.catatan) ? prefill.catatan : []);

    if (savedPelajar.length > 0) {
        savedPelajar.forEach((item, idx) => addPelajar(idx > 0, item));
    } else {
        addPelajar(false);
    }

    if (savedCatatanBalik.length > 0) {
        savedCatatanBalik.forEach((item, idx) => addCatatan(idx > 0, item));
    } else {
        addCatatan(false);
    }

    const pelaporDatang = (savedWaktuDatang.pelapor || prefill.pelapor || "").trim();
    const pelaporBalik = (savedWaktuBalik.pelapor || prefill.pelapor_balik || "").trim();

    if (pelaporDatang) {
        pelaporDatangSelect.value = pelaporDatang;
    }
    if (pelaporBalik) {
        pelaporBalikSelect.value = pelaporBalik;
    }

    if (isReadOnly) {
        pelaporDatangSelect.disabled = true;
        pelaporBalikSelect.disabled = true;
        document.querySelectorAll("#pelajar_container input, #pelajar_container select, #catatan_container textarea").forEach(el => {
            el.disabled = true;
        });
        document.querySelectorAll(".add-btn").forEach(btn => btn.style.display = "none");
        const saveBtn = document.querySelector("button.btn-save[onclick='submitPagar()']");
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
                    section: "laporan_pagar"
                }));
                tg.close();
            };
        }
    }
});


function parseSavedPelajar(value) {
    if (value && typeof value === "object") {
        return {
            nama: (value.nama || "").trim(),
            tingkatan: (value.tingkatan || "").trim(),
            kelas: (value.kelas || "").trim()
        };
    }
    return {
        nama: (value || "").trim(),
        tingkatan: "",
        kelas: ""
    };
}

function getSortedTingkatanList() {
    if (typeof KELAS_BY_TINGKATAN === "undefined" || !KELAS_BY_TINGKATAN) return [];
    return Object.keys(KELAS_BY_TINGKATAN).sort((a, b) => Number(a) - Number(b));
}

function fillKelasOptions(selectEl, tingkatan, selectedKelas = "") {
    selectEl.innerHTML = "";
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "- Kelas -";
    selectEl.appendChild(defaultOpt);

    let kelasList = [];
    if (typeof KELAS_BY_TINGKATAN !== "undefined" && KELAS_BY_TINGKATAN[tingkatan]) {
        kelasList = KELAS_BY_TINGKATAN[tingkatan];
    } else if (typeof KE_LAS2 !== "undefined" && Array.isArray(KE_LAS2)) {
        kelasList = KE_LAS2;
    }

    kelasList.forEach(k => {
        const option = document.createElement("option");
        option.value = k;
        option.textContent = k;
        selectEl.appendChild(option);
    });

    if (selectedKelas && kelasList.includes(selectedKelas)) {
        selectEl.value = selectedKelas;
    }
}

function addPelajar(removable = true, value = "") {

    const container = document.getElementById("pelajar_container");
    const parsed = parseSavedPelajar(value);
    const tingkatanList = getSortedTingkatanList();

    const wrapper = document.createElement("div");
    wrapper.className = "pelajar-row";

    const input = document.createElement("input");
    input.className = "input-box";
    input.placeholder = "Nama Pelajar";
    input.value = parsed.nama || "";
    if (isReadOnly) {
        input.disabled = true;
    }

    const tingkatanSelect = document.createElement("select");
    tingkatanSelect.className = "tingkatan-select";
    const tingkatanDefault = document.createElement("option");
    tingkatanDefault.value = "";
    tingkatanDefault.textContent = "- Tingkatan -";
    tingkatanSelect.appendChild(tingkatanDefault);
    tingkatanList.forEach(t => {
        const option = document.createElement("option");
        option.value = t;
        option.textContent = t;
        tingkatanSelect.appendChild(option);
    });
    if (parsed.tingkatan && tingkatanList.includes(parsed.tingkatan)) {
        tingkatanSelect.value = parsed.tingkatan;
    }
    if (isReadOnly) {
        tingkatanSelect.disabled = true;
    }

    const kelasSelect = document.createElement("select");
    kelasSelect.className = "kelas-select";
    fillKelasOptions(kelasSelect, tingkatanSelect.value, parsed.kelas);
    if (isReadOnly) {
        kelasSelect.disabled = true;
    }

    tingkatanSelect.onchange = function () {
        fillKelasOptions(kelasSelect, tingkatanSelect.value);
    };

    const metaWrapper = document.createElement("div");
    metaWrapper.className = "pelajar-meta";
    metaWrapper.appendChild(tingkatanSelect);
    metaWrapper.appendChild(kelasSelect);

    wrapper.appendChild(input);
    wrapper.appendChild(metaWrapper);

    if (removable && !isReadOnly) {
        const btn = document.createElement("button");
        btn.innerText = "Buang";
        btn.className = "remove-btn";
        btn.onclick = function () {
            wrapper.remove();
        };
        metaWrapper.appendChild(btn);
    }

    container.appendChild(wrapper);
}


function addCatatan(removable = true, value = "") {

    const container = document.getElementById("catatan_container");

    const wrapper = document.createElement("div");

    const textarea = document.createElement("textarea");
    textarea.placeholder = "Catatan";
    textarea.value = value || "";
    if (isReadOnly) {
        textarea.disabled = true;
    }

    wrapper.appendChild(textarea);

    if (removable && !isReadOnly) {
        const btn = document.createElement("button");
        btn.innerText = "Buang";
        btn.className = "remove-btn";
        btn.onclick = function () {
            wrapper.remove();
        };
        wrapper.appendChild(btn);
    }

    container.appendChild(wrapper);
}


function submitPagar() {
    if (isReadOnly) return;

    const pelaporDatang = document.getElementById("pelapor_datang").value;
    const pelaporBalik = document.getElementById("pelapor_balik").value;
    const allowedPelapor = Array.isArray(prefill.guru_pelapor_list)
        ? prefill.guru_pelapor_list.map(v => (v || "").trim()).filter(Boolean)
        : [];
    const allowedSet = new Set(allowedPelapor);
    const pelaporDatangTrimmed = (pelaporDatang || "").trim();
    const pelaporBalikTrimmed = (pelaporBalik || "").trim();

    if (!allowedSet.has(pelaporDatangTrimmed)) {
        alert("Nama Guru Pelapor (Waktu Datang) mesti dipilih daripada senarai guru bertugas (Bahagian 1).");
        return;
    }

    if (!allowedSet.has(pelaporBalikTrimmed)) {
        alert("Nama Guru Pelapor (Waktu Balik) mesti dipilih daripada senarai guru bertugas (Bahagian 1).");
        return;
    }

    const pelajar_lewat = [];
    document.querySelectorAll("#pelajar_container .pelajar-row")
        .forEach(row => {
            const nama = (row.querySelector("input")?.value || "").trim();
            const tingkatan = (row.querySelector(".tingkatan-select")?.value || "").trim();
            const kelas = (row.querySelector(".kelas-select")?.value || "").trim();

            if (nama) {
                let label = nama;
                if (tingkatan || kelas) {
                    label += ` (${tingkatan || "-"} - ${kelas || "-"})`;
                }
                pelajar_lewat.push(label);
            }
        });

    const catatan_balik = [];
    document.querySelectorAll("#catatan_container textarea")
        .forEach(t => {
            if (t.value.trim()) {
                catatan_balik.push(t.value.trim());
            }
        });

    isSubmitted = true;
    disableCloseWarning();
    if (typeof tg.BackButton === "object") {
        tg.BackButton.hide();
    }

    tg.sendData(JSON.stringify({
        type: "section_laporan_pagar",
        data: {
            waktu_datang: {
                pelapor: pelaporDatangTrimmed,
                pelajar_lewat: pelajar_lewat,
            },
            waktu_balik: {
                pelapor: pelaporBalikTrimmed,
                catatan: catatan_balik,
            }
        }
    }));

    tg.close();
}
