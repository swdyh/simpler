const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
let mainWindow

console.log(app.getAppPath())

function createWindow() {
    mainWindow = new BrowserWindow({ width: 950, height: 600,
                                     titleBarStyle: 'hidden' })
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

function setupMenu() {
    const Menu = electron.Menu
    const template = [
        {
            label: 'Edit',
            submenu: [
                {role: 'undo'},
                {role: 'redo'},
                {type: 'separator'},
                {role: 'cut'},
                {role: 'copy'},
                {role: 'paste'},
                {role: 'pasteandmatchstyle'},
                {role: 'delete'},
                {role: 'selectall'}
            ]
        },
        {
            label: 'View',
            submenu: [
                {role: 'reload'},
                {role: 'forcereload'},
                {role: 'toggledevtools'},
                {type: 'separator'},
                {role: 'resetzoom'},
                {role: 'zoomin'},
                {role: 'zoomout'},
                {type: 'separator'},
                {role: 'togglefullscreen'},
                {
                    label: 'OpenDevTool (webview)',
                    click () { mainWindow.webContents.executeJavaScript("document.querySelector('webview').openDevTools()") },
                    accelerator: 'Alt+Cmd+I'
                },
                {
                    label: 'OpenDevTool (main)',
                    click () { mainWindow.openDevTools() },
                    accelerator: 'Alt+Cmd+J'
                }
            ]
        },
        {
            role: 'window',
            submenu: [
                {role: 'minimize'},
                {role: 'close'}
            ]
        },
        {
            label: 'Style',
            submenu: [
                {
                    label: 'Font', submenu: [
                        { label: 'Default', click () { mainWindow.webContents.executeJavaScript("insertCSS('font_default')") } },
                        { label: 'YuGothic', click () { mainWindow.webContents.executeJavaScript("insertCSS('font_yugothic')") } },
                        { label: 'Serif', click () { mainWindow.webContents.executeJavaScript("insertCSS('font_serif')") } },
                        { label: 'SourceHanSans', click () { mainWindow.webContents.executeJavaScript("insertCSS('font_source_han_sans')") } }
                    ]
                },
                {
                    label: 'Theme', submenu: [
                        { label: 'Default', click () { mainWindow.webContents.executeJavaScript("insertCSS('theme_default')") } },
                        { label: 'Night', click () { mainWindow.webContents.executeJavaScript("insertCSS('theme_night')") } }
                    ]
                },
            ]
        },
        {
            label: 'Tool',
            submenu: [
                {
                    label: 'ToggleSideMenu',
                    click () { mainWindow.webContents.executeJavaScript("toggle()") },
                    accelerator: 'CmdOrCtrl+T', // TODO
                },
                {
                    label: 'ChangeFont default',
                    click () { mainWindow.webContents.executeJavaScript("changeFont('-apple-system')") }
                },
                {
                    label: 'ChangeFont seif',
                    click () {
                        mainWindow.webContents.executeJavaScript("insertCSS('font_serif')")

                    }
                },
                {
                    label: 'ChangeFont Yu Gothic',
                    click () { mainWindow.webContents.executeJavaScript("changeFont('YuGothic')") }
                }
            ]
        }
    ]
    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                {role: 'about'},
                {type: 'separator'},
                {role: 'services', submenu: []},
                {type: 'separator'},
                {role: 'hide'},
                {role: 'hideothers'},
                {role: 'unhide'},
                {type: 'separator'},
                {role: 'quit'}
            ]
        })
        template[3].submenu = [
            {role: 'close'},
            {role: 'minimize'},
            {role: 'zoom'},
            {type: 'separator'},
            {role: 'front'}
        ]
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
      createWindow()
  }
})

app.on('ready', function() {
    createWindow()
    setupMenu()
})
