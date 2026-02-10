// ===============================
// HEMSS MINI APP - app2.js (FIXED)
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  const tg = window.Telegram.WebApp;
  tg.ready();

  const form = document.getElementById("reportForm");
  const btnSave = document.getElementById("btnSave");
  const btnSaveImage = document.getElementById("btnSaveImage");

  // ===============================
  // TAMBAH KOMEN (CLONE TEXTAREA)
  // ===============================
  document.querySelectorAll(".add-comment").forEach(btn => {
    btn.addEventListener("click", () => {
      const section = btn.closest(".comment-section");
      const textarea = section.querySelector("textarea");
      const clone = textarea.cloneNode();
      clone.value = "";
      section.insertBefore(clone, btn);
    });
  });

  // ===============================
  // COLLECT DATA (ARRAY-BASED)
  // ===============================
  function collectData() {
    const data = {};

    form.querySelectorAll("input, textarea").forEach(el => {
      if (!el.name) return;

      if (!data[el.name]) {
        data[el.name] = [];
      }

      if (el.value && el.value.trim() !== "") {
        data[el.name].push(el.value.trim());
      }
    });

    return data;
  }

  // ===============================
  // SIMPAN SAHAJA
  // ===============================
  btnSave.addEventListener("click", () => {
    tg.sendData(JSON.stringify({
      section: "bahagian2",
      data: collectData(),
      has_image: false,
      submitted_at: new Date().toISOString()
    }));

    tg.close();
  });

  // ===============================
  // SIMPAN & MUAT NAIK GAMBAR
  // ===============================
  btnSaveImage.addEventListener("click", () => {
    tg.sendData(JSON.stringify({
      section: "bahagian2",
      data: collectData(),
      has_image: true,
      submitted_at: new Date().toISOString()
    }));

    tg.close();
  });

});
