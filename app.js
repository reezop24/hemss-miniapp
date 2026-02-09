const tg = window.Telegram.WebApp;
tg.expand();

document.getElementById("reportForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  // HANTAR KE BOT
  tg.sendData(JSON.stringify({
    section: "tandas",
    answers: data
  }));
});
