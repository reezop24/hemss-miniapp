const tg = window.Telegram.WebApp;
tg.ready();

/*
  DATA INI = DATA PAPARAN
  Bot akan parse raw message → bentuk DATA ni
*/
const DATA = {
  guru: [],
  minggu: null,
  tarikh: null,
  hari: null,

  kehadiran: {
    T1: [],
    T2: [],
    T3: [],
    T4: [],
    T5: []
  },

  keberadaan: {
    A: [],
    B: [],
    C: [],
    D: []
  },

  komen: null
};

const report = document.getElementById("report");

/* ===== HELPER ===== */

function question(title) {
  report.innerHTML += `<div class="view-question">${title}</div>`;
}

function answer(text, hasData = true) {
  const cls = hasData ? "view-answer has-data" : "view-answer no-data";
  report.innerHTML += `<div class="${cls}">${text}</div>`;
}

function empty() {
  report.innerHTML += `<div class="view-answer no-data">~tiada~</div>`;
}

/* ===== 1. GURU BERTUGAS ===== */

question("1. Kumpulan Guru Bertugas");
if (DATA.guru.length) {
  DATA.guru.forEach(n => answer(n));
} else {
  empty();
}

/* ===== 2. MINGGU ===== */

question("2. Minggu");
DATA.minggu ? answer(DATA.minggu) : empty();

/* ===== 3. TARIKH ===== */

question("3. Tarikh");
DATA.tarikh ? answer(DATA.tarikh) : empty();

/* ===== 4. HARI ===== */

question("4. Hari");
DATA.hari ? answer(DATA.hari) : empty();

/* ===== 5. KEHADIRAN MURID ===== */

question("5. Kehadiran Murid");

let totalH = 0;
let totalD = 0;

Object.entries(DATA.kehadiran).forEach(([tingkatan, list]) => {
  report.innerHTML += `<div class="view-category">${tingkatan}</div>`;

  if (!list.length) {
    empty();
    return;
  }

  let h = 0;
  let d = 0;

  list.forEach(k => {
    h += k.hadir;
    d += k.daftar;
    answer(`${k.nama}  ${k.hadir} / ${k.daftar}`);
  });

  const pct = d ? Math.round((h / d) * 100) : 0;
  report.innerHTML += `<div class="view-summary">Jumlah: ${h}/${d} · ${pct}%</div>`;

  totalH += h;
  totalD += d;
});

const overallPct = totalD ? Math.round((totalH / totalD) * 100) : 0;
report.innerHTML += `
  <div class="overall-summary">
    Jumlah Keseluruhan
    <span>${totalH} / ${totalD} (${overallPct}%)</span>
  </div>
`;

/* ===== 6. KEBERADAAN GURU ===== */

question("6. Keberadaan Guru");

const GROUPS = [
  ["CR / CTR / CRK / MC / Kuarantin", "A"],
  ["Bengkel / Mesyuarat / Taklimat", "B"],
  ["Temujanji / Rawatan", "C"],
  ["Lain-lain", "D"]
];

GROUPS.forEach(([label, key]) => {
  report.innerHTML += `<div class="view-category">${label}</div>`;

  const list = DATA.keberadaan[key];
  if (!list.length) {
    empty();
  } else {
    list.forEach(n => answer(`- ${n}`));
  }
});

/* ===== 7. KOMEN ===== */

question("7. Komen");
DATA.komen ? answer(DATA.komen) : empty();

/* ===== UBAH SEMULA ===== */

document.getElementById("btnEdit").addEventListener("click", () => {
  tg.sendData(JSON.stringify({ action: "edit_bahagian1" }));
  tg.close();
});
