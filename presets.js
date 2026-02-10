// ===============================
// HEMSS MINI APP - presets.js
// ===============================

// ===============================
// GLOBAL PRESETS
// ===============================

const MINGGU_LIST = [
  "Minggu 1",
  "Minggu 2",
  "Minggu 3",
  "Minggu 4",
  "Minggu 5"
];

// Tingkatan
const tingkatanList = ["1", "2", "3", "4", "5"];

// Kelas
const kelasList = [
  "Seroja", "Mawar", "Melati", "Teratai", "Kenanga",
  "Cempaka", "Anggerik", "Orkid", "Bakawali", "Ros"
];

// Hari
const hariList = ["Isnin", "Selasa", "Rabu", "Khamis", "Jumaat"];

// Status keberadaan guru
const statusGuruList = [
  "CR",
  "MC",
  "Mesyuarat",
  "Temujanji",
  "Bengkel",
  "Kuarantin",
  "Rawatan",
  "Lain-lain"
];

// helper (HTML option builder)
function buildOptions(list) {
  return list.map(v => `<option value="${v}">${v}</option>`).join("");
}
