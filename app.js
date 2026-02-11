// ===============================
// HEMSS MINI APP - app.js (SAFE FIX)
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  // ---------- TELEGRAM ----------
  const tg = window.Telegram.WebApp;
  tg.ready();

  // ---------- ELEMENT ----------
  const form = document.getElementById("reportForm");
  const guruWrapper = document.getElementById("guruWrapper");
  const addGuruBtn = document.getElementById("addGuruBtn");
  const addRowBtn = document.getElementById("addRow");
  const btnSubmit = document.getElementById("btnSubmit");
  const hariSelect = document.getElementById("hariSelect");
  const mingguSelect = document.getElementById("mingguSelect");

  const MAX_GURU = 6;

  // ===============================
  // GURU BERTUGAS
  // ===============================
  function renumberGuru() {
    const inputs = guruWrapper.querySelectorAll(".guru-input");
    inputs.forEach((input, index) => {
      input.placeholder = `Nama Guru ${index + 1}`;
      input.name = `guru`;
    });
  }

  addGuruBtn.addEventListener("click", () => {
    const currentCount = guruWrapper.querySelectorAll(".guru-input").length;
    if (currentCount >= MAX_GURU) return;

    const row = document.createElement("div");
    row.className = "guru-extra-row";
    row.innerHTML = `
      <input class="name-search guru-input" placeholder="Nama Guru">
      <button type="button" class="remove-guru">❌</button>
    `;
    guruWrapper.appendChild(row);
    renumberGuru();
  });

  guruWrapper.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-guru")) {
      e.target.parentElement.remove();
      renumberGuru();
    }
  });

  // ===============================
  // PRESETS
  // ===============================
  if (mingguSelect && typeof MINGGU_LIST !== "undefined") {
    mingguSelect.innerHTML = MINGGU_LIST
      .map(m => `<option value="${m}">${m}</option>`)
      .join("");
  }

  if (hariSelect) {
    hariSelect.innerHTML = buildOptions(hariList);
  }

  // ===============================
  // ACCORDION
  // ===============================
  document.querySelectorAll(".tingkatan-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const panel = document.getElementById(btn.dataset.target);
      const open = panel.style.display === "block";
      panel.style.display = open ? "none" : "block";
      btn.textContent =
        (open ? "▶ " : "▼ ") +
        btn.textContent.replace("▶ ", "").replace("▼ ", "");
    });
  });

  // ===============================
  // AUTO KIRA (KEKAL)
  // ===============================
  function autoKira(prefix) {
    const hadir = document.querySelectorAll(`.${prefix}-hadir`);
    const daftar = document.querySelectorAll(`.${prefix}-daftar`);
    let h = 0, d = 0;
    hadir.forEach(i => h += Number(i.value || 0));
    daftar.forEach(i => d += Number(i.value || 0));
    document.getElementById(`${prefix}-jumlah`).textContent = `${h} / ${d}`;
    document.getElementById(`${prefix}-peratus`).textContent =
      d > 0 ? Math.round((h / d) * 100) + "%" : "0%";
  }

  ["t1","t2","t3","t4","t5"].forEach(t => {
    document.querySelectorAll(`.${t}-hadir, .${t}-daftar`)
      .forEach(i => i.addEventListener("input", () => autoKira(t)));
  });

  // ===============================
  // ADD / REMOVE STATUS GURU
  // ===============================
  addRowBtn.addEventListener("click", () => {
    const row = document.createElement("div");
    row.className = "guru-row";
    row.innerHTML = `
      <select name="status">${buildOptions(statusGuruList)}</select>
      <input name="nama_status" placeholder="Nama Guru">
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
  // SAVE (INI PALING PENTING)
  // ===============================
  btnSubmit.addEventListener("click", () => {

    const payload = {
      inputs: [],
      submitted_at: new Date().toISOString()
    };

    form.querySelectorAll("input, select, textarea").forEach((el, index) => {
      const value = el.value;
      if (value !== null && value !== "") {
        payload.inputs.push({
          index,
          tag: el.tagName,
          name: el.name || null,
          value
        });
      }
    });

    tg.sendData(JSON.stringify({
      section: "bahagian1",
      payload
    }));

    tg.close();
  });

});
