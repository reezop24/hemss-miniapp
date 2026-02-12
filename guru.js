document.addEventListener("DOMContentLoaded", function () {

    const tg = window.Telegram?.WebApp;

    if (!tg) {
        alert("Telegram WebApp tidak dikesan.");
        return;
    }

    tg.expand();

    const maxGuru = 6;
    let currentGuru = 5;

    const container = document.getElementById("guru-container");

    // ===============================
    // LOAD TARIKH & HARI
    // ===============================
    const selectedDate = localStorage.getItem("laporan_tarikh");

    if (selectedDate) {

        // Papar tarikh
        document.getElementById("tarikh").value = selectedDate;

        // Kira hari automatik
        const dateObj = new Date(selectedDate);
        const hari = dateObj.toLocaleDateString("ms-MY", { weekday: "long" });

        document.getElementById("hari").value = hari;
    }

    // ===============================
    // CREATE INPUT BOX
    // ===============================
    function createGuruBox(index, removable = false) {

        const wrapper = document.createElement("div");
        wrapper.style.marginBottom = "10px";

        const input = document.createElement("input");
        input.setAttribute("list", "guru_list");
        input.id = "guru_" + index;
        input.placeholder = "Nama Guru " + index;

        wrapper.appendChild(input);

        if (removable) {
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
    // INIT 5 DEFAULT (NO BUANG)
    // ===============================
    for (let i = 1; i <= 5; i++) {
        container.appendChild(createGuruBox(i, false));
    }

    // ===============================
    // ADD BOX (HANYA BOX KE-6 BOLEH BUANG)
    // ===============================
    window.addBox = function () {

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

    // ===============================
    // SUBMIT
    // ===============================
    window.submitData = function () {

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
