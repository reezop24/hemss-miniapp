document.addEventListener("DOMContentLoaded", function () {
  const tg = window.Telegram.WebApp;
  tg.expand();
  if (typeof tg.ready === "function") {
    tg.ready();
  }

  const tarikhEl = document.getElementById("tarikh");
  const sesiEl = document.getElementById("sesi");
  const searchBtn = document.getElementById("searchBtn");

  searchBtn.addEventListener("click", function () {
    const dateValue = (tarikhEl.value || "").trim();
    const sesiValue = (sesiEl.value || "").trim().toUpperCase();

    if (!dateValue || !sesiValue) {
      alert("Sila pilih tarikh dan sesi.");
      return;
    }

    tg.sendData(JSON.stringify({
      type: "admin_date_log_lookup",
      date: dateValue,
      sesi: sesiValue
    }));

    tg.close();
  });
});
