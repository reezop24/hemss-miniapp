alert("JS HIDUP");
const tg = window.Telegram.WebApp;
tg.ready();

console.log("APP JS LOADED");

// ADD / REMOVE ROW
document.addEventListener("click", (e) => {

  if (e.target.classList.contains("add-btn")) {
    const container = document.getElementById("guru-container");
    const firstRow = container.querySelector(".guru-row");
    const clone = firstRow.cloneNode(true);

    clone.querySelector("input").value = "";
    clone.querySelector("select").selectedIndex = 0;

    container.appendChild(clone);
  }

  if (e.target.classList.contains("remove-btn")) {
    const rows = document.querySelectorAll(".guru-row");
    if (rows.length > 1) {
      e.target.closest(".guru-row").remove();
    }
  }
});

// SUBMIT
document.getElementById("btnSubmit").addEventListener("click", () => {
  const form = document.getElementById("reportForm");
  const data = {};

  form.querySelectorAll("input, select, textarea").forEach(el => {
    if (el.name) {
      if (el.name.endsWith("[]")) {
        if (!data[el.name]) data[el.name] = [];
        data[el.name].push(el.value);
      } else {
        data[el.name] = el.value;
      }
    }
  });

  const payload = {
    section: "bahagian1",
    data: data,
    submitted_at: new Date().toISOString()
  };

  console.log(payload);

  tg.sendData(JSON.stringify(payload));
  tg.close();
});
