// ===============================
// HEMSS MINI APP - app.js
// ===============================

// WAJIB: init Telegram WebApp
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// ===============================
// AMBIL PARAMETER SECTION (URL)
// contoh: ?section=tandas
// ===============================
const params = new URLSearchParams(window.location.search);
const section = params.get("section") || "unknown";

// ===============================
// ELEMENT
// ===============================
const form = document.getElementById("reportForm");
const btnSubmit = document.getElementById("btnSubmit");

// ===============================
// SAFETY CHECK
// ===============================
if (!tg || !tg.sendData) {
  alert("Telegram WebApp tidak dijumpai.");
}

// ===============================
// CLICK HANDLER SAHAJA
// (TIADA form.submit, TIADA auto)
// ===============================
btnSubmit.addEventListener("click", () => {

  // ===========================
  // KUTIP DATA FORM
  // ===========================
  const formData = {};

  // semua input/select/textarea
  const elements = form.querySelectorAll("input, select, textarea");

  elements.forEach(el => {
    if (!el.name) return;
    formData[el.name] = el.value;
  });

  // ===========================
  // PAYLOAD AKHIR
  // ===========================
  const payload = {
    section: section,
    timestamp: new Date().toISOString(),
    data: formData
  };

  // ===========================
  // HANTAR KE BOT
  // ===========================
  tg.sendData(JSON.stringify(payload));

  // ===========================
  // TUTUP MINI APP
  // ===========================
  tg.close();
});
