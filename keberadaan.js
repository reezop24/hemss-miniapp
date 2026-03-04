document.addEventListener("DOMContentLoaded", function () {

    const tg = window.Telegram.WebApp;
    tg.expand();
    if (typeof tg.ready === "function") {
        tg.ready();
    }
    const params = new URLSearchParams(window.location.search);
    const mode = (params.get("mode") || "edit").toLowerCase();
    const isReadOnly = mode === "view";
    let isSubmitted = false;
    let prefill = {};
    try {
        const rawPrefill = params.get("prefill");
        if (rawPrefill) {
            prefill = JSON.parse(rawPrefill);
        }
    } catch (e) {
        prefill = {};
    }


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

    if (!isReadOnly) {
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

    if (typeof NAME_SET === "undefined") {
        alert("NAME_SET tidak load");
        return;
    }

    const datalistGuru = document.getElementById("guru_list");
    const datalistPentadbir = document.getElementById("pentadbir_list");

    NAME_SET.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        datalistGuru.appendChild(option);
    });

    if (Array.isArray(NAME_PENTADBIR)) {
        NAME_PENTADBIR.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            datalistPentadbir.appendChild(option);
        });
    }

    const kategoriList = ["kategori_1", "kategori_2", "kategori_3", "kategori_4"];
    const savedKategori = prefill.kategori && typeof prefill.kategori === "object"
        ? prefill.kategori
        : {};

    kategoriList.forEach(k => initSection(k));

    function initSection(id) {
        const savedList = Array.isArray(savedKategori[id]) ? savedKategori[id] : [];
        if (savedList.length > 0) {
            savedList.forEach((nama, idx) => addInput(id, idx >= 2, nama || "", "guru"));
            return;
        }
        addInput(id, false, "", "guru");
        addInput(id, false, "", "guru");
    }

    window.addBox = function (id, source = "guru") {
        if (isReadOnly) return;
        addInput(id, true, "", source);
    };

    function addInput(sectionId, removable, value = "", source = "guru") {
        const section = document.getElementById(sectionId);
        const container = section.querySelector(".container");

        const sourceIsPentadbir = source === "pentadbir";
        const nameSource = sourceIsPentadbir && Array.isArray(NAME_PENTADBIR)
            ? NAME_PENTADBIR
            : NAME_SET;
        const listId = sourceIsPentadbir ? "pentadbir_list" : "guru_list";
        const placeholder = sourceIsPentadbir
            ? "Cari / pilih nama pentadbir"
            : "Cari / pilih nama guru";

        const wrapper = document.createElement("div");
        wrapper.className = "guru-entry";

        const fieldWrap = document.createElement("div");
        fieldWrap.style.position = "relative";

        const input = document.createElement("input");
        input.className = "guru-search";
        input.setAttribute("list", listId);
        input.placeholder = placeholder;
        input.value = value || "";
        input.style.width = "100%";
        input.style.paddingRight = "36px";

        const arrowBtn = document.createElement("button");
        arrowBtn.type = "button";
        arrowBtn.innerText = "▾";
        arrowBtn.style.position = "absolute";
        arrowBtn.style.right = "0";
        arrowBtn.style.top = "0";
        arrowBtn.style.height = "100%";
        arrowBtn.style.width = "34px";
        arrowBtn.style.border = "none";
        arrowBtn.style.borderLeft = "1px solid rgba(255,255,255,0.2)";
        arrowBtn.style.background = "rgba(255,255,255,0.12)";
        arrowBtn.style.color = "white";
        arrowBtn.style.borderTopRightRadius = "6px";
        arrowBtn.style.borderBottomRightRadius = "6px";
        arrowBtn.style.cursor = "pointer";

        const select = document.createElement("select");
        select.className = "guru-dropdown-native";
        select.style.position = "absolute";
        select.style.right = "0";
        select.style.top = "0";
        select.style.width = "34px";
        select.style.height = "100%";
        select.style.opacity = "0";
        select.style.cursor = "pointer";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Pilih";
        select.appendChild(defaultOption);

        nameSource.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        });

        const normalize = (s) => (s || "").trim().toLowerCase();

        input.addEventListener("input", function () {
            const typed = normalize(input.value);
            const exact = nameSource.find(name => normalize(name) === typed);
            select.value = exact || "";
        });

        select.addEventListener("change", function () {
            if (select.value) {
                input.value = select.value;
            }
        });

        arrowBtn.addEventListener("click", function () {
            select.focus();
            select.click();
        });

        if (value) {
            const exact = nameSource.find(name => normalize(name) === normalize(value));
            if (exact) {
                input.value = exact;
                select.value = exact;
            }
        }

        if (isReadOnly) {
            input.disabled = true;
            select.disabled = true;
            arrowBtn.disabled = true;
            arrowBtn.style.opacity = "0.5";
            arrowBtn.style.cursor = "default";
        }

        fieldWrap.appendChild(input);
        fieldWrap.appendChild(arrowBtn);
        fieldWrap.appendChild(select);
        wrapper.appendChild(fieldWrap);

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

        isSubmitted = true;
        disableCloseWarning();
        if (typeof tg.BackButton === "object") {
            tg.BackButton.hide();
        }

        tg.sendData(JSON.stringify({
            type: "section_keberadaan_guru",
            data: result,
            catatan: catatan
        }));

        tg.close();
    };

});
