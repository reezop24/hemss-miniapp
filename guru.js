document.addEventListener("DOMContentLoaded", function () {

    const tg = window.Telegram?.WebApp;

    if (!tg) {
        alert("Telegram WebApp tidak dikesan.");
        return;
    }

    tg.expand();

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

        const input = document.createElement("input");
        input.setAttribute("list", "guru_list");
        input.id = "guru_" + index;
        input.placeholder = "Nama Guru " + index;
        input.value = value || "";
        if (isReadOnly) {
            input.disabled = true;
        }

        wrapper.appendChild(input);

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

        for (let i = 1; i <= currentGuru; i++) {
            const el = document.getElementById("guru_" + i);
            if (el && el.value) {
                guruData["guru_" + i] = el.value;
            }
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

        tg.sendData(JSON.stringify(data));
        tg.close();
    };

});
