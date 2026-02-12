document.addEventListener("DOMContentLoaded", function () {

    const tg = window.Telegram?.WebApp;

    if (!tg) {
        alert("Telegram WebApp tidak dikesan.");
        return;
    }

    tg.expand();

    let maxGuru = 6;
    let currentGuru = 5;

    const container = document.getElementById("guru-container");

    /* =========================
       CREATE INPUT BOX
    ========================== */
    function createGuruBox(index) {
        const wrapper = document.createElement("div");
        wrapper.style.marginBottom = "10px";

        const input = document.createElement("input");
        input.setAttribute("list", "guru_list");
        input.id = "guru_" + index;
        input.placeholder = "Nama Guru " + index;

        wrapper.appendChild(input);

        if (index > 5) {
            const removeBtn = document.createElement("button");
            removeBtn.innerText = "Buang";
            removeBtn.className = "secondary";
            removeBtn.style.marginTop = "5px";

            removeBtn.onclick = function () {
                container.removeChild(wrapper);
                currentGuru--;
            };

            wrapper.appendChild(removeBtn);
        }

        return wrapper;
    }

    /* =========================
       INIT 5 DEFAULT BOX
    ========================== */
    function initGuru() {
        for (let i = 1; i <= 5; i++) {
            container.appendChild(createGuruBox(i));
        }
    }

    /* =========================
       ADD BOX
    ========================== */
    window.addBox = function () {
        if (currentGuru >= maxGuru) return;

        currentGuru++;
        container.appendChild(createGuruBox(currentGuru));
    };

    /* =========================
       LOAD NAME LIST
    ========================== */
    function loadNames() {
        const datalist = document.getElementById("guru_list");

        if (typeof NAME_SET === "undefined") {
            console.log("NAME_SET tak load");
            return;
        }

        NAME_SET.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            datalist.appendChild(option);
        });
    }

    /* =========================
       LOAD MINGGU
    ========================== */
    function loadMinggu() {
        const mingguSelect = document.getElementById("minggu");

        if (typeof MINGGU_LIST === "undefined") {
            console.log("MINGGU_LIST tak load");
            return;
        }

        MINGGU_LIST.forEach(m => {
            const option = document.createElement("option");
            option.value = m;
            option.text = m;
            mingguSelect.appendChild(option);
        });
    }

    /* =========================
       LOAD TARIKH & HARI
    ========================== */
    function setTarikhHari() {

        const savedDate = localStorage.getItem("laporan_tarikh");

        if (!savedDate) return;

        const dateObj = new Date(savedDate);

        const hari = dateObj.toLocaleDateString("ms-MY", {
            weekday: "long"
        });

        document.getElementById("tarikh").value = savedDate;
        document.getElementById("hari").value = hari;
    }

    /* =========================
       SUBMIT
    ========================== */
    window.submitData = function () {

        const guruData = [];

        for (let i = 1; i <= currentGuru; i++) {
            const el = document.getElementById("guru_" + i);
            if (el && el.value.trim() !== "") {
                guruData.push(el.value.trim());
            }
        }

        const data = {
            type: "section_guru_bertugas",
            data: {
                minggu: document.getElementById("minggu").value,
                tarikh: document.getElementById("tarikh").value,
                hari: document.getElementById("hari").value,
                guru: guruData
            }
        };

        tg.sendData(JSON.stringify(data));
    };

    /* =========================
       INIT ALL
    ========================== */
    initGuru();
    loadNames();
    loadMinggu();
    setTarikhHari();

});
