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

    const datalist = document.getElementById("guru_list");
    const allowedPelapor = Array.isArray(prefill.guru_pelapor_list) ? prefill.guru_pelapor_list : [];

    if (allowedPelapor.length > 0) {
        allowedPelapor.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            datalist.appendChild(option);
        });
    } else if (!isReadOnly) {
        alert("Sila isi Bahagian 1 (Nama Guru Bertugas) dahulu.");
    }

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
        wrapper.querySelectorAll("input, textarea").forEach(el => el.disabled = true);
    }
}


// ===============================
// TAMBAH / BUANG PELAJAR
// ===============================
function addPelajar(sectionWrapper, removable = true, value = "") {

    const container = sectionWrapper.querySelector(".pelajar_container");

    const row = document.createElement("div");

    const input = document.createElement("input");
    input.placeholder = "Nama Pelajar";
    input.value = value || "";
    if (isReadOnly) {
        input.disabled = true;
    }

    row.appendChild(input);

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
    const allowedPelapor = Array.isArray(prefill.guru_pelapor_list) ? prefill.guru_pelapor_list : [];
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
        sec.querySelectorAll(".pelajar_container input").forEach(i => {
            if (i.value.trim()) pelajar.push(i.value.trim());
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
