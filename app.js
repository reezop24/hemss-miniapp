const tg = window.Telegram.WebApp;
tg.ready();

const form = document.getElementById("reportForm");
const btn = document.getElementById("btnSubmit");

/* =========================
   KEHADIRAN MURID
========================= */
const attendanceBody = document.getElementById("attendanceBody");

function addAttendanceRow() {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>
      <select class="tingkatan">
        <option>1</option><option>2</option><option>3</option>
        <option>4</option><option>5</option>
      </select>
    </td>
    <td>
      <select class="kelas">
        <option>Seroja</option><option>Mawar</option><option>Melati</option>
        <option>Teratai</option><option>Kenanga</option>
      </select>
    </td>
    <td>
      <input type="number" class="hadir small" min="0"> /
      <input type="number" class="daftar small" min="0">
    </td>
  `;

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

/* DEFAULT 5 ROW */
for (let i = 0; i < 5; i++) {
  addAttendanceRow();
}

/* =========================
   KEBERADAAN GURU
========================= */
const guruContainer = document.getElementById("guruContainer");
const addRowBtn = document.getElementById("addRow");

addRowBtn.addEventListener("click", () => {
  const row = document.createElement("div");
  row.className = "guru-row";

  row.innerHTML = `
    <select>
      <option>CR</option>
      <option>MC</option>
      <option>Mesyuarat</option>
      <option>Lain-lain</option>
    </select>
    <input placeholder="Nama Guru">
    <button type="button" class="remove-btn">−</button>
  `;

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
