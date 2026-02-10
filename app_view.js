// ===============================
// HEMSS MINI APP - VIEW MODE
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram.WebApp;
  tg.ready();

  const btnEdit = document.getElementById("btnEdit");

  btnEdit.addEventListener("click", () => {
    tg.sendData(JSON.stringify({
      action: "request_reset",
      section: "bahagian1"
    }));

    tg.close();
  });
});
