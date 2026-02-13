const tg = window.Telegram.WebApp;
tg.expand();

/* =========================
   SEARCH NAMA (SAMA STANDARD)
========================= */
document.addEventListener("DOMContentLoaded", function () {

    const tg = window.Telegram.WebApp;
    tg.expand();

    // ===============================
    // LOAD NAME SET → DATALIST
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
    // TAMBAH KOMEN
    // ===============================
    window.addKomen = function () {

        const container = document.getElementById("komen_kantin");

        const wrapper = document.createElement("div");

        const textarea = document.createElement("textarea");
        textarea.placeholder = "Komen Kantin";

        const removeBtn = document.createElement("button");
        removeBtn.innerText = "Buang";
        removeBtn.className = "btn btn-remove";
        removeBtn.onclick = function () {
            wrapper.remove();
        };

        wrapper.appendChild(textarea);
        wrapper.appendChild(removeBtn);

        container.appendChild(wrapper);
    };

    // ===============================
    // SUBMIT
    // ===============================
    window.submitKantin = function () {

        const namaPelapor =
            document.querySelector("input[list='guru_list']").value;

        const komen = [];
        document.querySelectorAll("#komen_kantin textarea")
            .forEach(t => {
                if (t.value.trim())
                    komen.push(t.value.trim());
            });

        tg.sendData(JSON.stringify({
            type: "section_kantin",
            data: {
                pelapor: namaPelapor,
                komen: komen
            }
        }));

        tg.close();
    };

});


/* =========================
   TAMBAH KOMEN
========================= */
function addKomen() {

    const container = document.getElementById("komen_kantin");

    const wrapper = document.createElement("div");

    const textarea = document.createElement("textarea");
    textarea.placeholder = "Komen Kantin";

    const removeBtn = document.createElement("button");
    removeBtn.innerText = "Buang";
    removeBtn.className = "btn btn-remove";
    removeBtn.onclick = function () {
        wrapper.remove();
    };

    wrapper.appendChild(textarea);
    wrapper.appendChild(removeBtn);

    container.appendChild(wrapper);
}


/* =========================
   SUBMIT
========================= */
function submitKantin() {

    const namaPelapor =
        document.querySelector(".nama-search").value;

    const komen = [];
    document.querySelectorAll("#komen_kantin textarea")
        .forEach(t => {
            if (t.value.trim())
                komen.push(t.value.trim());
        });

    tg.sendData(JSON.stringify({
        type: "section_kantin",
        data: {
            pelapor: namaPelapor,
            komen: komen
        }
    }));
}
