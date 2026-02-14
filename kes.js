const tg = window.Telegram.WebApp;
tg.expand();

document.addEventListener("DOMContentLoaded", function () {

    const datalist = document.getElementById("guru_list");

    if (typeof NAME_SET !== "undefined") {
        NAME_SET.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            datalist.appendChild(option);
        });
    }

    addKes(false); // default 1 kes (tanpa butang buang)
});


// ===============================
// TAMBAH KES
// ===============================
function addKes(removable = true) {

    const container = document.getElementById("kes_container");

    const wrapper = document.createElement("div");
    wrapper.className = "section";

    wrapper.innerHTML = `
        <h3>Maklumat Kes</h3>

        <label>Jenis Kes</label>
        <select class="jenis">
            <option value="">- Sila Pilih -</option>
            <option value="Disiplin">Disiplin</option>
            <option value="Kemalangan">Kemalangan</option>
            <option value="Bencana">Bencana</option>
        </select>

        <label>Nama Pelajar Terlibat</label>
        <div class="pelajar_container"></div>
        <button class="add-btn btn-small">+ Tambah Nama</button>

        <label>Keterangan Kejadian</label>
        <div class="keterangan_container"></div>
        <button class="add-btn btn-small">+ Tambah Keterangan</button>
    `;

    if (removable) {
        const btnBuang = document.createElement("button");
        btnBuang.className = "remove-btn";
        btnBuang.innerText = "Buang Laporan";
        btnBuang.onclick = function () {
            wrapper.remove();
        };
        wrapper.appendChild(btnBuang);
    }

    container.appendChild(wrapper);

    const btnTambahNama = wrapper.querySelectorAll(".btn-small")[0];
    const btnTambahKeterangan = wrapper.querySelectorAll(".btn-small")[1];
    const btnBuangLaporan = wrapper.querySelector(".remove-btn");

    btnTambahNama.onclick = function () {
        addPelajar(wrapper);
    };

    btnTambahKeterangan.onclick = function () {
        addKeterangan(wrapper);
    };

    if (btnBuangLaporan) {
        btnBuangLaporan.onclick = function () {
            wrapper.remove();
        };
    }

    // default 1 pelajar & 1 keterangan
    addPelajar(wrapper, false);
    addKeterangan(wrapper, false);
}


// ===============================
// TAMBAH / BUANG PELAJAR
// ===============================
function addPelajar(sectionWrapper, removable = true) {

    const container = sectionWrapper.querySelector(".pelajar_container");

    const row = document.createElement("div");

    const input = document.createElement("input");
    input.placeholder = "Nama Pelajar";

    row.appendChild(input);

    if (removable) {
        const removeBtn = document.createElement("button");
        removeBtn.innerText = "Buang";
        removeBtn.className = "remove-btn btn-small";
        removeBtn.style.marginBottom = "10px";

        removeBtn.onclick = function () {
            row.remove();
        };
        row.appendChild(removeBtn);
    }

    container.appendChild(row);
}


// ===============================
// TAMBAH / BUANG KETERANGAN
// ===============================
function addKeterangan(sectionWrapper, removable = true) {

    const container = sectionWrapper.querySelector(".keterangan_container");

    const row = document.createElement("div");

    const textarea = document.createElement("textarea");
    textarea.placeholder = "Keterangan kejadian";

    row.appendChild(textarea);

    if (removable) {
        const removeBtn = document.createElement("button");
        removeBtn.innerText = "Buang";
        removeBtn.className = "remove-btn btn-small";
        removeBtn.style.marginBottom = "10px";

        removeBtn.onclick = function () {
            row.remove();
        };
        row.appendChild(removeBtn);
    }

    container.appendChild(row);
}


// ===============================
// SUBMIT
// ===============================
function submitKes() {

    const pelapor = document.getElementById("pelapor").value;

    const allKes = [];

    document.querySelectorAll("#kes_container .section").forEach(sec => {

        const jenis = sec.querySelector(".jenis").value;

        const pelajar = [];
        sec.querySelectorAll(".pelajar_container input").forEach(i => {
            if (i.value.trim()) pelajar.push(i.value.trim());
        });

        const keterangan = [];
        sec.querySelectorAll(".keterangan_container textarea").forEach(t => {
            if (t.value.trim()) keterangan.push(t.value.trim());
        });

        if (jenis) {
            allKes.push({
                jenis: jenis,
                pelajar: pelajar,
                keterangan: keterangan
            });
        }
    });

    tg.sendData(JSON.stringify({
        type: "section_kes",
        data: {
            pelapor: pelapor,
            senarai_kes: allKes
        }
    }));

    tg.close();
}
