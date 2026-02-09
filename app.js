const tg = window.Telegram.WebApp;
tg.ready();

const form = document.getElementById("reportForm");
const btn = document.getElementById("btnSubmit");

/* =========================
   KEHADIRAN MURID
========================= */
const attendanceBody = document.getElementById("attendanceBody");

function addAttendanceRow() {
  const kelasSelect = document.createElement("select");

PRESET_KELAS.forEach(kelas => {
  const opt = document.createElement("option");
  opt.value = kelas;
  opt.textContent = kelas;
  kelasSelect.appendChild(opt);
});

  attendanceBody.appendChild(row);

  row.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", kiraKehadiran);
  });
}

function kiraKehadiran() {
  let totalHadir = 0;
  let totalDaftar = 0;

  document.querySelectorAll(".hadir").forEach((el, i) => {
    const hadir = parseInt(el.value) || 0;
    const daftar = parseInt(document.querySelectorAll(".daftar")[i].value) || 0;

    totalHadir += hadir;
    totalDaftar += daftar;
  });

  document.getElementById("jumlahHadir").innerText =
    `${totalHadir} / ${totalDaftar}`;

  const peratus = totalDaftar === 0
    ? 0
    : Math.round((totalHadir / totalDaftar) * 100);

  document.getElementById("peratusHadir").innerText = `${peratus}%`;
}

/* DEFAULT 30 ROW (STATIK) */
for (let i = 0; i < 30; i++) {
  addAttendanceRow();
}
/* =========================
   KEBERADAAN GURU
========================= */
const guruContainer = document.getElementById("guruContainer");
const addRowBtn = document.getElementById("addRow");

addRowBtn.addEventListener("click", () => {
  const statusSelect = document.createElement("select");

PRESET_KEBERADAAN.forEach(item => {
  const opt = document.createElement("option");
  opt.value = item;
  opt.textContent = item;
  statusSelect.appendChild(opt);
});

  guruContainer.appendChild(row);
});

guruContainer.addEventListener("click", e => {
  if (e.target.classList.contains("remove-btn")) {
    if (guruContainer.children.length > 1) {
      e.target.parentElement.remove();
    }
  }
});

/* =========================
   SIMPAN LAPORAN
========================= */
btn.addEventListener("click", () => {
  const data = {};

  form.querySelectorAll("input, select, textarea").forEach(el => {
    if (el.value) {
      data[el.name || el.className] = el.value;
    }
  });

  data.jumlah_hadir = document.getElementById("jumlahHadir").innerText;
  data.peratus_hadir = document.getElementById("peratusHadir").innerText;

  tg.sendData(JSON.stringify({
    section: "kehadiran",
    data,
    submitted_at: new Date().toISOString()
  }));

  tg.close();
});
