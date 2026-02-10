// ===============================
// BAHAGIAN 1 - VIEW (READ ONLY)
// ===============================

// SAFE Telegram guard
const tg = window.Telegram?.WebApp || null;
if (tg) tg.ready();

// ===============================
// MOCK DATA (UNTUK UI TEST)
// buang / ganti bila sambung DB
// ===============================
const mockData = {
  guru: [
    "Ahmad Zaki",
    "Siti Aisyah",
    "Norhafizah",
    "Muhammad Aiman",
    "Nur Syuhada"
  ],
  minggu: "Minggu 1",
  tarikh: "11-02-2026",
  hari: "Isnin"
};

// ===============================
// RENDER VIEW
// ===============================
function renderView(data) {
  const guruBox = document.getElementById("ans-guru");
  const mingguBox = document.getElementById("ans-minggu");
  const tarikhBox = document.getElementById("ans-tarikh");
  const hariBox = document.getElementById("ans-hari");

  // clear dulu
  guruBox.innerHTML = "";

  data.guru.forEach(name => {
    const div = document.createElement("div");
    div.textContent = "• " + name;
    guruBox.appendChild(div);
  });

  mingguBox.textContent = data.minggu;
  tarikhBox.textContent = data.tarikh;
  hariBox.textContent = data.hari;
}

// ===============================
// BUTTON UBAH SEMULA
// ===============================
document.getElementById("btnEdit").addEventListener("click", () => {
  if (tg) {
    tg.sendData(JSON.stringify({
      action: "request_edit_bahagian1"
    }));
    tg.close();
  } else {
    alert("Simulasi browser: permintaan ubah semula dihantar");
  }
});

// INIT
renderView(mockData);
