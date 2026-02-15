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

    // =========================
    // LOAD GURU BERTUGAS (DATALIST)
    // =========================
    const guruBertugasList = document.getElementById("guru_bertugas_list");
    if (typeof NAME_SET !== "undefined") {
        NAME_SET.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            guruBertugasList.appendChild(option);
        });
    }

    // =========================
    // LOAD GURU PELAPOR (SELECT)
    // =========================
    const pelaporSelect = document.getElementById("nama_pelapor");
    const allowedPelapor = Array.isArray(prefill.guru_pelapor_list)
        ? prefill.guru_pelapor_list.map(v => (v || "").trim()).filter(Boolean)
        : [];

    allowedPelapor.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        pelaporSelect.appendChild(option);
    });

    // =========================
    // LOAD NAME_PENTADBIR
    // =========================
    const pentadbirList = document.getElementById("pentadbir_list");

    if (typeof NAME_PENTADBIR !== "undefined") {
        NAME_PENTADBIR.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            pentadbirList.appendChild(option);
        });
    }

    const savedPentadbir = Array.isArray(prefill?.pentadbir?.komen) ? prefill.pentadbir.komen : [];
    const savedGuru = Array.isArray(prefill?.guru_bertugas?.komen) ? prefill.guru_bertugas.komen : [];

    if (savedPentadbir.length > 0) {
        savedPentadbir.forEach((item, idx) => addKomen("pentadbir", idx > 0, item));
    } else {
        addKomen("pentadbir", false);
    }

    if (savedGuru.length > 0) {
        savedGuru.forEach((item, idx) => addKomen("guru", idx > 0, item));
    } else {
        addKomen("guru", false);
    }

    if (prefill?.pentadbir?.nama) {
        document.getElementById("nama_pentadbir").value = prefill.pentadbir.nama;
    }
    if (prefill?.guru_bertugas?.nama) {
        document.getElementById("nama_guru").value = prefill.guru_bertugas.nama;
    }
    if (prefill?.pelapor) {
        pelaporSelect.value = prefill.pelapor;
    }

    if (isReadOnly) {
        document.getElementById("nama_pentadbir").disabled = true;
        document.getElementById("nama_guru").disabled = true;
        pelaporSelect.disabled = true;
        document.querySelectorAll("textarea").forEach(t => t.disabled = true);
        document.querySelectorAll(".add-btn").forEach(btn => btn.style.display = "none");

        const saveBtn = document.querySelector("button.btn-save[onclick='submitPerhimpunan()']");
        const statusBox = document.getElementById("read-only-status");
        const editBtn = document.getElementById("edit-btn");
        if (saveBtn) saveBtn.style.display = "none";
        if (statusBox) statusBox.style.display = "block";
        if (editBtn) {
            editBtn.style.display = "block";
            editBtn.onclick = function () {
                tg.sendData(JSON.stringify({
                    type: "request_edit_section",
                    section: "perhimpunan"
                }));
                tg.close();
            };
        }
    }

});


/* =========================
   TAMBAH / BUANG KOMEN
========================= */
function addKomen(type, removable = true, value = "") {

    const container = document.getElementById(
        type === "pentadbir" ? "komen_pentadbir" : "komen_guru"
    );

    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "10px";

    const textarea = document.createElement("textarea");
    textarea.placeholder = "Ucapan";
    textarea.value = value || "";
    if (isReadOnly) {
        textarea.disabled = true;
    }

    wrapper.appendChild(textarea);

    if (removable && !isReadOnly) {
        const removeBtn = document.createElement("button");
        removeBtn.innerText = "Buang";
        removeBtn.className = "remove-btn";
        removeBtn.onclick = function () {
            wrapper.remove();
        };
        wrapper.appendChild(removeBtn);
    }

    container.appendChild(wrapper);
}


/* =========================
   SUBMIT DATA
========================= */
function submitPerhimpunan() {
    if (isReadOnly) return;

    const namaPentadbir = document.getElementById("nama_pentadbir").value;
    const namaGuru = document.getElementById("nama_guru").value;
    const namaPelapor = document.getElementById("nama_pelapor").value;
    const allowedPelapor = Array.isArray(prefill.guru_pelapor_list)
        ? prefill.guru_pelapor_list.map(v => (v || "").trim()).filter(Boolean)
        : [];
    const allowedSet = new Set(allowedPelapor);
    const pelaporTrimmed = (namaPelapor || "").trim();

    if (!allowedSet.has(pelaporTrimmed)) {
        alert("Nama Guru Pelapor mesti dipilih daripada senarai guru bertugas (Bahagian 1).");
        return;
    }

    const komenPentadbir = [];
    document.querySelectorAll("#komen_pentadbir textarea")
        .forEach(t => {
            if (t.value.trim()) {
                komenPentadbir.push(t.value.trim());
            }
        });

    const komenGuru = [];
    document.querySelectorAll("#komen_guru textarea")
        .forEach(t => {
            if (t.value.trim()) {
                komenGuru.push(t.value.trim());
            }
        });

    tg.sendData(JSON.stringify({
        type: "section_perhimpunan",
        data: {
            pentadbir: {
                nama: namaPentadbir,
                komen: komenPentadbir
            },
            guru_bertugas: {
                nama: namaGuru,
                komen: komenGuru
            },
            pelapor: pelaporTrimmed
        }
    }));

    tg.close();
}
