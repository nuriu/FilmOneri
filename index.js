var electron = require("electron");
var uygulama = electron.app;
var BrowserWindow = electron.BrowserWindow;
var anaPencere;

function pencereyiOlustur() {
    anaPencere = new BrowserWindow({
        width: 800,
        height: 600,
        center: true,
        icon: __dirname + "/app/img/is.png",
        //frame: false
    });

    anaPencere.setMinimumSize(1200, 700);
    anaPencere.loadURL(`file://${__dirname}/ana.html`);

    anaPencere.webContents.openDevTools();
    //anaPencere.setMenu(null);
    //anaPencere.setFullScreen(true);

    anaPencere.on('closed', function () {
        anaPencere = null;
    });
}

uygulama.on("ready", () => {
    pencereyiOlustur();
});

uygulama.on("window-all-closed", () => {
    if (process.platform !== 'darwin') {
        uygulama.quit();
    }
});

uygulama.on("activate", () => {
    if (anaPencere === null) {
        pencereyiOlustur();
    }
});
