const tg = window.Telegram.WebApp;
tg.expand();

/* =========================
   LOAD NAME SET (DATALIST)
========================= */

document.addEventListener("DOMContentLoaded", function () {

    const datalist = document.getElementById("guru_list");

    if (typeof NAME_SET !== "undefined") {
        NAME_SET.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            datalist.appendChild(option);
        });
    }
});


const OPTION = ["", "Memuaskan", "Kurang memuaskan"];

function createDropdown(label) {

    const wrapper = document.createElement("div");

    const title = document.createElement("div");
    title.innerText = label;

    const select = document.createElement("select");

    OPTION.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.text = opt === "" ? "- Sila Pilih -" : opt;
        select.appendChild(option);
    });

    wrapper.appendChild(title);
    wrapper.appendChild(select);

    return { wrapper, select };
}

function createUlasanSection() {

    const container = document.createElement("div");

    function addUlasan(removable = true) {
        const wrap = document.createElement("div");

        const textarea = document.createElement("textarea");
        textarea.placeholder = "ULASAN";

        wrap.appendChild(textarea);

        if (removable) {
            const btn = document.createElement("button");
            btn.innerText = "Buang";
            btn.className = "remove-btn";
            btn.onclick = () => wrap.remove();
            wrap.appendChild(btn);
        }

        container.appendChild(wrap);
    }

    const addBtn = document.createElement("button");
    addBtn.innerText = "+ Tambah Ulasan";
    addBtn.className = "add-btn";
    addBtn.onclick = () => addUlasan(true);

    // Default 1 ulasan tanpa butang buang
    addUlasan(false);

    return { container, addBtn };
}

function createBlok(title, fields) {

    const section = document.createElement("div");
    section.className = "section";

    const h3 = document.createElement("h3");
    h3.innerText = title;
    section.appendChild(h3);

    const selects = {};

    fields.forEach(f => {
        const dd = createDropdown(f);
        selects[f] = dd.select;
        section.appendChild(dd.wrapper);
    });

    const ulasan = createUlasanSection();
    section.appendChild(ulasan.container);
    section.appendChild(ulasan.addBtn);

    return { section, selects, ulasan };
}

const container = document.getElementById("container");

const blokT1 = createBlok("BLOK TINGKATAN 1", [
    "Tandas Lelaki",
    "Tandas Perempuan"
]);

const blokBangunan = createBlok("BLOK BANGUNAN BARU", [
    "Tandas Lelaki",
    "Tandas Perempuan"
]);

const blokTengah = createBlok("BLOK TENGAH", [
    "Tandas Lelaki",
    "Tandas Perempuan",
    "Tandas Guru Lelaki",
    "Tandas Guru Perempuan"
]);

container.appendChild(blokT1.section);
container.appendChild(blokBangunan.section);
container.appendChild(blokTengah.section);

function collectBlok(blok) {

    const result = {};

    for (let key in blok.selects) {
        result[key] = blok.selects[key].value;
    }

    result["ulasan"] = [];
    blok.section.querySelectorAll("textarea").forEach(t => {
        if (t.value.trim())
            result["ulasan"].push(t.value.trim());
    });

    return result;
}

function submitTandas() {

    const pelapor =
        document.querySelector("input[list='guru_list']").value;

    tg.sendData(JSON.stringify({
        type: "section_tandas",
        data: {
            pelapor: pelapor,
            blok_t1: collectBlok(blokT1),
            blok_bangunan_baru: collectBlok(blokBangunan),
            blok_tengah: collectBlok(blokTengah)
        }
    }));

    tg.close();
}
