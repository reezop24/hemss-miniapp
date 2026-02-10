// ===============================
// HEMSS MINI APP - READ ONLY VIEW
// ===============================

const tg = window.Telegram.WebApp;
tg.ready();

/*
Expected payload:
{
  mode: "readonly",
  data: {
    guru: [...],
    minggu: "...",
    tarikh: "...",
    hari: "...",
    kehadiran: {...},
    keberadaan: [...],
    komen: "..."
  }
}
*/

const payload = tg.initDataUnsafe?.query?.payload
  ? JSON.parse(tg.initDataUnsafe.query.payload)
  : null;

if (!payload || payload.mode !== "readonly") {
  document.body.innerHTML = "<p>Data tidak sah.</p>";
  throw new Error("Invalid payload");
}

const data = payload.data;

// ---------- UTIL ----------
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value || "-";
}

function setList(id, list = []) {
  const el = document.getElementById(id);
  if (!el) return;

  el.innerText = "";
  list.forEach(item => {
    el.innerText += `• ${item}\n`;
  });
}

// ---------- RENDER ----------
setList("ans_guru", data.guru);
setText("ans_minggu", data.minggu);
setText("ans_tarikh", data.tarikh);
setText("ans_hari", data.hari);
setText("ans_komen", data.komen);

// Kehadiran (ringkas dulu)
const hadirBox = document.getElementById("ans_kehadiran");
hadirBox.innerText = "";

Object.keys(data.kehadiran || {}).forEach(ting => {
  hadirBox.innerText += emphasized(ting) + "\n";
  data.kehadiran[ting].forEach(k => {
    hadirBox.innerText += `  ${k.kelas} : ${k.hadir}/${k.daftar}\n`;
  });
  hadirBox.innerText += "\n";
});

function emphasized(text) {
  return text.toUpperCase();
}

// ---------- BUTTON ----------
document.getElementById("btnEdit").addEventListener("click", () => {
  tg.sendData(JSON.stringify({
    action: "REQUEST_EDIT",
    section: "bahagian1"
  }));
  tg.close();
});

document.getElementById("btnBack").addEventListener("click", () => {
  tg.close();
});
