const tg = window.Telegram.WebApp;
tg.ready();

const form = document.getElementById("reportForm");
const btn = document.getElementById("btnSubmit");
const addRowBtn = document.getElementById("addRow");
const guruContainer = document.getElementById("guruContainer");

/* ======================
   TAMBAH / BUANG GURU
====================== */
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

guruContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    if (guruContainer.children.length > 1) {
      e.target.parentElement.remove();
    }
  }
});

/* ======================
   SIMPAN LAPORAN
====================== */
btn.addEventListener("click", () => {
  const data = {};

  form.querySelectorAll("input, select, textarea").forEach(el => {
    if (el.name && el.value) {
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
