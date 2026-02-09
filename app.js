const tg = window.Telegram.WebApp;
tg.ready();

const form = document.getElementById("reportForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {};
  form.querySelectorAll("input, select, textarea").forEach(el => {
    if (el.name) data[el.name] = el.value;
  });

  tg.sendData(JSON.stringify({
    section: new URLSearchParams(window.location.search).get("section"),
    data: data
  }));

  tg.close();
});
