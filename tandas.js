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

/* =========================
   LOAD NAME SET (DATALIST)
========================= */

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
});


const OPTION = ["", "Memuaskan", "Kurang memuaskan"];

function createDropdown(label, value = "") {

    const wrapper = document.createElement("div");

    const title = document.createElement("div");
    title.innerText = label;

    const select = document.createElement("select");

    OPTION.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.text = opt === "" ? "- Sila Pilih -" : opt;
        select.appendChild(option);
    });
    if (value) {
        select.value = value;
    }
    if (isReadOnly) {
        select.disabled = true;
    }

    wrapper.appendChild(title);
    wrapper.appendChild(select);

    return { wrapper, select };
}

function createUlasanSection(savedUlasan = []) {

    const container = document.createElement("div");

    function addUlasan(removable = true, value = "") {
        const wrap = document.createElement("div");

        const textarea = document.createElement("textarea");
        textarea.placeholder = "ULASAN";
        textarea.value = value || "";
        if (isReadOnly) {
            textarea.disabled = true;
        }

        wrap.appendChild(textarea);

        if (removable && !isReadOnly) {
            const btn = document.createElement("button");
            btn.innerText = "Buang";
            btn.className = "remove-btn";
            btn.onclick = () => wrap.remove();
            wrap.appendChild(btn);
        }

        container.appendChild(wrap);
    }

    const addBtn = document.createElement("button");
    addBtn.innerText = "+ Tambah Ulasan";
    addBtn.className = "add-btn";
    addBtn.onclick = () => addUlasan(true);
    if (isReadOnly) {
        addBtn.style.display = "none";
    }

    if (Array.isArray(savedUlasan) && savedUlasan.length > 0) {
        savedUlasan.forEach((item, idx) => addUlasan(idx > 0, item));
    } else {
        addUlasan(false);
    }

    return { container, addBtn };
}

function createBlok(title, fields, savedBlok = {}) {

    const section = document.createElement("div");
    section.className = "section";

    const h3 = document.createElement("h3");
    h3.innerText = title;
    section.appendChild(h3);

    const selects = {};

    fields.forEach(f => {
        const dd = createDropdown(f, savedBlok[f] || "");
        selects[f] = dd.select;
        section.appendChild(dd.wrapper);
    });

    const ulasan = createUlasanSection(savedBlok.ulasan || []);
    section.appendChild(ulasan.container);
    section.appendChild(ulasan.addBtn);

    return { section, selects, ulasan };
}

const container = document.getElementById("container");

const blokT1 = createBlok("BLOK TINGKATAN 1", [
    "Tandas Lelaki",
    "Tandas Perempuan"
], prefill.blok_t1 || {});

const blokBangunan = createBlok("BLOK BANGUNAN BARU", [
    "Tandas Lelaki",
    "Tandas Perempuan"
], prefill.blok_bangunan_baru || {});

const blokTengah = createBlok("BLOK TENGAH", [
    "Tandas Lelaki",
    "Tandas Perempuan",
    "Tandas Guru Lelaki",
    "Tandas Guru Perempuan"
], prefill.blok_tengah || {});

container.appendChild(blokT1.section);
container.appendChild(blokBangunan.section);
container.appendChild(blokTengah.section);

document.addEventListener("DOMContentLoaded", function () {
    const pelaporEl = document.getElementById("pelapor");
    if (prefill.pelapor) {
        pelaporEl.value = prefill.pelapor;
    }
    if (isReadOnly) {
        pelaporEl.disabled = true;
        const saveBtn = document.querySelector("button.btn-save[onclick='submitTandas()']");
        const statusBox = document.getElementById("read-only-status");
        const editBtn = document.getElementById("edit-btn");
        if (saveBtn) saveBtn.style.display = "none";
        if (statusBox) statusBox.style.display = "block";
        if (editBtn) {
            editBtn.style.display = "block";
            editBtn.onclick = function () {
                tg.sendData(JSON.stringify({
                    type: "request_edit_section",
                    section: "tandas"
                }));
                tg.close();
            };
        }
    }
});

function collectBlok(blok) {

    const result = {};

    for (let key in blok.selects) {
        result[key] = blok.selects[key].value;
    }

    result["ulasan"] = [];
    blok.section.querySelectorAll("textarea").forEach(t => {
        if (t.value.trim())
            result["ulasan"].push(t.value.trim());
    });

    return result;
}

function submitTandas() {
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

    tg.sendData(JSON.stringify({
        type: "section_tandas",
        data: {
            pelapor: pelaporTrimmed,
            blok_t1: collectBlok(blokT1),
            blok_bangunan_baru: collectBlok(blokBangunan),
            blok_tengah: collectBlok(blokTengah)
        }
    }));

    tg.close();
}
