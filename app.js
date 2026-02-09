// ===============================
// HEMSS MINI APP - app.js (FINAL)
// ===============================

const tg = window.Telegram.WebApp;
tg.ready(); // ❗ JANGAN expand

const form = document.getElementById("reportForm");
const btn = document.getElementById("btnSubmit");



// =============================
// KEBERADAAN GURU - ADD / REMOVE ROW (FINAL FIX)
// =============================

document.addEventListener("click", function (e) {

  // TAMBAH BARIS
  if (e.target.classList.contains("add-btn") && e.target.id !== "btnSubmit") {
    const container = document.getElementById("guru-container");
    if (!container) return;

    const firstRow = container.querySelector(".guru-row");
    if (!firstRow) return;

    const newRow = firstRow.cloneNode(true);

    newRow.querySelector("input").value = "";
    newRow.querySelector("select").selectedIndex = 0;

    container.appendChild(newRow);
  }

  // BUANG BARIS
  if (e.target.classList.contains("remove-btn")) {
    const container = document.getElementById("guru-container");
    const rows = container.querySelectorAll(".guru-row");

    if (rows.length > 1) {
      e.target.closest(".guru-row").remove();
    }
  }
});
btn.addEventListener("click", () => {
  const data = {};

  const elements = form.querySelectorAll("input, select, textarea");
  elements.forEach(el => {
    if (el.name) data[el.name] = el.value;
  });

  const payload = {
    section: "tandas",
    data: data,
    submitted_at: new Date().toISOString()
  };

  tg.sendData(JSON.stringify(payload));
  tg.close();
});
