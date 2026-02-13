document.addEventListener("DOMContentLoaded", function () {

    const tg = window.Telegram.WebApp;
    tg.expand();

    window.submitTarikh = function () {

        const tarikh = document.getElementById("tarikh").value;
        const sesi = document.getElementById("sesi").value;

        if (!tarikh) {
            alert("Sila pilih tarikh.");
            return;
        }

        if (!sesi) {
            alert("Sila pilih sesi.");
            return;
        }

        // Simpan untuk kegunaan miniapp lain jika perlu
        localStorage.setItem("laporan_tarikh", tarikh);
        localStorage.setItem("laporan_sesi", sesi);

        tg.sendData(JSON.stringify({
            type: "laporan_tarikh",
            date: tarikh,
            sesi: sesi
        }));

        tg.close();
    };

});
