document.addEventListener("DOMContentLoaded", function () {

    const tg = window.Telegram.WebApp;
    tg.expand();

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

    kategoriList.forEach(k => initDefault(k));

    function initDefault(id) {
        addInput(id, false);
        addInput(id, false);
    }

    window.addBox = function(id) {
        addInput(id, true);
    };

    function addInput(sectionId, removable) {
        const section = document.getElementById(sectionId);
        const container = section.querySelector(".container");

        const wrapper = document.createElement("div");

        const input = document.createElement("input");
        input.setAttribute("list", "guru_list");
        input.placeholder = "Nama Guru";

        wrapper.appendChild(input);

        if (removable) {
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

    window.submitData = function () {

        const result = {};

        kategoriList.forEach(k => {
            const section = document.getElementById(k);
            const inputs = section.querySelectorAll("input");

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
    };

});
