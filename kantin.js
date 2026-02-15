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
    const allowedPelapor = Array.isArray(prefill.guru_pelapor_list)
        ? prefill.guru_pelapor_list.map(v => (v || "").trim()).filter(Boolean)
        : [];

    allowedPelapor.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        datalist.appendChild(option);
    });

    if (!isReadOnly && allowedPelapor.length === 0) {
        alert("Sila lengkapkan Bahagian 1 (Kumpulan Guru Bertugas) terlebih dahulu.");
    }

    const savedKomen = Array.isArray(prefill.komen) ? prefill.komen : [];
    if (savedKomen.length > 0) {
        savedKomen.forEach((item, idx) => addKomen(idx > 0, item));
    } else {
        addKomen(false);
    }

    const pelaporEl = document.querySelector("input[list='guru_list']");
    if (prefill.pelapor) {
        pelaporEl.value = prefill.pelapor;
    }

    if (isReadOnly) {
        pelaporEl.disabled = true;
        document.querySelectorAll("#komen_kantin textarea").forEach(t => t.disabled = true);
        document.querySelectorAll(".add-btn").forEach(btn => btn.style.display = "none");
        const saveBtn = document.querySelector("button.btn-save[onclick='submitKantin()']");
        const statusBox = document.getElementById("read-only-status");
        const editBtn = document.getElementById("edit-btn");
        if (saveBtn) saveBtn.style.display = "none";
        if (statusBox) statusBox.style.display = "block";
        if (editBtn) {
            editBtn.style.display = "block";
            editBtn.onclick = function () {
                tg.sendData(JSON.stringify({
                    type: "request_edit_section",
                    section: "kantin"
                }));
                tg.close();
            };
        }
    }
});

function addKomen(removable = true, value = "") {
    const container = document.getElementById("komen_kantin");

    const wrapper = document.createElement("div");

    const textarea = document.createElement("textarea");
    textarea.placeholder = "ULASAN";
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

function submitKantin() {
    if (isReadOnly) return;
    const namaPelapor = document.querySelector("input[list='guru_list']").value;
    const allowedPelapor = Array.isArray(prefill.guru_pelapor_list)
        ? prefill.guru_pelapor_list.map(v => (v || "").trim()).filter(Boolean)
        : [];
    const allowedSet = new Set(allowedPelapor);
    const pelaporTrimmed = (namaPelapor || "").trim();

    if (!allowedSet.has(pelaporTrimmed)) {
        alert("Nama Guru Pelapor mesti dipilih daripada senarai guru bertugas (Bahagian 1).");
        return;
    }

    const komen = [];
    document.querySelectorAll("#komen_kantin textarea").forEach(t => {
        if (t.value.trim()) {
            komen.push(t.value.trim());
        }
    });

    tg.sendData(JSON.stringify({
        type: "section_kantin",
        data: {
            pelapor: pelaporTrimmed,
            komen: komen
        }
    }));

    tg.close();
}
