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

    const savedKomen = Array.isArray(prefill.komen) ? prefill.komen : [];
    if (savedKomen.length > 0) {
        savedKomen.forEach((item, idx) => addKomen(idx > 0, item));
    } else {
        addKomen(false);
    }

    const pelaporEl = document.getElementById("pelapor");
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
                isSubmitted = true;
    disableCloseWarning();
    if (typeof tg.BackButton === "object") {
        tg.BackButton.hide();
    }

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
    const namaPelapor = document.getElementById("pelapor").value;
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

    isSubmitted = true;
    disableCloseWarning();
    if (typeof tg.BackButton === "object") {
        tg.BackButton.hide();
    }

    tg.sendData(JSON.stringify({
        type: "section_kantin",
        data: {
            pelapor: pelaporTrimmed,
            komen: komen
        }
    }));

    tg.close();
}
