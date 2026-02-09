const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const btn = document.getElementById("btnSubmit");
const form = document.getElementById("reportForm");

btn.addEventListener("click", () => {
  const data = {};
  form.querySelectorAll("input, select, textarea").forEach(el => {
    if (el.name) data[el.name] = el.value;
  });

  tg.sendData(JSON.stringify({
    section: "tandas",
    data: data,
    submitted_at: new Date().toISOString()
  }));

  // WAJIB PANGGIL
  tg.close();
});
