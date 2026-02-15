document.addEventListener("DOMContentLoaded", function () {
  const tg = window.Telegram.WebApp;
  tg.expand();

  const tarikhInput = document.getElementById("tarikh");
  const sesiInput = document.getElementById("sesi");
  const btnCari = document.getElementById("btnCari");

  const historyList = document.getElementById("historyList");
  const emptyHistory = document.getElementById("emptyHistory");

  function loadHistoryFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("history");
    if (!raw) return [];

    try {
      return JSON.parse(raw);
    } catch (err) {
      console.error("History parse error:", err);
      return [];
    }
  }

  function renderHistory(items) {
    historyList.innerHTML = "";

    if (!Array.isArray(items) || items.length === 0) {
      emptyHistory.style.display = "block";
      return;
    }

    emptyHistory.style.display = "none";

    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "history-item";

      const date = item.date || "-";
      const sesi = item.sesi || "-";
      const owner = item.owner_name || "Tidak Diketahui";
      const generatedAt = item.generated_at || "-";

      li.innerHTML =
        `<strong>${date} (${sesi})</strong><br>` +
        `👤 ${owner}<br>` +
        `<span style="opacity:.82">Diterima: ${generatedAt}</span>`;

      historyList.appendChild(li);
    });
  }

  btnCari.addEventListener("click", function () {
    const tarikh = tarikhInput.value;
    const sesi = sesiInput.value;

    if (!tarikh || !sesi) {
      alert("Sila pilih tarikh dan sesi.");
      return;
    }

    tg.sendData(JSON.stringify({
      type: "galeri_laporan",
      date: tarikh,
      sesi: sesi
    }));

    tg.close();
  });

  renderHistory(loadHistoryFromQuery());
});
