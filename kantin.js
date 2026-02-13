const tg = window.Telegram.WebApp;
tg.expand();

/* =========================
   SEARCH NAMA (SAMA STANDARD)
========================= */
function searchNama(inputElement) {

    if (typeof NAME_SET === "undefined") return;

    const keyword = inputElement.value.toLowerCase().trim();

    const oldBox = document.querySelector(".suggestion-box");
    if (oldBox) oldBox.remove();

    if (!keyword) return;

    const filtered = NAME_SET.filter(nama =>
        nama.toLowerCase().includes(keyword)
    );

    if (filtered.length === 0) return;

    const list = document.createElement("div");
    list.className = "suggestion-box";

    list.style.position = "absolute";
    list.style.background = "white";
    list.style.color = "black";
    list.style.borderRadius = "10px";
    list.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
    list.style.maxHeight = "180px";
    list.style.overflowY = "auto";
    list.style.zIndex = "9999";
    list.style.width = inputElement.offsetWidth + "px";

    const rect = inputElement.getBoundingClientRect();
    list.style.left = rect.left + window.scrollX + "px";
    list.style.top = rect.bottom + window.scrollY + "px";

    filtered.slice(0, 10).forEach(nama => {

        const item = document.createElement("div");
        item.style.padding = "10px";
        item.style.cursor = "pointer";
        item.innerText = nama;

        item.onclick = function () {
            inputElement.value = nama;
            list.remove();
        };

        list.appendChild(item);
    });

    document.body.appendChild(list);
}

document.addEventListener("click", function(e) {
    if (!e.target.classList.contains("nama-search")) {
        const box = document.querySelector(".suggestion-box");
        if (box) box.remove();
    }
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
