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

    const savedList = Array.isArray(prefill.senarai_kes) ? prefill.senarai_kes : [];
    if (savedList.length > 0) {
        savedList.forEach((item, idx) => addKes(idx > 0, item || {}));
    } else {
        addKes(false); // default 1 kes (tanpa butang buang)
    }

    const pelaporEl = document.getElementById("pelapor");
    if (prefill.pelapor) {
        pelaporEl.value = prefill.pelapor;
    }

    if (isReadOnly) {
        pelaporEl.disabled = true;
        document.querySelectorAll(".add-btn").forEach(btn => btn.style.display = "none");
        const saveBtn = document.querySelector("button.btn-save[onclick='submitKes()']");
        const statusBox = document.getElementById("read-only-status");
        const editBtn = document.getElementById("edit-btn");
        if (saveBtn) saveBtn.style.display = "none";
        if (statusBox) statusBox.style.display = "block";
        if (editBtn) {
            editBtn.style.display = "block";
            editBtn.onclick = function () {
                tg.sendData(JSON.stringify({
                    type: "request_edit_section",
                    section: "kes"
                }));
                tg.close();
            };
        }
    }
});


// ===============================
// TAMBAH KES
// ===============================
function addKes(removable = true, preset = {}) {

    const container = document.getElementById("kes_container");

    const wrapper = document.createElement("div");
    wrapper.className = "section";

    wrapper.innerHTML = `
        <h3>Maklumat Kes</h3>

        <label>Jenis Kes</label>
        <select class="jenis">
            <option value="">- Sila Pilih -</option>
            <option value="Disiplin">Disiplin</option>
            <option value="Kemalangan">Kemalangan</option>
            <option value="Bencana">Bencana</option>
        </select>

        <label>Nama Pelajar Terlibat</label>
        <div class="pelajar_container"></div>
        <button class="add-btn btn-small">+ Tambah Nama</button>

        <label>Keterangan Kejadian</label>
        <div class="keterangan_container"></div>
        <button class="add-btn btn-small">+ Tambah Keterangan</button>
    `;

    if (removable && !isReadOnly) {
        const btnBuang = document.createElement("button");
        btnBuang.className = "remove-btn";
        btnBuang.innerText = "Buang Laporan";
        btnBuang.onclick = function () {
            wrapper.remove();
        };
        wrapper.appendChild(btnBuang);
    }

    container.appendChild(wrapper);

    const btnTambahNama = wrapper.querySelectorAll(".btn-small")[0];
    const btnTambahKeterangan = wrapper.querySelectorAll(".btn-small")[1];
    const btnBuangLaporan = wrapper.querySelector(".remove-btn");

    if (!isReadOnly) {
        btnTambahNama.onclick = function () {
            addPelajar(wrapper);
        };

        btnTambahKeterangan.onclick = function () {
            addKeterangan(wrapper);
        };
    } else {
        btnTambahNama.style.display = "none";
        btnTambahKeterangan.style.display = "none";
    }

    if (btnBuangLaporan && !isReadOnly) {
        btnBuangLaporan.onclick = function () {
            wrapper.remove();
        };
    }

    const jenisSelect = wrapper.querySelector(".jenis");
    if (preset.jenis) {
        jenisSelect.value = preset.jenis;
    }
    if (isReadOnly) {
        jenisSelect.disabled = true;
    }

    // default / prefill pelajar & keterangan
    const savedPelajar = Array.isArray(preset.pelajar) ? preset.pelajar : [];
    const savedKeterangan = Array.isArray(preset.keterangan) ? preset.keterangan : [];
    if (savedPelajar.length > 0) {
        savedPelajar.forEach((item, idx) => addPelajar(wrapper, idx > 0, item));
    } else {
        addPelajar(wrapper, false);
    }

    if (savedKeterangan.length > 0) {
        savedKeterangan.forEach((item, idx) => addKeterangan(wrapper, idx > 0, item));
    } else {
        addKeterangan(wrapper, false);
    }

    if (isReadOnly) {
        wrapper.querySelectorAll("input, textarea, select").forEach(el => el.disabled = true);
    }
}


// ===============================
// TAMBAH / BUANG PELAJAR
// ===============================
function parseSavedPelajar(value) {
    if (value && typeof value === "object") {
        return {
            nama: (value.nama || "").trim(),
            tingkatan: (value.tingkatan || "").trim(),
            kelas: (value.kelas || "").trim()
        };
    }
    if (typeof value === "string") {
        const trimmed = value.trim();
        const match = trimmed.match(/^(.*?)\s*\((.*?)\s*-\s*(.*?)\)$/);
        if (match) {
            return {
                nama: (match[1] || "").trim(),
                tingkatan: (match[2] || "").trim(),
                kelas: (match[3] || "").trim()
            };
        }
        return { nama: trimmed, tingkatan: "", kelas: "" };
    }
    return { nama: "", tingkatan: "", kelas: "" };
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

function addPelajar(sectionWrapper, removable = true, value = "") {

    const container = sectionWrapper.querySelector(".pelajar_container");
    const parsed = parseSavedPelajar(value);
    const tingkatanList = getSortedTingkatanList();

    const row = document.createElement("div");
    row.className = "pelajar-row";

    const input = document.createElement("input");
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

    row.appendChild(input);
    row.appendChild(metaWrapper);

    if (removable && !isReadOnly) {
        const removeBtn = document.createElement("button");
        removeBtn.innerText = "Buang";
        removeBtn.className = "remove-btn btn-small";

        removeBtn.onclick = function () {
            row.remove();
        };
        metaWrapper.appendChild(removeBtn);
    }

    container.appendChild(row);
}


// ===============================
// TAMBAH / BUANG KETERANGAN
// ===============================
function addKeterangan(sectionWrapper, removable = true, value = "") {

    const container = sectionWrapper.querySelector(".keterangan_container");

    const row = document.createElement("div");

    const textarea = document.createElement("textarea");
    textarea.placeholder = "Keterangan kejadian";
    textarea.value = value || "";
    if (isReadOnly) {
        textarea.disabled = true;
    }

    row.appendChild(textarea);

    if (removable && !isReadOnly) {
        const removeBtn = document.createElement("button");
        removeBtn.innerText = "Buang";
        removeBtn.className = "remove-btn btn-small";
        removeBtn.style.marginBottom = "10px";

        removeBtn.onclick = function () {
            row.remove();
        };
        row.appendChild(removeBtn);
    }

    container.appendChild(row);
}


// ===============================
// SUBMIT
// ===============================
function submitKes() {
    if (isReadOnly) return;

    const pelapor = document.getElementById("pelapor").value.trim();
    const allowedPelapor = Array.isArray(prefill.guru_pelapor_list)
        ? prefill.guru_pelapor_list.map(v => (v || "").trim()).filter(Boolean)
        : [];
    if (!pelapor) {
        alert("Sila isi nama guru pelapor.");
        return;
    }
    if (allowedPelapor.length > 0 && !allowedPelapor.includes(pelapor)) {
        alert("Nama guru pelapor mesti dari senarai Guru Bertugas (Bahagian 1).");
        return;
    }

    const allKes = [];

    document.querySelectorAll("#kes_container .section").forEach(sec => {

        const jenis = sec.querySelector(".jenis").value;

        const pelajar = [];
        sec.querySelectorAll(".pelajar_container .pelajar-row").forEach(row => {
            const nama = (row.querySelector("input")?.value || "").trim();
            const tingkatan = (row.querySelector(".tingkatan-select")?.value || "").trim();
            const kelas = (row.querySelector(".kelas-select")?.value || "").trim();
            if (nama) {
                let label = nama;
                if (tingkatan || kelas) {
                    label += ` (${tingkatan || "-"} - ${kelas || "-"})`;
                }
                pelajar.push(label);
            }
        });

        const keterangan = [];
        sec.querySelectorAll(".keterangan_container textarea").forEach(t => {
            if (t.value.trim()) keterangan.push(t.value.trim());
        });

        if (jenis) {
            allKes.push({
                jenis: jenis,
                pelajar: pelajar,
                keterangan: keterangan
            });
        }
    });

    tg.sendData(JSON.stringify({
        type: "section_kes",
        data: {
            pelapor: pelapor,
            senarai_kes: allKes
        }
    }));

    tg.close();
}
