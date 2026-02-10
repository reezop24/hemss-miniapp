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
  "Minggu 5",
  "Minggu 6",
  "Minggu 7",
  "Minggu 8",
  "Minggu 9",
  "Minggu 10",
  "Minggu 11",
  "Minggu 12",
  "Minggu 13",
  "Minggu 14",
  "Minggu 15",
  "Minggu 16",
  "Minggu 17",
  "Minggu 18",
  "Minggu 19",
  "Minggu 20",
  "Minggu 21",
  "Minggu 22",
  "Minggu 23",
  "Minggu 24",
  "Minggu 25",
  "Minggu 26",
  "Minggu 27",
  "Minggu 28",
  "Minggu 29",
  "Minggu 30",
  "Minggu 31",
  "Minggu 32",
  "Minggu 33",
  "Minggu 34",
  "Minggu 35",
  "Minggu 36",
  "Minggu 37",
  "Minggu 38",
  "Minggu 39",
  "Minggu 40",
  "Minggu 41",
  "Minggu 42",
  "Minggu 43"
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
