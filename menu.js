const tg = window.Telegram.WebApp;
tg.expand();

function hantarTarikh() {

    const input = document.getElementById("tarikhInput");
    const selectedDate = input.value;

    if (!selectedDate) {
        alert("Sila pilih tarikh laporan terlebih dahulu.");
        return;
    }

    const confirmAction = confirm(
        "Anda pasti ingin menggunakan tarikh ini?\n\n" +
        selectedDate +
        "\n\nPastikan tarikh adalah tepat sebelum meneruskan."
    );

    if (!confirmAction) {
        return;
    }

    // ✅ SIMPAN UNTUK MINIAPP SETERUSNYA (guru.html)
    localStorage.setItem("laporan_tarikh", selectedDate);

    const payload = {
        type: "laporan_tarikh",
        date: selectedDate
    };

    tg.sendData(JSON.stringify(payload));
    tg.close();
}
