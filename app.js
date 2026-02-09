// ===============================
// HEMSS MINI APP - app.js (FINAL)
// ===============================

const tg = window.Telegram.WebApp;
tg.ready(); // ❗ JANGAN expand

const form = document.getElementById("reportForm");
const btn = document.getElementById("btnSubmit");

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
