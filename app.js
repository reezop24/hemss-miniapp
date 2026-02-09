// =======================================
// HEMSS MINI APP — app.js (FINAL)
// =======================================

// ===============================
// INIT TELEGRAM WEB APP
// ===============================
const tg = window.Telegram.WebApp;

if (!tg) {
  alert("Telegram WebApp tidak dijumpai.");
}

tg.ready();
tg.expand(); // full height

// ===============================
// AMBIL PARAMETER SECTION
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
if (!form || !btnSubmit) {
  alert("Elemen borang tidak lengkap.");
}

// ===============================
// SUBMIT HANDLER (MANUAL)
// ===============================
btnSubmit.addEventListener("click", () => {

  // ===========================
  // KUTIP DATA FORM
  // ===========================
  const formData = {};
  let hasError = false;

  const elements = form.querySelectorAll("input, select, textarea");

  elements.forEach(el => {
    if (!el.name) return;

    const value = el.value.trim();

    // VALIDATION RINGKAS
    if (el.hasAttribute("required") && value === "") {
      el.style.border = "2px solid red";
      hasError = true;
    } else {
      el.style.border = "";
    }

    formData[el.name] = value;
  });

  // ===========================
  // JIKA ADA ERROR → STOP
  // ===========================
  if (hasError) {
    tg.showAlert("Sila lengkapkan semua maklumat wajib.");
    return;
  }

  // ===========================
  // PAYLOAD AKHIR
  // ===========================
  const payload = {
    section: section,
    submitted_at: new Date().toISOString(),
    data: formData
  };

  // ===========================
  // HANTAR KE BOT
  // ===========================
  try {
    tg.sendData(JSON.stringify(payload));
  } catch (err) {
    tg.showAlert("Gagal menghantar data.");
    return;
  }

  // ===========================
  // TUTUP MINI APP
  // ===========================
  tg.close();
});
