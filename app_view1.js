const tg = window.Telegram.WebApp;
tg.ready();

/*
  DATA AKAN DATANG DARI DB / MESSAGE LAMA
  — buat masa ni biar kosong untuk test "~tiada~"
*/
const DATA = {
  guru: [],
  minggu: null,
  tarikh: null,
  hari: null,

  kehadiran: {
    Tingkatan 1: [],
    Tingkatan 2: [],
    Tingkatan 3: [],
    Tingkatan 4: [],
    Tingkatan 5: []
  },

  keberadaan: {
    A: [],
    B: [],
    C: [],
    D: []
  }
};

const report = document.getElementById("report");

/* =========================
   HELPER
========================= */

function renderQuestion(title) {
  report.innerHTML += `<div class="view-question">${title}</div>`;
}

function renderAnswers(list) {
  if (!list || list.length === 0) {
    report.innerHTML += `<div class="view-empty">~tiada~</div>`;
    return;
  }

  list.forEach(item => {
    report.innerHTML += `<div class="view-answer">${item}</div>`;
  });
}

/* =========================
   1–4: MAKLUMAT ASAS
========================= */

renderQuestion("1. Kumpulan Guru Bertugas");
renderAnswers(DATA.guru);

renderQuestion("2. Minggu");
renderAnswers(DATA.minggu ? [DATA.minggu] : []);

renderQuestion("3. Tarikh");
renderAnswers(DATA.tarikh ? [DATA.tarikh] : []);

renderQuestion("4. Hari");
renderAnswers(DATA.hari ? [DATA.hari] : []);

/* =========================
   5. KEHADIRAN MURID
========================= */

renderQuestion("5. Kehadiran Murid");

let totalHadir = 0;
let totalDaftar = 0;

Object.entries(DATA.kehadiran).forEach(([tingkatan, kelasList]) => {
  report.innerHTML += `<div class="view-answer"><strong>${tingkatan}</strong></div>`;

  if (!kelasList || kelasList.length === 0) {
    report.innerHTML += `<div class="view-empty">~tiada~</div>`;
    return;
  }

  let h = 0;
  let d = 0;

  kelasList.forEach(k => {
    h += k.hadir;
    d += k.daftar;

    report.innerHTML += `
      <div class="view-answer">
        ${k.nama} — ${k.hadir} / ${k.daftar}
      </div>
    `;
  });

  const peratus = d ? Math.round((h / d) * 100) : 0;

  report.innerHTML += `
    <div class="view-summary">
      Jumlah: ${h}/${d} · ${peratus}%
    </div>
  `;

  totalHadir += h;
  totalDaftar += d;
});

/* ===== JUMLAH KESELURUHAN ===== */

const overallPercent = totalDaftar
  ? Math.round((totalHadir / totalDaftar) * 100)
  : 0;

report.innerHTML += `
  <div class="overall-summary">
    Jumlah Keseluruhan
    <span class="answer">
      ${totalHadir} / ${totalDaftar} (${overallPercent}%)
    </span>
  </div>
`;

/* =========================
   6. KEBERADAAN GURU
========================= */

renderQuestion("6. Keberadaan Guru");

const GROUPS = [
  ["CR / CTR / CRK / MC / Kuarantin", "A"],
  ["Bengkel / Mesyuarat / Taklimat", "B"],
  ["Temujanji / Rawatan", "C"],
  ["Lain-lain", "D"]
];

GROUPS.forEach(([label, key]) => {
  report.innerHTML += `<div class="view-answer"><strong>${label}</strong></div>`;

  const list = DATA.keberadaan[key];
  if (!list || list.length === 0) {
    report.innerHTML += `<div class="view-empty">~tiada~</div>`;
  } else {
    list.forEach(name => {
      report.innerHTML += `<div class="view-answer">- ${name}</div>`;
    });
  }
});

/* =========================
   BUTANG UBAH SEMULA
========================= */

document.getElementById("btnEdit").addEventListener("click", () => {
  tg.sendData(JSON.stringify({
    action: "edit_bahagian1"
  }));
  tg.close();
});
