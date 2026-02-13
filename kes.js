const tg = window.Telegram.WebApp;
tg.expand();

document.addEventListener("DOMContentLoaded", function () {

    // load nama guru
    const datalist = document.getElementById("guru_list");

    if (typeof NAME_SET !== "undefined") {
        NAME_SET.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            datalist.appendChild(option);
        });
    }

    addKes(); // default 1 kes
});

function addKes() {

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
        <button class="btn btn-add btn-small" onclick="addPelajar(this)">+ Tambah Nama</button>

        <label>Keterangan Kejadian</label>
        <div class="keterangan_container"></div>
        <button class="btn btn-add btn-small" onclick="addKeterangan(this)">+ Tambah Keterangan</button>

        <button class="btn btn-remove" onclick="this.parentElement.remove()">Buang Laporan</button>
    `;

    container.appendChild(wrapper);

    // default 1 pelajar & 1 keterangan
    addPelajar(wrapper.querySelector(".btn-small"));
    addKeterangan(wrapper.querySelectorAll(".btn-small")[1]);
}

function addPelajar(btn) {

    const container = btn.parentElement.querySelector(".pelajar_container");

    const input = document.createElement("input");
    input.placeholder = "Nama Pelajar";

    container.appendChild(input);
}

function addKeterangan(btn) {

    const container = btn.parentElement.querySelector(".keterangan_container");

    const textarea = document.createElement("textarea");
    textarea.placeholder = "Keterangan kejadian";

    container.appendChild(textarea);
}

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
