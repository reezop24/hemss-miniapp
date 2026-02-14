const tg = window.Telegram.WebApp;
tg.expand();

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

    // 3 default pelajar
    for (let i = 0; i < 3; i++) {
        addPelajar(false);
    }

    // 1 default catatan (tidak boleh buang)
    addCatatan(false);
});


function addPelajar(removable = true) {

    const container = document.getElementById("pelajar_container");

    const wrapper = document.createElement("div");

    const input = document.createElement("input");
    input.className = "input-box";
    input.placeholder = "Nama Pelajar";

    wrapper.appendChild(input);

    if (removable) {
        const btn = document.createElement("button");
        btn.innerText = "Buang";
        btn.className = "btn-remove";
        btn.onclick = function () {
            wrapper.remove();
        };
        wrapper.appendChild(btn);
    }

    container.appendChild(wrapper);
}


function addCatatan(removable = true) {

    const container = document.getElementById("catatan_container");

    const wrapper = document.createElement("div");

    const textarea = document.createElement("textarea");
    textarea.placeholder = "Catatan";

    wrapper.appendChild(textarea);

    if (removable) {
        const btn = document.createElement("button");
        btn.innerText = "Buang";
        btn.className = "btn-remove";
        btn.onclick = function () {
            wrapper.remove();
        };
        wrapper.appendChild(btn);
    }

    container.appendChild(wrapper);
}


function submitPagar() {

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
