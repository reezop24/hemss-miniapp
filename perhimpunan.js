const tg = window.Telegram.WebApp;
tg.expand();

document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // LOAD NAME_SET (GURU)
    // =========================
    const guruList = document.getElementById("guru_list");

    if (typeof NAME_SET !== "undefined") {
        NAME_SET.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            guruList.appendChild(option);
        });
    }

    // =========================
    // LOAD NAME_PENTADBIR
    // =========================
    const pentadbirList = document.getElementById("pentadbir_list");

    if (typeof NAME_PENTADBIR !== "undefined") {
        NAME_PENTADBIR.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            pentadbirList.appendChild(option);
        });
    }

    // Default 1 ruang ucapan untuk setiap bahagian
    addKomen("pentadbir", false);
    addKomen("guru", false);

});


/* =========================
   TAMBAH / BUANG KOMEN
========================= */
function addKomen(type, removable = true) {

    const container = document.getElementById(
        type === "pentadbir" ? "komen_pentadbir" : "komen_guru"
    );

    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "10px";

    const textarea = document.createElement("textarea");
    textarea.placeholder = "Ucapan";

    wrapper.appendChild(textarea);

    if (removable) {
        const removeBtn = document.createElement("button");
        removeBtn.innerText = "Buang";
        removeBtn.className = "remove-btn";
        removeBtn.onclick = function () {
            wrapper.remove();
        };
        wrapper.appendChild(removeBtn);
    }

    container.appendChild(wrapper);
}


/* =========================
   SUBMIT DATA
========================= */
function submitPerhimpunan() {

    const namaPentadbir = document.getElementById("nama_pentadbir").value;
    const namaGuru = document.getElementById("nama_guru").value;
    const namaPelapor = document.getElementById("nama_pelapor").value;

    const komenPentadbir = [];
    document.querySelectorAll("#komen_pentadbir textarea")
        .forEach(t => {
            if (t.value.trim()) {
                komenPentadbir.push(t.value.trim());
            }
        });

    const komenGuru = [];
    document.querySelectorAll("#komen_guru textarea")
        .forEach(t => {
            if (t.value.trim()) {
                komenGuru.push(t.value.trim());
            }
        });

    tg.sendData(JSON.stringify({
        type: "section_perhimpunan",
        data: {
            pentadbir: {
                nama: namaPentadbir,
                komen: komenPentadbir
            },
            guru_bertugas: {
                nama: namaGuru,
                komen: komenGuru
            },
            pelapor: namaPelapor
        }
    }));

    tg.close();
}
