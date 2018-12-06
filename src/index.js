const { app, BrowserWindow, Menu } = require('electron');
const url = require('url');
const path = require('path');



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
        resizable: false,
        show: true,
        webPreferences:  { 
            webSecurity: true,
            javascript: true,
            plugins: true, 
            safeDialogs: true, 
            allowRunningInsecureContent: true,
            webgl: true,
            experimentalFeatures: true
         }
        
        
    });
    

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true

    }));

    //const mainMenu = Menu.buildFromTemplate(templateMenu);
    //Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', () => {
        app.quit();
    });
 });


 function createNewPedidoWindow(){

 /**
     * Crear ventana
     */
    let pedidoWindow = new BrowserWindow({
        height: 330,
        width: 400,
        fullscreen: false,
        title: 'Fast Desktop App Pedido',
        center: true, 
        maximizable: false,
        resizable: false,
        show: true,
        webPreferences:  { 
            webSecurity: true,
            javascript: true,
            plugins: true, 
            safeDialogs: true, 
            allowRunningInsecureContent: true,
            webgl: true,
            experimentalFeatures: true
         }
        
        
    });
    
    pedidoWindow.setMenu(null);
    pedidoWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/pedido.html'),
        protocol: 'file',
        slashes: true

    }));


}

 const templateMenu = [
     {
         label: "File",
            submenu: [
                {
                    label: 'Pedido',
                    accelerator: 'Ctrl+N',
                    click(){
                        createNewPedidoWindow();
                    }
                }, {
                    label: 'Salir',
                    click(){
                        app.exit();
                    }
                }

            ]
     }
 ]


