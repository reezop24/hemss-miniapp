// ===============================
// HEMSS MINI APP - app.js (STABLE)
// ===============================

const tg = window.Telegram.WebApp;
tg.ready();

// ---------- ELEMENT ----------
const attendanceBody = document.getElementById("attendanceBody");
const addRowBtn = document.getElementById("addRow");
const guruContainer = document.getElementById("guruContainer");
const btnSubmit = document.getElementById("btnSubmit");
const form = document.getElementById("reportForm");

// ---------- PRESET ----------
const kelasList = [
  "Seroja","Mawar","Melati","Teratai","Kenanga",
  "Cempaka","Anggerik","Orkid","Bakawali","Ros"
];

// ---------- CREATE 30 ROW MURID ----------
function createAttendanceRows() {
  attendanceBody.innerHTML = "";

  for (let i = 0; i < 30; i++) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <select name="tingkatan_${i}">
          <option>1</option><option>2</option><option>3</option>
          <option>4</option><option>5</option>
        </select>
      </td>

      <td>
        <select name="kelas_${i}">
          ${kelasList.map(k => `<option>${k}</option>`).join("")}
        </select>
      </td>

      <td>
        <input class="small" type="number" name="hadir_${i}"> /
        <input class="small" type="number" name="daftar_${i}">
      </td>
    `;

    attendanceBody.appendChild(tr);
  }
}

// ---------- GURU ADD / REMOVE ----------
addRowBtn.addEventListener("click", () => {
  const count = guruContainer.children.length + 1;

  const row = document.createElement("div");
  row.className = "guru-row";

  row.innerHTML = `
    <select name="status_${count}">
      <option>CR</option>
      <option>MC</option>
      <option>Mesyuarat</option>
      <option>Lain-lain</option>
    </select>

    <input name="nama_status_${count}" placeholder="Nama Guru">

    <button type="button" class="remove-btn">−</button>
  `;

  guruContainer.appendChild(row);
});

// remove guru row (event delegation)
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

  const elements = form.querySelectorAll("input, select, textarea");
  elements.forEach(el => {
    if (el.name && el.value !== "") {
      data[el.name] = el.value;
    }
  });

  const payload = {
    section: "bahagian1",
    data: data,
    submitted_at: new Date().toISOString()
  };

  tg.sendData(JSON.stringify(payload));
  tg.close();
});

// ---------- INIT ----------
createAttendanceRows();
