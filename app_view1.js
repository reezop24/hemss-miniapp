const tg = window.Telegram.WebApp;
tg.ready();

/*
  MOCK DATA
  — nanti kau ganti terus dengan data dari DB (message lama)
*/
const DATA = {
  guru: ["Ahmad Zaki", "Siti Aisyah"],
  minggu: "Minggu 2",
  tarikh: "10/02/2026",
  hari: "Isnin",

  kehadiran: {
    Tingkatan 1: { kelas: [{ nama: "Seroja", hadir: 30, daftar: 32 }] },
    TIngkatan 2: { kelas: [] },
    Tingkatan 3: { kelas: [{ nama: "Melati", hadir: 28, daftar: 30 }] },
    Tingkatan 4: { kelas: [] },
    Tingkatan 5: { kelas: [] }
  },

  keberadaan: {
    A: [],
    B: ["Faizal Hakim"],
    C: [],
    D: []
  }
};

const report = document.getElementById("report");

/* =====================
   SOALAN 1–4
===================== */

function q(title, answers) {
  report.innerHTML += `<div class="view-question">${title}</div>`;
  if (!answers || answers.length === 0) {
    report.innerHTML += `<div class="view-empty">~tiada~</div>`;
  } else {
    answers.forEach(a => {
      report.innerHTML += `<div class="view-answer">${a}</div>`;
    });
  }
}

q("1. Kumpulan Guru Bertugas", DATA.guru);
q("2. Minggu", [DATA.minggu]);
q("3. Tarikh", [DATA.tarikh]);
q("4. Hari", [DATA.hari]);

/* =====================
   SOALAN 5 – KEHADIRAN
===================== */

report.innerHTML += `<div class="view-question">5. Kehadiran Murid</div>`;

let totalH = 0, totalD = 0;

["T1","T2","T3","T4","T5"].forEach(t => {
  const info = DATA.kehadiran[t];
  report.innerHTML += `<div class="view-answer"><strong>${t}</strong></div>`;

  if (info.kelas.length === 0) {
    report.innerHTML += `<div class="view-empty">~tiada~</div>`;
  } else {
    let h = 0, d = 0;
    info.kelas.forEach(k => {
      h += k.hadir;
      d += k.daftar;
      report.innerHTML += `
        <div class="view-answer">
          ${k.nama} — ${k.hadir} / ${k.daftar}
        </div>`;
    });
    const p = d ? Math.round(h/d*100) : 0;
    report.innerHTML += `<div class="view-summary">Jumlah: ${h}/${d} · ${p}%</div>`;
    totalH += h;
    totalD += d;
  }
});

report.innerHTML += `
  <div class="view-total">
    <strong>Jumlah Keseluruhan</strong><br>
    ${totalH} / ${totalD} (${totalD ? Math.round(totalH/totalD*100) : 0}%)
  </div>`;

/* =====================
   SOALAN 6 – KEBERADAAN
===================== */

const GROUPS = [
  ["CR / CTR / CRK / MC / Kuarantin", "A"],
  ["Bengkel / Mesyuarat / Taklimat", "B"],
  ["Temujanji / Rawatan", "C"],
  ["Lain-lain", "D"]
];

report.innerHTML += `<div class="view-question">6. Keberadaan Guru</div>`;

GROUPS.forEach(([label, key]) => {
  report.innerHTML += `<div class="view-answer"><strong>${label}</strong></div>`;
  const list = DATA.keberadaan[key];
  if (!list || list.length === 0) {
    report.innerHTML += `<div class="view-empty">~tiada~</div>`;
  } else {
    list.forEach(n => {
      report.innerHTML += `<div class="view-answer">- ${n}</div>`;
    });
  }
});

/* =====================
   BUTANG UBAH SEMULA
===================== */

document.getElementById("btnEdit").addEventListener("click", () => {
  tg.sendData(JSON.stringify({
    action: "edit_bahagian1"
  }));
  tg.close();
});
