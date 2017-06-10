const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 950,
        height: 600,
        titleBarStyle: 'hidden'
    })
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    mainWindow.on('closed', () => mainWindow = null)
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
                {role: 'togglefullscreen'}
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
                        { label: 'Default', click () { mainWindow.webContents.executeJavaScript("updateFont('font_default')") } },
                        { label: 'YuGothic', click () { mainWindow.webContents.executeJavaScript("updateFont('font_yugothic')") } },
                        { label: 'Serif', click () { mainWindow.webContents.executeJavaScript("updateFont('font_serif')") } },
                        { label: 'Menlo', click () { mainWindow.webContents.executeJavaScript("updateFont('font_menlo')") } }
                    ]
                },
                {
                    label: 'Theme', submenu: [
                        { label: 'Default', click () { mainWindow.webContents.executeJavaScript("updateTheme('theme_default')") } },
                        { label: 'Night', click () { mainWindow.webContents.executeJavaScript("updateTheme('theme_night')") } },
                        { label: 'Solarized', click () { mainWindow.webContents.executeJavaScript("updateTheme('theme_solarized')") } }
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
                    label: 'Sign Out',
                    click () {
                        mainWindow.webContents.executeJavaScript("signout()") }
                },
                {
                    label: 'OpenDevTool (webview)',
                    click () {
                        mainWindow.webContents.send('open-dev-tool')
                    },
                    accelerator: 'Alt+Cmd+I'
                },
                {
                    label: 'OpenDevTool',
                    click () { mainWindow.openDevTools() },
                    accelerator: 'Alt+Cmd+J'
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

app.on('window-all-closed', () => app.quit())

app.on('activate', () => {
    if (mainWindow === null) {
      createWindow()
  }
})

app.on('ready', () => {
    createWindow()
    setupMenu()
})
