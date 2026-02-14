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
});

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

function submitKantin() {
    const namaPelapor = document.querySelector("input[list='guru_list']").value;

    const komen = [];
    document.querySelectorAll("#komen_kantin textarea").forEach(t => {
        if (t.value.trim()) {
            komen.push(t.value.trim());
        }
    });

    tg.sendData(JSON.stringify({
        type: "section_kantin",
        data: {
            pelapor: namaPelapor,
            komen: komen
        }
    }));

    tg.close();
}
