// ===============================
// HEMSS MINI APP - app.js (FINAL)
// ===============================

const tg = window.Telegram.WebApp;
tg.ready();

// ===============================
// GLOBAL NAME SEARCH (ALL PAGES)
// ===============================
document.querySelectorAll(".name-search").forEach(input => {
  const listId = "nameset_" + Math.random().toString(36).slice(2);
  const datalist = document.createElement("datalist");
  datalist.id = listId;

  NAME_SET.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    datalist.appendChild(option);
  });

  document.body.appendChild(datalist);
  input.setAttribute("list", listId);
});

// ELEMENT
const form = document.getElementById("reportForm");
const attendanceBody = document.getElementById("attendanceBody");
const jumlahHadirEl = document.getElementById("jumlahHadir");
const peratusHadirEl = document.getElementById("peratusHadir");
const guruContainer = document.getElementById("guruContainer");
const addRowBtn = document.getElementById("addRow");
const btnSubmit = document.getElementById("btnSubmit");
const hariSelect = document.getElementById("hariSelect");

// ---------- INIT HARI ----------
hariSelect.innerHTML = buildOptions(hariList);

// ---------- INIT STATUS ROW PERTAMA ----------
guruContainer.querySelector("select").innerHTML = buildOptions(statusGuruList);

// ---------- CREATE 30 ROW MURID (STATIK) ----------
function createAttendanceRows() {
  attendanceBody.innerHTML = "";

  for (let i = 0; i < 30; i++) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <select name="tingkatan_${i}">
          ${buildOptions(tingkatanList)}
        </select>
      </td>

      <td>
        <select name="kelas_${i}">
          ${buildOptions(kelasList)}
        </select>
      </td>

      <td>
        <div class="attendance-box">
          <input class="small" type="number" name="hadir_${i}">
          /
          <input class="small" type="number" name="daftar_${i}">
        </div>
      </td>
    `;

    attendanceBody.appendChild(tr);
  }
}

// ---------- AUTO KIRA ----------
attendanceBody.addEventListener("input", () => {
  let totalHadir = 0;
  let totalDaftar = 0;

  for (let i = 0; i < 30; i++) {
    const h = Number(form[`hadir_${i}`]?.value || 0);
    const d = Number(form[`daftar_${i}`]?.value || 0);
    totalHadir += h;
    totalDaftar += d;
  }

  jumlahHadirEl.textContent = `${totalHadir} / ${totalDaftar}`;
  peratusHadirEl.textContent =
    totalDaftar > 0 ? `${Math.round((totalHadir / totalDaftar) * 100)}%` : "0%";
});

// ---------- ADD GURU ROW ----------
addRowBtn.addEventListener("click", () => {
  const row = document.createElement("div");
  row.className = "guru-row";

  row.innerHTML = `
    <select name="status[]">
      ${buildOptions(statusGuruList)}
    </select>
    <input name="nama_status[]" placeholder="Nama Guru">
    <button type="button" class="remove-btn">−</button>
  `;

  guruContainer.appendChild(row);
});

// ---------- REMOVE GURU ROW ----------
guruContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    if (guruContainer.children.length > 1) {
      e.target.parentElement.remove();
    }
  }
});

// ---------- SAVE ----------
btnSubmit.addEventListener("click", () => {
  const data = {};

  form.querySelectorAll("input, select, textarea").forEach(el => {
    if (el.name) data[el.name] = el.value;
  });

  tg.sendData(JSON.stringify({
    section: "bahagian1",
    data,
    submitted_at: new Date().toISOString()
  }));

  tg.close();
});

// ---------- INIT ----------
createAttendanceRows();
