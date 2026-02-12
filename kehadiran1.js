console.log("JS load");
console.log(KE_LAS);

<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kehadiran Pelajar</title>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  background: #1f3554;
  color: #f1f1f1;
  padding: 20px;
  font-size: 17px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.kelas {
  flex: 2;
  font-size: 15px;
}

.input-box {
  width: 65px;
  padding: 8px;
  font-size: 15px;
  text-align: center;
  border-radius: 6px;
  border: none;
}

.separator {
  margin: 0 10px;
  font-weight: bold;
}

.summary {
  margin-top: 25px;
  padding-top: 15px;
  border-top: 1px solid rgba(255,255,255,0.2);
  font-weight: 600;
}

button {
  width: 100%;
  margin-top: 25px;
  padding: 14px;
  font-size: 17px;
  border-radius: 6px;
  border: none;
  background-color: #27ae60;
  color: white;
  font-weight: 600;
}
</style>
</head>

<body>

<h2 id="tajuk"></h2>

<div id="kelasContainer"></div>

<div class="summary">
  <div id="jumlah"></div>
  <div id="peratus"></div>
</div>

<button onclick="submitData()">💾 Simpan</button>

<script src="https://telegram.org/js/telegram-web-app.js"></script>
<script src="nameset.js"></script>
<script src="kehadiran1.js"></script>

</body>
</html>
