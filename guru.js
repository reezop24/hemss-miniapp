<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kumpulan Guru Bertugas</title>

<link rel="stylesheet" href="style.css">

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  background: #1e3a5f;
  color: white;
  padding: 24px;
  font-size: 18px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

input, select {
  width: 100%;
  padding: 14px;
  font-size: 18px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: none;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 16px;
  font-size: 20px;
  border-radius: 10px;
  border: none;
  background-color: #4da3ff;
  color: white;
  font-weight: 600;
  margin-top: 10px;
}
</style>
</head>

<body>

<h2>👥 Kumpulan Guru Bertugas</h2>

<div id="guru-container"></div>

<button onclick="addBox()">➕ Tambah Guru (Max 6)</button>

<select id="minggu"></select>

<button onclick="submitData()">💾 Simpan</button>

<datalist id="guru_list"></datalist>

<script src="nameset.js"></script>
<script src="preset.js"></script>
<script src="guru.js"></script>

</body>
</html>
