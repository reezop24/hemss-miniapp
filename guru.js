const tg = window.Telegram.WebApp;
tg.expand();

let maxGuru = 6;
let currentGuru = 5;

// =======================
// INIT GURU BOX
// =======================

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

// =======================
// ADD BOX (MAX 6)
// =======================

function addBox() {
    if (currentGuru >= maxGuru) return;

    currentGuru++;

    const container = document.getElementById("guru-container");
    container.appendChild(createGuruBox(currentGuru));
}

// =======================
// LOAD NAMESET
// =======================

function loadNames() {
    const datalist = document.getElementById("guru_list");

    if (typeof NAME_SET === "undefined") {
        console.log("NAME_SET not loaded");
        return;
    }

    NAME_SET.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        datalist.appendChild(option);
    });
}

// =======================
// LOAD MINGGU
// =======================

function loadMinggu() {
    const mingguSelect = document.getElementById("minggu");

    if (typeof MINGGU_LIST === "undefined") {
        console.log("MINGGU_LIST not loaded");
        return;
    }

    MINGGU_LIST.forEach(m => {
        const option = document.createElement("option");
        option.value = m;
        option.text = m;
        mingguSelect.appendChild(option);
    });
}

// =======================
// SUBMIT
// =======================

function submitData() {

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

    tg.sendData(JSON.stringify(data));
}

// =======================
// INIT ALL
// =======================

initGuru();
loadNames();
loadMinggu();
