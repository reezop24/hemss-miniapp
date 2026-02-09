// ===============================
// HEMSS MINI APP - app.js (FINAL)
// ===============================

const tg = window.Telegram.WebApp;
tg.ready(); // ❗ JANGAN expand

const form = document.getElementById("reportForm");
const btn = document.getElementById("btnSubmit");

// =============================
// KEBERADAAN GURU - ADD / REMOVE ROW
// =============================

document.addEventListener("click", (e) => {
  // ADD ROW
  if (e.target.classList.contains("add-btn")) {
    const container = e.target.previousElementSibling;
    const row = container.cloneNode(true);

    // reset input
    row.querySelector("input").value = "";

    container.parentNode.insertBefore(row, e.target);
  }

  // REMOVE ROW
  if (e.target.classList.contains("remove-btn")) {
    const row = e.target.closest(".guru-row");
    const allRows = document.querySelectorAll(".guru-row");

    // jangan buang kalau tinggal 1 row
    if (allRows.length > 1) {
      row.remove();
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
