document.addEventListener("DOMContentLoaded", function () {
  const tg = window.Telegram.WebApp;
  tg.expand();
  if (typeof tg.ready === "function") {
    tg.ready();
  }

  const tarikhEl = document.getElementById("tarikh");
  const sesiEl = document.getElementById("sesi");
  const searchBtn = document.getElementById("searchBtn");
  const resultEmpty = document.getElementById("resultEmpty");
  const resultBox = document.getElementById("resultBox");
  const resultName = document.getElementById("resultName");
  const resultMeta = document.getElementById("resultMeta");
  const releaseBtn = document.getElementById("releaseBtn");

  let activeMatch = null;

  function loadPayload() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("data");
    if (!raw) return { rows: [] };

    try {
      return JSON.parse(raw);
    } catch (err) {
      console.error("Date log parse error:", err);
      return { rows: [] };
    }
  }

  const payload = loadPayload();
  const rows = Array.isArray(payload.rows) ? payload.rows : [];

  function hideResult(message) {
    activeMatch = null;
    resultBox.style.display = "none";
    resultEmpty.style.display = "block";
    resultEmpty.textContent = message;
  }

  function showResult(item) {
    activeMatch = item;
    resultEmpty.style.display = "none";
    resultBox.style.display = "block";
    resultName.textContent = item.owner_name || "Tidak Diketahui";
    resultMeta.innerHTML =
      `User ID: ${item.owner_id || "-"}<br>` +
      `Tarikh: ${item.date || "-"}<br>` +
      `Sesi: ${item.sesi || "-"}<br>` +
      `Lock: ${item.lock_level || "-"}`;
  }

  searchBtn.addEventListener("click", function () {
    const dateValue = (tarikhEl.value || "").trim();
    const sesiValue = (sesiEl.value || "").trim().toUpperCase();

    if (!dateValue || !sesiValue) {
      alert("Sila pilih tarikh dan sesi.");
      return;
    }

    const match = rows.find(function (item) {
      return item.date === dateValue && item.sesi === sesiValue;
    });

    if (!match) {
      hideResult("Tiada lock aktif dijumpai untuk tarikh dan sesi ini.");
      return;
    }

    showResult(match);
  });

  releaseBtn.addEventListener("click", function () {
    if (!activeMatch) {
      hideResult("Tiada lock aktif dijumpai untuk dilepaskan.");
      return;
    }

    const confirmed = window.confirm(
      `Lepaskan lock untuk ${activeMatch.date} ${activeMatch.sesi}?\n\nPemilik semasa: ${activeMatch.owner_name || "Tidak Diketahui"}`
    );
    if (!confirmed) {
      return;
    }

    tg.sendData(JSON.stringify({
      type: "admin_release_report_lock",
      report_id: activeMatch.report_id,
      date: activeMatch.date,
      sesi: activeMatch.sesi
    }));

    tg.close();
  });
});
