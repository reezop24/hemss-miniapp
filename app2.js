// ---------- COLLECT DATA (ARRAY-BASED) ----------
function collectData() {
  const data = {};

  form.querySelectorAll("input, select, textarea").forEach(el => {
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

// ---------- SIMPAN SAHAJA ----------
document.getElementById("btnSave").addEventListener("click", () => {
  tg.sendData(JSON.stringify({
    section: "bahagian2",
    data: collectData(),
    has_image: false,
    submitted_at: new Date().toISOString()
  }));

  tg.close();
});

// ---------- SIMPAN & MUAT NAIK GAMBAR ----------
document.getElementById("btnSaveImage").addEventListener("click", () => {
  tg.sendData(JSON.stringify({
    section: "bahagian2",
    data: collectData(),
    has_image: true,
    submitted_at: new Date().toISOString()
  }));

  tg.close();
});
