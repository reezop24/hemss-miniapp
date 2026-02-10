const tg = window.Telegram.WebApp;
tg.ready();

/*
  DATA PAPARAN
  (bot akan inject data sebenar)
*/
const DATA = {
  guru: [],
  minggu: null,
  tarikh: null,
  hari: null,

  kehadiran: {
    TINGKATAN1: [],
    TINGKATAN2: [],
    TINGKATAN3: [],
    TINGKATAN4: [],
    TINGKATAN5: []
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

function q(text) {
  report.innerHTML += `<div class="question">${text}</div>`;
}

function cat(text) {
  report.innerHTML += `<div class="category">${text}</div>`;
}

function ans(text, ok = true) {
  report.innerHTML += `
    <div class="answer ${ok ? "has-data" : "no-data"}">${text}</div>
  `;
}

function empty() {
  ans("~tiada~", false);
}

/* ===== 1. GURU BERTUGAS ===== */

q("1. Kumpulan Guru Bertugas");
DATA.guru.length ? DATA.guru.forEach(n => ans(n)) : empty();

/* ===== 2. MINGGU ===== */

q("2. Minggu");
DATA.minggu ? ans(DATA.minggu) : empty();

/* ===== 3. TARIKH ===== */

q("3. Tarikh");
DATA.tarikh ? ans(DATA.tarikh) : empty();

/* ===== 4. HARI ===== */

q("4. Hari");
DATA.hari ? ans(DATA.hari) : empty();

/* ===== 5. KEHADIRAN MURID ===== */

q("5. Kehadiran Murid");

let totalH = 0;
let totalD = 0;

Object.entries(DATA.kehadiran).forEach(([key, list], i) => {
  cat(`TINGKATAN ${i + 1}`);

  if (!list.length) {
    empty();
    return;
  }

  let h = 0;
  let d = 0;

  list.forEach(k => {
    h += k.hadir;
    d += k.daftar;
    ans(`${k.nama}   ${k.hadir} / ${k.daftar}`);
  });

  const pct = d ? Math.round((h / d) * 100) : 0;

  report.innerHTML += `
    <div class="summary">Jumlah: ${h}/${d}</div>
    <div class="summary">Peratusan: ${pct}%</div>
  `;

  totalH += h;
  totalD += d;
});

const overallPct = totalD ? Math.round((totalH / totalD) * 100) : 0;

report.innerHTML += `
  <div class="overall">
    JUMLAH KESELURUHAN
    <span>${totalH} / ${totalD}</span>
    <span>Peratusan: ${overallPct}%</span>
  </div>
`;

/* ===== 6. KEBERADAAN GURU ===== */

q("6. Keberadaan Guru");

const GROUPS = [
  ["CR / CTR / CRK / MC / Kuarantin", "A"],
  ["Bengkel / Mesyuarat / Taklimat", "B"],
  ["Temujanji / Rawatan", "C"],
  ["Lain-lain", "D"]
];

GROUPS.forEach(([label, key]) => {
  cat(label);

  const list = DATA.keberadaan[key];
  list.length ? list.forEach(n => ans(n)) : empty();
});

/* ===== 7. KOMEN ===== */

q("7. Komen");
DATA.komen ? ans(DATA.komen) : empty();

/* ===== UBAH SEMULA ===== */

document.getElementById("btnEdit").addEventListener("click", () => {
  tg.sendData(JSON.stringify({ action: "edit_bahagian1" }));
  tg.close();
});
