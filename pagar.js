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

    // load NAME_SET
    const datalist = document.getElementById("guru_list");

    if (typeof NAME_SET !== "undefined") {
        NAME_SET.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            datalist.appendChild(option);
        });
    }

    const savedPelajar = Array.isArray(prefill.pelajar_lewat) ? prefill.pelajar_lewat : [];
    const savedCatatan = Array.isArray(prefill.catatan) ? prefill.catatan : [];

    if (savedPelajar.length > 0) {
        savedPelajar.forEach((item, idx) => addPelajar(idx >= 3, item));
    } else {
        for (let i = 0; i < 3; i++) addPelajar(false);
    }

    if (savedCatatan.length > 0) {
        savedCatatan.forEach((item, idx) => addCatatan(idx > 0, item));
    } else {
        addCatatan(false);
    }

    const pelaporEl = document.querySelectorAll(".input-box")[0];
    if (prefill.pelapor) {
        pelaporEl.value = prefill.pelapor;
    }

    if (isReadOnly) {
        pelaporEl.disabled = true;
        document.querySelectorAll("#pelajar_container input, #catatan_container textarea").forEach(el => {
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


function addPelajar(removable = true, value = "") {

    const container = document.getElementById("pelajar_container");

    const wrapper = document.createElement("div");

    const input = document.createElement("input");
    input.className = "input-box";
    input.placeholder = "Nama Pelajar";
    input.value = value || "";
    if (isReadOnly) {
        input.disabled = true;
    }

    wrapper.appendChild(input);

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
        document.querySelectorAll(".input-box")[0].value;

    const pelajar_lewat = [];
    document.querySelectorAll("#pelajar_container input")
        .forEach(i => {
            if (i.value.trim())
                pelajar_lewat.push(i.value.trim());
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
            pelapor: pelapor,
            pelajar_lewat: pelajar_lewat,
            catatan: catatan
        }
    }));

    tg.close();
}
