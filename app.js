// ===============================
// HEMSS MINI APP - app.js (FINAL FIXED)
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  // ---------- TELEGRAM ----------
  const tg = window.Telegram.WebApp;
  tg.ready();

  // ---------- ELEMENT ----------
  const form = document.getElementById("reportForm");
  const attendanceBody = document.getElementById("attendanceBody");
  const jumlahHadirEl = document.getElementById("jumlahHadir");
  const peratusHadirEl = document.getElementById("peratusHadir");
  // ===============================
  // GURU BERTUGAS (MAX 6)
  // ===============================
  
  const guruWrapper = document.getElementById("guruWrapper");
  const addGuruBtn = document.getElementById("addGuruBtn");
  const MAX_GURU = 6;
  
  function renumberGuru() {
    const inputs = guruWrapper.querySelectorAll(".guru-input");
    inputs.forEach((input, index) => {
      input.placeholder = `Nama Guru ${index + 1}`;
      input.name = `guru${index + 1}`;
    });
  }
  
  addGuruBtn.addEventListener("click", () => {
    const currentCount = guruWrapper.querySelectorAll(".guru-input").length;
  
    // 🔒 LIMIT
    if (currentCount >= MAX_GURU) return;
  
    const row = document.createElement("div");
    row.className = "guru-extra-row";
  
    row.innerHTML = `
      <input class="name-search guru-input" placeholder="Nama Guru">
      <button type="button" class="remove-guru">❌</button>
    `;
  
    guruWrapper.appendChild(row);
  
    // init search untuk input baru
    if (typeof initNameSearch === "function") {
      initNameSearch(row.querySelector(".name-search"));
    }
  
    renumberGuru();
  });
  
  // BUANG GURU
  guruWrapper.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-guru")) {
      e.target.parentElement.remove();
      renumberGuru();
    }
  });
  const addRowBtn = document.getElementById("addRow");
  const btnSubmit = document.getElementById("btnSubmit");
  const hariSelect = document.getElementById("hariSelect");
  // ===============================
  // INIT MINGGU (GLOBAL PRESET)
  // ===============================
  const mingguSelect = document.getElementById("mingguSelect");
  
  if (mingguSelect && typeof MINGGU_LIST !== "undefined") {
    mingguSelect.innerHTML = MINGGU_LIST
      .map(m => `<option value="${m}">${m}</option>`)
      .join("");
  }

  // ===============================
  // GLOBAL NAME SEARCH (NAMESET.JS)
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

  // ---------- INIT HARI ----------
  if (hariSelect) {
    hariSelect.innerHTML = buildOptions(hariList);
  }

  // ---------- INIT STATUS ROW PERTAMA ----------
  if (guruContainer?.querySelector("select")) {
    guruContainer.querySelector("select").innerHTML =
      buildOptions(statusGuruList);
  }

  // ===============================
  // ACCORDION TOGGLE
  // ===============================
  document.querySelectorAll(".tingkatan-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const panel = document.getElementById(btn.dataset.target);
      const open = panel.style.display === "block";
  
      panel.style.display = open ? "none" : "block";
      btn.textContent = (open ? "▶ " : "▼ ") + btn.textContent.replace("▶ ", "").replace("▼ ", "");
    });
  });
  
  // ===============================
  // AUTO KIRA TINGKATAN 1
  // ===============================
  function kiraTingkatan1() {
    const hadir = document.querySelectorAll(".t1-hadir");
    const daftar = document.querySelectorAll(".t1-daftar");
  
    let totalH = 0;
    let totalD = 0;
  
    hadir.forEach(i => totalH += Number(i.value || 0));
    daftar.forEach(i => totalD += Number(i.value || 0));
  
    document.getElementById("t1-jumlah").textContent = `${totalH} / ${totalD}`;
    document.getElementById("t1-peratus").textContent =
      totalD > 0 ? Math.round((totalH / totalD) * 100) + "%" : "0%";
  }
  
  document.querySelectorAll(".t1-hadir, .t1-daftar").forEach(input => {
    input.addEventListener("input", kiraTingkatan1);
  });

  // ===============================
  // AUTO KIRA TINGKATAN 2
  // ===============================
  function kiraTingkatan2() {
    const hadir = document.querySelectorAll(".t2-hadir");
    const daftar = document.querySelectorAll(".t2-daftar");
  
    let totalH = 0;
    let totalD = 0;
  
    hadir.forEach(i => totalH += Number(i.value || 0));
    daftar.forEach(i => totalD += Number(i.value || 0));
  
    document.getElementById("t2-jumlah").textContent = `${totalH} / ${totalD}`;
    document.getElementById("t2-peratus").textContent =
      totalD > 0 ? Math.round((totalH / totalD) * 100) + "%" : "0%";
  }
  
  document.querySelectorAll(".t1-hadir, .t1-daftar").forEach(input => {
    input.addEventListener("input", kiraTingkatan2);
  });
  // ===============================
  // ADD / REMOVE GURU ROW
  // ===============================
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

  guruContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      if (guruContainer.children.length > 1) {
        e.target.parentElement.remove();
      }
    }
  });

  // ===============================
  // SAVE
  // ===============================
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

});
