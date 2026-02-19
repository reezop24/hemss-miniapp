document.addEventListener("DOMContentLoaded", function () {

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

    if (typeof NAME_SET === "undefined") {
        alert("NAME_SET tidak load");
        return;
    }

    const datalist = document.getElementById("guru_list");

    NAME_SET.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        datalist.appendChild(option);
    });

    const kategoriList = ["kategori_1", "kategori_2", "kategori_3", "kategori_4"];
    const savedKategori = prefill.kategori && typeof prefill.kategori === "object"
        ? prefill.kategori
        : {};

    kategoriList.forEach(k => initSection(k));

    function initSection(id) {
        const savedList = Array.isArray(savedKategori[id]) ? savedKategori[id] : [];
        if (savedList.length > 0) {
            savedList.forEach((nama, idx) => addInput(id, idx >= 2, nama || ""));
            return;
        }
        addInput(id, false, "");
        addInput(id, false, "");
    }

    window.addBox = function(id) {
        if (isReadOnly) return;
        addInput(id, true);
    };

    function addInput(sectionId, removable, value = "") {
        const section = document.getElementById(sectionId);
        const container = section.querySelector(".container");

        const wrapper = document.createElement("div");
        wrapper.className = "guru-entry";

        const fieldRow = document.createElement("div");
        fieldRow.style.display = "flex";
        fieldRow.style.gap = "8px";
        fieldRow.style.alignItems = "center";

        const input = document.createElement("input");
        input.className = "guru-search";
        input.setAttribute("list", "guru_list");
        input.placeholder = "Cari Nama Guru";
        input.value = value || "";
        input.style.flex = "1";

        const select = document.createElement("select");
        select.className = "guru-dropdown";
        select.style.flex = "1";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Pilih dari dropdown";
        select.appendChild(defaultOption);

        NAME_SET.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        });

        const normalize = (s) => (s || "").trim().toLowerCase();

        input.addEventListener("input", function () {
            const typed = normalize(input.value);
            const exact = NAME_SET.find(name => normalize(name) === typed);
            select.value = exact || "";
        });

        select.addEventListener("change", function () {
            if (select.value) {
                input.value = select.value;
            }
        });

        if (value) {
            const exact = NAME_SET.find(name => normalize(name) === normalize(value));
            if (exact) {
                input.value = exact;
                select.value = exact;
            }
        }

        if (isReadOnly) {
            input.disabled = true;
            select.disabled = true;
        }

        fieldRow.appendChild(input);
        fieldRow.appendChild(select);
        wrapper.appendChild(fieldRow);

        if (removable && !isReadOnly) {
            const removeBtn = document.createElement("button");
            removeBtn.innerText = "Buang";
            removeBtn.className = "remove-btn";

            removeBtn.onclick = function () {
                container.removeChild(wrapper);
            };

            wrapper.appendChild(removeBtn);
        }

        container.appendChild(wrapper);
    }

    const catatanEl = document.getElementById("catatan");
    if (prefill.catatan) {
        catatanEl.value = prefill.catatan;
    }
    if (isReadOnly) {
        catatanEl.disabled = true;
        document.querySelectorAll(".add-btn").forEach(btn => {
            btn.style.display = "none";
        });
        const saveBtn = document.querySelector("button.primary[onclick='submitData()']");
        const statusBox = document.getElementById("read-only-status");
        const editBtn = document.getElementById("edit-btn");
        if (saveBtn) saveBtn.style.display = "none";
        if (statusBox) statusBox.style.display = "block";
        if (editBtn) {
            editBtn.style.display = "block";
            editBtn.onclick = function () {
                tg.sendData(JSON.stringify({
                    type: "request_edit_section",
                    section: "keberadaan_guru"
                }));
                tg.close();
            };
        }
    }

    window.submitData = function () {
        if (isReadOnly) return;

        const result = {};

        kategoriList.forEach(k => {
            const section = document.getElementById(k);
            const inputs = section.querySelectorAll("input.guru-search");

            result[k] = [];

            inputs.forEach(i => {
                if (i.value.trim() !== "") {
                    result[k].push(i.value.trim());
                }
            });
        });

        const catatan = document.getElementById("catatan").value.trim();

        tg.sendData(JSON.stringify({
            type: "section_keberadaan_guru",
            data: result,
            catatan: catatan
        }));

        tg.close();
    };

});
