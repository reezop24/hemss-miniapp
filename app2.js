// ===============================
// HEMSS MINI APP - app2.js (FINAL)
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  const tg = window.Telegram.WebApp;
  tg.ready();

  const form = document.getElementById("reportForm");
  const btnSave = document.getElementById("btnSave");
  const btnSaveImage = document.getElementById("btnSaveImage");

  // ===============================
  // GLOBAL NAME SEARCH (NAMESET.JS)
  // PALING ATAS - JANGAN ALIHKAN
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

  // ===============================
  // TAMBAH / BUANG KOMEN
  // ===============================
  document.querySelectorAll(".add-comment").forEach(addBtn => {
    addBtn.addEventListener("click", () => {
      const section = addBtn.closest(".comment-section");
      const original = section.querySelector("textarea");

      const textarea = original.cloneNode(true);
      textarea.value = "";

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.textContent = "❌ Buang komen ini";
      removeBtn.style.marginTop = "6px";
      removeBtn.style.background = "#e74c3c";
      removeBtn.style.color = "#fff";
      removeBtn.style.border = "none";
      removeBtn.style.borderRadius = "6px";
      removeBtn.style.padding = "6px";
      removeBtn.style.width = "100%";
      removeBtn.style.fontSize = "14px";

      removeBtn.addEventListener("click", () => {
        textarea.remove();
        removeBtn.remove();
      });

      section.insertBefore(textarea, addBtn);
      section.insertBefore(removeBtn, addBtn);
    });
  });

  // ===============================
  // COLLECT DATA (ARRAY-BASED)
  // ===============================
  function collectData() {
    const data = {};

    form.querySelectorAll("input, textarea").forEach(el => {
      if (!el.name) return;

      if (!data[el.name]) data[el.name] = [];

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
