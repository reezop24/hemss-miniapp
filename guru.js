document.addEventListener("DOMContentLoaded", function () {

    const tg = window.Telegram?.WebApp;

    if (!tg) {
        alert("Telegram WebApp tidak dikesan.");
        return;
    }

    tg.expand();

    let maxGuru = 6;
    let currentGuru = 5;

    function createGuruBox(index) {
        const input = document.createElement("input");
        input.setAttribute("list", "guru_list");
        input.id = "guru_" + index;
        input.placeholder = "Nama Guru " + index;
        return input;
    }

    function initGuru() {
        const container = document.getElementById("guru-container");

        for (let i = 1; i <= 5; i++) {
            container.appendChild(createGuruBox(i));
        }
    }

    window.addBox = function () {
        if (currentGuru >= maxGuru) return;
    
        currentGuru++;
    
        const container = document.getElementById("guru-container");
    
        const wrapper = document.createElement("div");
        wrapper.style.marginBottom = "10px";
    
        const input = createGuruBox(currentGuru);
        wrapper.appendChild(input);
    
        const removeBtn = document.createElement("button");
        removeBtn.innerText = "Buang";
        removeBtn.className = "secondary";
        removeBtn.style.marginTop = "5px";
    
        removeBtn.onclick = function () {
            container.removeChild(wrapper);
            currentGuru--;
        };
    
        wrapper.appendChild(removeBtn);
    
        container.appendChild(wrapper);
    };


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
                minggu: document.getElementById("minggu").value,
                guru: guruData
            }
        };

    function setTarikhHari() {
        const params = new URLSearchParams(window.location.search);
        const date = params.get("date");
        const hari = params.get("hari");
    
        if (date) document.getElementById("tarikh_display").value = date;
        if (hari) document.getElementById("hari_display").value = hari;
    }


        tg.sendData(JSON.stringify(data));
    };
    

    initGuru();
    loadNames();
    loadMinggu();
    setTarikhHari();

});
