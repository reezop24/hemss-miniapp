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

  const guruOptions = Array.isArray(NAME_SET) ? NAME_SET.slice() : [];

  guruOptions.forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name;
    datalist.appendChild(opt);
  });

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

    const panel = document.createElement("div");
    panel.style.position = "absolute";
    panel.style.left = "0";
    panel.style.right = "0";
    panel.style.top = "calc(100% - 10px)";
    panel.style.maxHeight = "220px";
    panel.style.overflowY = "auto";
    panel.style.background = "#ffffff";
    panel.style.color = "#1f3554";
    panel.style.border = "1px solid #d7dbe2";
    panel.style.borderRadius = "8px";
    panel.style.boxShadow = "0 10px 24px rgba(0,0,0,0.16)";
    panel.style.zIndex = "20";
    panel.style.display = "none";

    function normalize(value) {
      return (value || "").trim().toLowerCase();
    }

    function renderList(list) {
      panel.innerHTML = "";
      if (!list.length) {
        const empty = document.createElement("div");
        empty.textContent = "Tiada padanan";
        empty.style.padding = "10px 12px";
        empty.style.fontSize = "13px";
        empty.style.opacity = "0.75";
        panel.appendChild(empty);
      } else {
        list.forEach((name) => {
          const item = document.createElement("button");
          item.type = "button";
          item.textContent = name;
          item.style.display = "block";
          item.style.width = "100%";
          item.style.textAlign = "left";
          item.style.padding = "10px 12px";
          item.style.border = "none";
          item.style.background = "#fff";
          item.style.color = "#1f3554";
          item.style.cursor = "pointer";
          item.style.fontSize = "14px";

          item.addEventListener("mouseenter", function () {
            item.style.background = "#f3f6fb";
          });
          item.addEventListener("mouseleave", function () {
            item.style.background = "#fff";
          });
          item.addEventListener("click", function () {
            inputEl.value = name;
            panel.style.display = "none";
          });

          panel.appendChild(item);
        });
      }
      panel.style.display = "block";
    }

    inputEl.addEventListener("input", function () {
      const typed = normalize(inputEl.value);
      const filtered = options
        .filter((name) => normalize(name).includes(typed))
        .slice(0, 25);
      renderList(filtered);
    });

    inputEl.addEventListener("focus", function () {
      const typed = normalize(inputEl.value);
      const filtered = options
        .filter((name) => normalize(name).includes(typed))
        .slice(0, 25);
      renderList(filtered);
    });

    arrowBtn.addEventListener("click", function () {
      if (panel.style.display === "block") {
        panel.style.display = "none";
        return;
      }
      renderList(options.slice(0, 25));
      inputEl.focus();
    });

    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) {
        panel.style.display = "none";
      }
    });

    wrap.appendChild(arrowBtn);
    wrap.appendChild(panel);
  }

  attachSearchDropdown(namaGuruEl, guruOptions);

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
