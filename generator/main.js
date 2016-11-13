const electron = require('electron');
const {
    app,
    BrowserWindow,
    dialog,
    session,
    Menu,
    MenuItem
} = electron;

let mainWindow;
const template = [
    {
        label: 'Beastie 2016',
        submenu: [
            {
                label: 'About',
                selector: 'orderFrontStandardAboutPanel:'
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: app.quit
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click(item, focusedWindow) {
                    if (focusedWindow) focusedWindow.reload();
                }
            },
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow) {
                    if (focusedWindow) focusedWindow.webContents.toggleDevTools();
                }
            },
            {
                type: 'separator'
            },
            {
                role: 'togglefullscreen'
            }
        ]
    },
    {
        role: 'window',
        submenu: [
            {
                label: 'New',
                accelerator: 'Command+N',
                click(item, focusedWindow) {
                    if (!focusedWindow) {
                        createWindow();
                    }
                }
            },
            {
                role: 'minimize'
            },
            {
                role: 'close'
            }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'www.thegoldax.com',
                click() {
                    electron.shell.openExternal('http://www.thegoldax.com');
                }
            }
        ]
    }
];
const menu = Menu.buildFromTemplate(template);

function createWindow() {
    // Create the browser window.
    let displays = electron.screen.getAllDisplays();
    let externalDisplay = displays.find((display) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0;
    });

    const {
        width,
        height
    } = electron.screen.getPrimaryDisplay().workAreaSize;

    mainWindow = new BrowserWindow({
        title: 'Goldax',
        fullscreenable: true,
        center: true,
        width: width,
        height: height,
        transparent: false,
        frame: true
    });

    // clear cache
    const ses = mainWindow.webContents.session;
    ses.clearCache(() => {
        // and load the index.html of the app.
        let homeURL = `file://${__dirname}/ng-app-dist/index.html`;
        if (process.env.NODE_ENV == 'development') {
            const PORT = process.env.PORT;
            homeURL = 'http://localhost:' + PORT;
            // Open the DevTools.
            mainWindow.webContents.openDevTools();
        } else {
            homeURL = 'env_static_ip' + ':' + 'env_port';
            // homeURL = 'http://' + process.env.STATIC_IP + ':' + process.env.PORT;
            // console.log(homeURL);
        }
        mainWindow.loadURL(homeURL);

        // Emitted when the window is closed.
        mainWindow.on('closed', function () {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            mainWindow = null;
        });
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
    createWindow();

    Menu.setApplicationMenu(menu);
    console.log(app.getPath('userData'));
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
