const tg = window.Telegram.WebApp;
tg.ready();

tg.sendData(JSON.stringify({ test: "HELLO_FROM_MINIAPP" }));
tg.close();
