// ===============================
// HEMSS MINI APP - view1.js
// READ ONLY MODE
// ===============================

const tg = window.Telegram.WebApp;
tg.ready();

// ⛔ DATA DATANG DARI CHAT (sendData sebelum ni)
const payload = tg.initDataUnsafe?.query?.data
  ? JSON.parse(tg.initDataUnsafe.query.data)
  : null;

const container = document.getElementById("reportContent");
const btnEdit = document.getElementById("btnEdit");

if (!payload || !payload.data) {
  container.innerHTML = `<div class="answer-muted">Tiada data untuk dipaparkan.</div>`;
} else {
  renderReport(payload.data);
}

function renderReport(data) {
  container.innerHTML = "";

  addSection("Kumpulan Guru Bertugas", [
    data.guru1,
    data.guru2,
    data.guru3,
    data.guru4,
    data.guru5
  ]);

  addDivider();

  addSimple("Minggu", data.minggu);
  addSimple("Tarikh", data.tarikh);
  addSimple("Hari", data.hari);

  addDivider();

  addSection("Kehadiran Murid", data.kehadiran_summary || []);

  addDivider();

  addSection("Keberadaan Guru", data.keberadaan || []);

  if (data.komen) {
    addDivider();
    addSimple("Komen", data.komen);
  }
}

function addSimple(title, value) {
  if (!value) return;

  container.innerHTML += `
    <div class="section">
      <div class="question">${title}</div>
      <div class="answer">${value}</div>
    </div>
  `;
}

function addSection(title, list) {
  if (!list || list.length === 0) return;

  let html = `
    <div class="section">
      <div class="question">${title}</div>
  `;

  list.forEach(item => {
    if (item) {
      html += `<div class="answer">${item}</div>`;
    }
  });

  html += `</div>`;
  container.innerHTML += html;
}

function addDivider() {
  container.innerHTML += `<div class="divider"></div>`;
}

// ===============================
// BUTANG UBah Semula
// ===============================
btnEdit.addEventListener("click", () => {
  tg.sendData(JSON.stringify({
    action: "request_edit",
    section: "bahagian1"
  }));
  tg.close();
});
