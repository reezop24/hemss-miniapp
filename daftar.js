document.addEventListener("DOMContentLoaded", function () {
  const tg = window.Telegram.WebApp;
  tg.expand();

  const input = document.getElementById("namaGuru");
  const inputPentadbir = document.getElementById("namaPentadbir");
  const datalist = document.getElementById("senaraiNamaGuru");
  const datalistPentadbir = document.getElementById("senaraiNamaPentadbir");
  const btn = document.getElementById("submitDaftar");
  const superBtn = document.getElementById("superLoginBtn");
  const params = new URLSearchParams(window.location.search);
  const isSuperMode = params.get("su") === "1";

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

  if (isSuperMode && superBtn) {
    superBtn.style.display = "block";
    superBtn.addEventListener("click", function () {
      const user = (tg.initDataUnsafe && tg.initDataUnsafe.user) || {};
      const fallbackName = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();

      tg.sendData(JSON.stringify({
        type: "register_name",
        role: "superuser",
        name: fallbackName || "Superuser"
      }));

      tg.close();
    });
  }

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

    tg.sendData(JSON.stringify({
      type: "register_name",
      role: role,
      name: selectedName
    }));

    tg.close();
  });
});
