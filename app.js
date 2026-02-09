// ===============================
// HEMSS MINI APP - app.js (STABLE)
// ===============================

const tg = window.Telegram.WebApp;
tg.ready();

// ---------- ELEMENT ----------
const attendanceBody = document.getElementById("attendanceBody");
const guruContainer = document.getElementById("guruContainer");
const addRowBtn = document.getElementById("addRow");
const btnSubmit = document.getElementById("btnSubmit");
const form = document.getElementById("reportForm");

// ---------- PRESET ----------
const kelasList = [
  "Seroja","Mawar","Melati","Teratai","Kenanga",
  "Cempaka","Anggerik","Orkid","Bakawali","Ros"
];

// ---------- CREATE 30 ROW KEHADIRAN ----------
function createAttendanceRows() {
  attendanceBody.innerHTML = "";

  for (let i = 0; i < 30; i++) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <select name="tingkatan[]">
          <option>1</option><option>2</option><option>3</option>
          <option>4</option><option>5</option>
        </select>
      </td>

      <td>
        <select name="kelas[]">
          ${kelasList.map(k => `<option>${k}</option>`).join("")}
        </select>
      </td>

      <td>
        <input class="small" type="number" name="hadir[]"> /
        <input class="small" type="number" name="daftar[]">
      </td>
    `;

    attendanceBody.appendChild(tr);
  }
}

// ---------- ADD GURU ROW ----------
addRowBtn.addEventListener("click", () => {
  const row = document.createElement("div");
  row.className = "guru-row";

  row.innerHTML = `
    <select name="status[]">
      <option>CR</option>
      <option>MC</option>
      <option>Mesyuarat</option>
      <option>Lain-lain</option>
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
      e.target.closest(".guru-row").remove();
    }
  }
});

// ---------- SAVE ----------
btnSubmit.addEventListener("click", () => {
  const data = {};
  const elements = form.querySelectorAll("input, select, textarea");

  elements.forEach(el => {
    if (el.name) {
      if (!data[el.name]) {
        data[el.name] = [];
      }
      data[el.name].push(el.value);
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
