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
  document.querySelectorAll(".add-comment").forEach(addBtn => {
  addBtn.addEventListener("click", () => {
    const section = addBtn.closest(".comment-section");

    // create wrapper
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.marginTop = "6px";

    // clone textarea
    const textarea = section.querySelector("textarea").cloneNode();
    textarea.value = "";

    // remove button
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "❌ Buang";
    removeBtn.style.position = "absolute";
    removeBtn.style.right = "0";
    removeBtn.style.top = "0";
    removeBtn.style.background = "#e74c3c";
    removeBtn.style.color = "#fff";
    removeBtn.style.border = "none";
    removeBtn.style.borderRadius = "4px";
    removeBtn.style.padding = "4px 8px";
    removeBtn.style.fontSize = "12px";

    removeBtn.addEventListener("click", () => {
      wrapper.remove();
    });

    wrapper.appendChild(textarea);
    wrapper.appendChild(removeBtn);

    section.insertBefore(wrapper, addBtn);
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
