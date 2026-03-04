document.addEventListener("DOMContentLoaded", function () {
  const tg = window.Telegram.WebApp;
  tg.expand();

  const input = document.getElementById("namaGuru");
  const inputPentadbir = document.getElementById("namaPentadbir");
  const datalist = document.getElementById("senaraiNamaGuru");
  const datalistPentadbir = document.getElementById("senaraiNamaPentadbir");
  const statusGuruEl = document.getElementById("statusGuru");
  const statusPentadbirEl = document.getElementById("statusPentadbir");
  const btn = document.getElementById("submitDaftar");
  const superBtn = document.getElementById("superLoginBtn");
  const params = new URLSearchParams(window.location.search);
  const isSuperMode = params.get("su") === "1";

  let isSubmitted = false;

  function closeWarningText() {
    return "Semua maklumat tidak akan disimpan jika anda menutup halaman ini sekarang.";
  }

  function enableCloseWarning() {
    if (typeof tg.enableClosingConfirmation === "function") {
      tg.enableClosingConfirmation();
      return;
    }
    if (typeof tg.setClosingConfirmation === "function") {
      tg.setClosingConfirmation(true);
    }
  }

  function disableCloseWarning() {
    if (typeof tg.disableClosingConfirmation === "function") {
      tg.disableClosingConfirmation();
      return;
    }
    if (typeof tg.setClosingConfirmation === "function") {
      tg.setClosingConfirmation(false);
    }
  }

  // Telegram native close guard
  enableCloseWarning();

  // Browser fallback close guard
  window.addEventListener("beforeunload", function (e) {
    if (isSubmitted) return;
    e.preventDefault();
    e.returnValue = closeWarningText();
    return closeWarningText();
  });

  function updateStatusGuru() {
    const value = (input.value || "").trim();
    if (Array.isArray(NAME_SET) && NAME_SET.includes(value)) {
      statusGuruEl.textContent = "Guru";
      return true;
    }
    statusGuruEl.textContent = "";
    return false;
  }

  function updateStatusPentadbir() {
    const value = (inputPentadbir.value || "").trim();
    if (Array.isArray(NAME_PENTADBIR) && NAME_PENTADBIR.includes(value)) {
      const jawatan = (typeof PENTADBIR_JAWATAN === "object" && PENTADBIR_JAWATAN[value])
        ? PENTADBIR_JAWATAN[value]
        : "Pentadbir";
      statusPentadbirEl.textContent = jawatan;
      return true;
    }
    statusPentadbirEl.textContent = "";
    return false;
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
        inputEl.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });

    arrowBtn.addEventListener("click", function () {
      select.focus();
      select.click();
    });

    const exact = (Array.isArray(options) ? options : []).find((name) => normalize(name) === normalize(inputEl.value));
    if (exact) {
      inputEl.value = exact;
      select.value = exact;
    }

    wrap.appendChild(arrowBtn);
    wrap.appendChild(select);
  }

  if (Array.isArray(NAME_SET)) {
    NAME_SET.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      datalist.appendChild(option);
    });
  }

  if (Array.isArray(NAME_PENTADBIR)) {
    NAME_PENTADBIR.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      datalistPentadbir.appendChild(option);
    });
  }

  attachSearchDropdown(input, Array.isArray(NAME_SET) ? NAME_SET : []);
  attachSearchDropdown(inputPentadbir, Array.isArray(NAME_PENTADBIR) ? NAME_PENTADBIR : []);

  if (isSuperMode && superBtn) {
    superBtn.style.display = "block";
    superBtn.addEventListener("click", function () {
      const user = (tg.initDataUnsafe && tg.initDataUnsafe.user) || {};
      const fallbackName = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();

      isSubmitted = true;
      disableCloseWarning();

      tg.sendData(JSON.stringify({
        type: "register_name",
        role: "superuser",
        name: fallbackName || "Superuser"
      }));

      tg.close();
    });
  }

  input.addEventListener("input", function () {
    const isGuruValid = updateStatusGuru();
    if (isGuruValid) {
      inputPentadbir.value = "";
      statusPentadbirEl.textContent = "";
    }
  });

  inputPentadbir.addEventListener("input", function () {
    const isPentadbirValid = updateStatusPentadbir();
    if (isPentadbirValid) {
      input.value = "";
      statusGuruEl.textContent = "";
    }
  });

  btn.addEventListener("click", function () {
    const selectedGuru = (input.value || "").trim();
    const selectedPentadbir = (inputPentadbir.value || "").trim();

    if (!selectedGuru && !selectedPentadbir) {
      alert("Sila pilih nama terlebih dahulu (Guru atau Pentadbir).");
      return;
    }

    if (selectedGuru && selectedPentadbir) {
      alert("Sila isi salah satu sahaja: Guru atau Pentadbir.");
      return;
    }

    let role = "";
    let selectedName = "";

    if (selectedGuru) {
      if (!Array.isArray(NAME_SET) || !NAME_SET.includes(selectedGuru)) {
        alert("Nama guru mesti dipilih daripada senarai.");
        return;
      }
      role = "guru";
      selectedName = selectedGuru;
    } else {
      if (!Array.isArray(NAME_PENTADBIR) || !NAME_PENTADBIR.includes(selectedPentadbir)) {
        alert("Nama pentadbir mesti dipilih daripada senarai.");
        return;
      }
      role = "pentadbir";
      selectedName = selectedPentadbir;
    }

    isSubmitted = true;
    disableCloseWarning();

    tg.sendData(JSON.stringify({
      type: "register_name",
      role: role,
      name: selectedName
    }));

    tg.close();
  });

  updateStatusGuru();
  updateStatusPentadbir();
});
