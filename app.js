// ===============================
// HEMSS MINI APP - app.js (FINAL STABLE v3)
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  const tg = window.Telegram.WebApp;
  tg.ready();

  const form = document.getElementById("reportForm");
  const guruWrapper = document.getElementById("guruWrapper");
  const addGuruBtn = document.getElementById("addGuruBtn");
  const addRowBtn = document.getElementById("addRow");
  const btnSubmit = document.getElementById("btnSubmit");
  const hariSelect = document.getElementById("hariSelect");
  const mingguSelect = document.getElementById("mingguSelect");
  const guruContainer = document.getElementById("guruContainer");

  const MAX_GURU = 6;

  // =====================================================
  // HELPER – INIT DATALIST SEARCH
  // =====================================================
  function initNameSearch(input) {
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
  }

  // =====================================================
  // SOALAN 1 – GURU BERTUGAS
  // UID: GURUA_n
  // =====================================================
  function renumberGuru() {
    const inputs = guruWrapper.querySelectorAll(".guru-input");
    inputs.forEach((input, index) => {
      input.placeholder = `Nama Guru ${index + 1}`;
      input.name = `GURUA_${index + 1}`;
    });
  }

  // INIT SEARCH UNTUK INPUT ASAL
  document.querySelectorAll(".name-search").forEach(input => {
    initNameSearch(input);
  });

  renumberGuru();

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

    const newInput = row.querySelector(".name-search");
    initNameSearch(newInput);

    renumberGuru();
  });

  guruWrapper.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-guru")) {
      e.target.parentElement.remove();
      renumberGuru();
    }
  });

  // =====================================================
  // PRESETS (SOALAN 2–4)
  // =====================================================
  if (mingguSelect) {
    mingguSelect.innerHTML = buildOptions(MINGGU_LIST);
  }

  if (hariSelect) {
    hariSelect.innerHTML = buildOptions(hariList);
  }

  // =====================================================
  // ACCORDION
  // =====================================================
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

  // =====================================================
  // SOALAN 5 – KEHADIRAN
  // =====================================================
  function kiraTingkatan(prefix) {
    const hadir = document.querySelectorAll(`.${prefix}-hadir`);
    const daftar = document.querySelectorAll(`.${prefix}-daftar`);
    let h = 0, d = 0;

    hadir.forEach(i => h += Number(i.value || 0));
    daftar.forEach(i => d += Number(i.value || 0));

    document.getElementById(`${prefix}-jumlah`).textContent = `${h} / ${d}`;
    document.getElementById(`${prefix}-peratus`).textContent =
      d > 0 ? Math.round((h / d) * 100) + "%" : "0%";

    kiraKeseluruhan();
  }

  ["t1","t2","t3","t4","t5"].forEach(t => {
    document.querySelectorAll(`.${t}-hadir, .${t}-daftar`)
      .forEach(i => i.addEventListener("input", () => kiraTingkatan(t)));
  });

  // =====================================================
  // JUMLAH KESELURUHAN (AUTO)
  // =====================================================
  function kiraKeseluruhan() {
    let totalH = 0;
    let totalD = 0;

    document.querySelectorAll(".t1-hadir,.t2-hadir,.t3-hadir,.t4-hadir,.t5-hadir")
      .forEach(i => totalH += Number(i.value || 0));

    document.querySelectorAll(".t1-daftar,.t2-daftar,.t3-daftar,.t4-daftar,.t5-daftar")
      .forEach(i => totalD += Number(i.value || 0));

    document.getElementById("overall-jumlah").textContent =
      `${totalH} / ${totalD}`;

    document.getElementById("overall-peratus").textContent =
      totalD > 0 ? Math.round((totalH / totalD) * 100) + "%" : "0%";
  }

  // =====================================================
  // SOALAN 6 – KEBERADAAN GURU
  // =====================================================
  addRowBtn.addEventListener("click", () => {
    const count = guruContainer.querySelectorAll(".guru-row").length + 1;

    const row = document.createElement("div");
    row.className = "guru-row";
    row.innerHTML = `
      <select name="STATUS_${count}">${buildOptions(statusGuruList)}</select>
      <input name="GURUB_${count}" placeholder="Nama Guru">
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

  // =====================================================
  // SAVE
  // =====================================================
  btnSubmit.addEventListener("click", () => {

    const payload = {
      inputs: [],
      submitted_at: new Date().toISOString()
    };

    form.querySelectorAll("input, select, textarea").forEach((el, index) => {
      if (el.value !== null && el.value !== "") {
        payload.inputs.push({
          index,
          tag: el.tagName,
          name: el.name || null,
          value: el.value
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
