const tg = window.Telegram.WebApp;
tg.expand();
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

    // load senarai guru pelapor dari Bahagian 1
    const pelaporSelect = document.getElementById("pelapor");
    const allowedPelapor = Array.isArray(prefill.guru_pelapor_list)
        ? prefill.guru_pelapor_list.map(v => (v || "").trim()).filter(Boolean)
        : [];

    allowedPelapor.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        pelaporSelect.appendChild(option);
    });

    const savedPelajar = Array.isArray(prefill.pelajar_lewat) ? prefill.pelajar_lewat : [];
    const savedCatatan = Array.isArray(prefill.catatan) ? prefill.catatan : [];

    if (savedPelajar.length > 0) {
        savedPelajar.forEach((item, idx) => addPelajar(idx > 0, item));
    } else {
        addPelajar(false);
    }

    if (savedCatatan.length > 0) {
        savedCatatan.forEach((item, idx) => addCatatan(idx > 0, item));
    } else {
        addCatatan(false);
    }

    const pelaporEl = document.getElementById("pelapor");
    if (prefill.pelapor) {
        pelaporEl.value = prefill.pelapor;
    }

    if (isReadOnly) {
        pelaporEl.disabled = true;
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
        // Fallback: papar semua kelas (10) bila tingkatan belum dipilih.
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

    const pelapor =
        document.getElementById("pelapor").value;
    const allowedPelapor = Array.isArray(prefill.guru_pelapor_list)
        ? prefill.guru_pelapor_list.map(v => (v || "").trim()).filter(Boolean)
        : [];
    const allowedSet = new Set(allowedPelapor);
    const pelaporTrimmed = (pelapor || "").trim();

    if (!allowedSet.has(pelaporTrimmed)) {
        alert("Nama Guru Pelapor mesti dipilih daripada senarai guru bertugas (Bahagian 1).");
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

    const catatan = [];
    document.querySelectorAll("#catatan_container textarea")
        .forEach(t => {
            if (t.value.trim())
                catatan.push(t.value.trim());
        });

    tg.sendData(JSON.stringify({
        type: "section_laporan_pagar",
        data: {
            pelapor: pelaporTrimmed,
            pelajar_lewat: pelajar_lewat,
            catatan: catatan
        }
    }));

    tg.close();
}
