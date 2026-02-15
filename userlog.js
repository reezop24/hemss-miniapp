document.addEventListener("DOMContentLoaded", function () {
  const tg = window.Telegram.WebApp;
  tg.expand();

  const guruStat = document.getElementById("guruStat");
  const totalStat = document.getElementById("totalStat");
  const userList = document.getElementById("userList");
  const emptyState = document.getElementById("emptyState");

  function loadPayload() {
    const params = new URLSearchParams(window.location.search);
    const rawB64 = params.get("data_b64");
    const raw = params.get("data");

    if (rawB64) {
      try {
        const normalized = rawB64.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
        const binary = atob(padded);
        const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
        return JSON.parse(new TextDecoder().decode(bytes));
      } catch (err) {
        console.error("User log base64 parse error:", err);
      }
    }

    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch (err) {
      console.error("User log parse error:", err);
      return null;
    }
  }

  function render(payload) {
    const safe = payload || {};
    const guruRegistered = Number(safe.guru_registered || 0);
    const guruTotal = Number(safe.guru_total || 0);
    const totalUsers = Number(safe.total_users || 0);
    const rows = Array.isArray(safe.rows) ? safe.rows : [];

    guruStat.textContent = `Guru berdaftar: ${guruRegistered}/${guruTotal}`;
    totalStat.textContent = `Jumlah pengguna: ${totalUsers}`;

    userList.innerHTML = "";
    if (!rows.length) {
      emptyState.style.display = "block";
      return;
    }

    emptyState.style.display = "none";
    rows.forEach((item, idx) => {
      const box = document.createElement("div");
      box.className = "user-item";

      const name = item.name || "Tanpa Nama";
      const uid = item.uid || "-";
      const createdAt = item.created_at || "-";
      const status = item.status || "new user";
      const adminTag = item.is_admin ? ' | <span class="admin-tag">ADMIN</span>' : "";

      box.innerHTML =
        `<div class="user-name">${idx + 1}. ${name}</div>` +
        `<div class="user-meta">` +
        `User ID: ${uid}<br>` +
        `Masa daftar: ${createdAt}<br>` +
        `Status: ${status}${adminTag}` +
        `</div>`;

      userList.appendChild(box);
    });
  }

  render(loadPayload());
});
