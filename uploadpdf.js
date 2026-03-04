document.addEventListener("DOMContentLoaded", function () {
  const tg = window.Telegram.WebApp;
  tg.expand();
  if (typeof tg.ready === "function") {
    tg.ready();
  }

  const tarikhEl = document.getElementById("tarikh");
  const sesiEl = document.getElementById("sesi");
  const namaGuruEl = document.getElementById("namaGuru");
  const datalist = document.getElementById("senaraiNamaGuru");
  const submitBtn = document.getElementById("submitBtn");

  if (Array.isArray(NAME_SET)) {
    NAME_SET.forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      datalist.appendChild(opt);
    });
  }

  function attachSearchDropdown(inputEl, options) {
    if (!inputEl) return;

    const wrap = document.createElement("div");
    wrap.style.position = "relative";

    inputEl.parentNode.insertBefore(wrap, inputEl);
    wrap.appendChild(inputEl);

    inputEl.style.paddingRight = "36px";

    const arrowBtn = document.createElement("button");
    arrowBtn.type = "button";
    arrowBtn.innerText = "▾";
    arrowBtn.style.position = "absolute";
    arrowBtn.style.right = "0";
    arrowBtn.style.top = "0";
    arrowBtn.style.height = "calc(100% - 12px)";
    arrowBtn.style.width = "34px";
    arrowBtn.style.border = "none";
    arrowBtn.style.borderLeft = "1px solid rgba(0,0,0,0.1)";
    arrowBtn.style.background = "rgba(0,0,0,0.08)";
    arrowBtn.style.color = "#1f3554";
    arrowBtn.style.borderTopRightRadius = "10px";
    arrowBtn.style.borderBottomRightRadius = "10px";
    arrowBtn.style.cursor = "pointer";

    const select = document.createElement("select");
    select.style.position = "absolute";
    select.style.right = "0";
    select.style.top = "0";
    select.style.width = "34px";
    select.style.height = "calc(100% - 12px)";
    select.style.opacity = "0";
    select.style.cursor = "pointer";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Pilih";
    select.appendChild(defaultOption);

    (Array.isArray(options) ? options : []).forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });

    const normalize = (s) => (s || "").trim().toLowerCase();

    inputEl.addEventListener("input", function () {
      const typed = normalize(inputEl.value);
      const exact = (Array.isArray(options) ? options : []).find((name) => normalize(name) === typed);
      select.value = exact || "";
    });

    select.addEventListener("change", function () {
      if (select.value) {
        inputEl.value = select.value;
      }
    });

    arrowBtn.addEventListener("click", function () {
      select.focus();
      select.click();
    });

    wrap.appendChild(arrowBtn);
    wrap.appendChild(select);
  }

  attachSearchDropdown(namaGuruEl, Array.isArray(NAME_SET) ? NAME_SET : []);

  submitBtn.addEventListener("click", function () {
    const dateValue = (tarikhEl.value || "").trim();
    const sesiValue = (sesiEl.value || "").trim().toUpperCase();
    const guruName = (namaGuruEl.value || "").trim();

    if (!dateValue || !sesiValue || !guruName) {
      alert("Sila lengkapkan tarikh, sesi, dan nama guru.");
      return;
    }

    if (!Array.isArray(NAME_SET) || !NAME_SET.includes(guruName)) {
      alert("Nama guru mesti dipilih daripada senarai.");
      return;
    }

    tg.sendData(JSON.stringify({
      type: "admin_manual_pdf_prepare",
      date: dateValue,
      sesi: sesiValue,
      guru_name: guruName
    }));

    tg.close();
  });
});
