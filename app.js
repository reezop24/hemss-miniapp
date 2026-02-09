const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// === SECTION BUTTON ===
document.querySelectorAll(".section-list button").forEach(btn => {
  btn.addEventListener("click", () => {
    const section = btn.dataset.section;

    tg.sendData(JSON.stringify({
      action: "OPEN_SECTION",
      section: section
    }));
  });
});

// === SEMAK LAPORAN PENUH ===
document.getElementById("btn-full").onclick = () => {
  tg.sendData(JSON.stringify({
    action: "VIEW_FULL_REPORT"
  }));
};

// === TUTUP MINI APP → BALIK BOT ===
document.getElementById("btn-close").onclick = () => {
  tg.close();
};
