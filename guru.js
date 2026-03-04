document.addEventListener("DOMContentLoaded", function () {

    const tg = window.Telegram?.WebApp;

    if (!tg) {
        alert("Telegram WebApp tidak dikesan.");
        return;
    }

    tg.expand();
    if (typeof tg.ready === "function") {
        tg.ready();
    }
    let isSubmitted = false;

    const maxGuru = 6;
    let currentGuru = 0;
    const urlParams = new URLSearchParams(window.location.search);
    const mode = (urlParams.get("mode") || "edit").toLowerCase();
    const isReadOnly = mode === "view";
    let prefill = {};
    try {
        const rawPrefill = urlParams.get("prefill");
        if (rawPrefill) {
            prefill = JSON.parse(rawPrefill);
        }
    } catch (e) {
        prefill = {};
    }

    const container = document.getElementById("guru-container");
    const addGuruBtn = document.getElementById("add-guru-btn");
    const saveBtn = document.getElementById("save-btn");
    const editBtn = document.getElementById("edit-btn");
    const statusBox = document.getElementById("read-only-status");

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

    // ===============================
    // LOAD TARIKH & HARI
    // ===============================
    const selectedDate = prefill.tarikh || localStorage.getItem("laporan_tarikh");

    if (selectedDate) {

        // Papar tarikh
        document.getElementById("tarikh").value = selectedDate;

        // Kira hari automatik / guna prefill jika ada
        let hari = prefill.hari || "";
        if (!hari) {
            const dateObj = new Date(selectedDate);
            hari = dateObj.toLocaleDateString("ms-MY", { weekday: "long" });
        }

        document.getElementById("hari").value = hari;
    }

    // ===============================
    // CREATE INPUT BOX
    // ===============================
    function createGuruBox(index, removable = false, value = "") {

        const wrapper = document.createElement("div");
        wrapper.style.marginBottom = "10px";

        const fieldWrap = document.createElement("div");
        fieldWrap.style.position = "relative";

        const input = document.createElement("input");
        input.setAttribute("list", "guru_list");
        input.id = "guru_" + index;
        input.placeholder = "Nama Guru " + index;
        input.value = value || "";
        input.style.paddingRight = "36px";

        const arrowBtn = document.createElement("button");
        arrowBtn.type = "button";
        arrowBtn.innerText = "▾";
        arrowBtn.style.position = "absolute";
        arrowBtn.style.right = "0";
        arrowBtn.style.top = "0";
        arrowBtn.style.height = "calc(100% - 10px)";
        arrowBtn.style.width = "34px";
        arrowBtn.style.border = "none";
        arrowBtn.style.borderLeft = "1px solid rgba(0,0,0,0.1)";
        arrowBtn.style.background = "rgba(0,0,0,0.08)";
        arrowBtn.style.color = "#1f3554";
        arrowBtn.style.borderTopRightRadius = "5px";
        arrowBtn.style.borderBottomRightRadius = "5px";
        arrowBtn.style.cursor = "pointer";

        const select = document.createElement("select");
        select.style.position = "absolute";
        select.style.right = "0";
        select.style.top = "0";
        select.style.width = "34px";
        select.style.height = "calc(100% - 10px)";
        select.style.opacity = "0";
        select.style.cursor = "pointer";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Pilih";
        select.appendChild(defaultOption);

        if (typeof NAME_SET !== "undefined" && Array.isArray(NAME_SET)) {
            NAME_SET.forEach(name => {
                const option = document.createElement("option");
                option.value = name;
                option.textContent = name;
                select.appendChild(option);
            });
        }

        const normalize = (s) => (s || "").trim().toLowerCase();

        input.addEventListener("input", function () {
            const typed = normalize(input.value);
            const exact = Array.isArray(NAME_SET)
                ? NAME_SET.find(name => normalize(name) === typed)
                : null;
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
            const exact = Array.isArray(NAME_SET)
                ? NAME_SET.find(name => normalize(name) === normalize(value))
                : null;
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
            removeBtn.style.background = "#c0392b";
            removeBtn.style.color = "white";
            removeBtn.style.marginTop = "5px";
            removeBtn.style.padding = "8px";
            removeBtn.style.border = "none";
            removeBtn.style.borderRadius = "6px";

            removeBtn.onclick = function () {
                container.removeChild(wrapper);
                currentGuru--;
            };

            wrapper.appendChild(removeBtn);
        }

        return wrapper;
    }

    // ===============================
    // INIT INPUT BOX
    // ===============================
    const savedGuru = prefill.guru && typeof prefill.guru === "object"
        ? Object.values(prefill.guru).filter(Boolean)
        : [];

    const initialCount = Math.max(5, Math.min(maxGuru, savedGuru.length || 5));
    currentGuru = initialCount;

    for (let i = 1; i <= initialCount; i++) {
        const isRemovable = i > 5;
        const value = savedGuru[i - 1] || "";
        container.appendChild(createGuruBox(i, isRemovable, value));
    }

    // ===============================
    // ADD BOX (HANYA BOX KE-6 BOLEH BUANG)
    // ===============================
    window.addBox = function () {
        if (isReadOnly) return;

        if (currentGuru >= maxGuru) return;

        currentGuru++;

        container.appendChild(createGuruBox(currentGuru, true));
    };

    // ===============================
    // LOAD NAME SET
    // ===============================
    const datalist = document.getElementById("guru_list");

    if (typeof NAME_SET !== "undefined") {
        NAME_SET.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            datalist.appendChild(option);
        });
    }

    // ===============================
    // LOAD MINGGU LIST
    // ===============================
    const mingguSelect = document.getElementById("minggu");

    if (typeof MINGGU_LIST !== "undefined") {
        MINGGU_LIST.forEach(m => {
            const option = document.createElement("option");
            option.value = m;
            option.text = m;
            mingguSelect.appendChild(option);
        });
    }
    if (prefill.minggu) {
        mingguSelect.value = prefill.minggu;
    }
    if (isReadOnly) {
        mingguSelect.disabled = true;
    }

    if (isReadOnly) {
        addGuruBtn.style.display = "none";
        saveBtn.style.display = "none";
        statusBox.style.display = "block";
        editBtn.style.display = "block";
        editBtn.onclick = function () {
            tg.sendData(JSON.stringify({
                type: "request_edit_section",
                section: "guru_bertugas"
            }));
            tg.close();
        };
    }

    // ===============================
    // SUBMIT
    // ===============================
    window.submitData = function () {
        if (isReadOnly) return;

        const guruData = {};
        const requiredMissing = [];

        for (let i = 1; i <= currentGuru; i++) {
            const el = document.getElementById("guru_" + i);
            const value = el ? el.value.trim() : "";

            // Guru 1-5 wajib diisi
            if (i <= 5 && !value) {
                requiredMissing.push(i);
            }

            if (value) {
                guruData["guru_" + i] = value;
            }
        }

        if (requiredMissing.length > 0) {
            alert("Sila lengkapkan Nama Guru 1 hingga Nama Guru 5 sebelum simpan.");
            return;
        }

        const data = {
            type: "section_guru_bertugas",
            data: {
                minggu: mingguSelect.value,
                tarikh: selectedDate,
                hari: document.getElementById("hari").value,
                guru: guruData
            }
        };

        isSubmitted = true;
        disableCloseWarning();
        if (typeof tg.BackButton === "object") {
            tg.BackButton.hide();
        }
        tg.sendData(JSON.stringify(data));
        tg.close();
    };

});
