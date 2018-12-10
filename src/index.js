const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');

process.env.GOOGLE_API_KEY = 'AIzaSyCjjSjBFWmy0Xgf8kRkaJWjUg8VDx1t8bw'


if(process.env.NODE_ENV !== 'production'){
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    })
}



let mainWindow;


/**
 * Inicializar app (Ventana)
 */
app.setName('Fast Desktop App');

 app.on('ready', () => {


    /**
     * Crear ventana
     */
     mainWindow = new BrowserWindow({
        fullscreen: true,
        title: 'Fast Desktop App ',
        center: true, 
        maximizable: false,
        resizable: true,
        show: true,
        

    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true

    }));

   
    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', () => {
        app.quit();
    });
 });


 



var templateMenu = [{
    label: "Application",
    submenu: [
        { label: "Salir", accelerator: "Command+Q", click: function() { app.quit(); }}
    ]}, {
    label: "Editar",
    submenu: [
        { label: "Deshacer", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Rehacer", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cortar", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copiar", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Pegar", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Seleccionar todo", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]}
];


