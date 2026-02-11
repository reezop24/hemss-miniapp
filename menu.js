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

    const payload = {
        type: "laporan_tarikh",
        date: selectedDate  // ISO format
    };

    tg.sendData(JSON.stringify(payload));
    tg.close();
}
