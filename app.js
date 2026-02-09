const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const form = document.getElementById("reportForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    section: "tandas",
    tandas_lelaki: form.tandas_lelaki.value,
    komen: form.komen.value
  };

  tg.sendData(JSON.stringify(data));
  tg.close();
});
