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

function fontSubMenu() {
    const fonts = ['Default', 'Serif', 'YuGothic', 'Menlo']
    return fonts.map((fontName) => {
        return {
            label: fontName,
            click () {
                mainWindow.webContents
                    .send('update-font', 'font_' + fontName.toLowerCase())
            }
        }
    })
}

function themeSubMenu() {
    const themes = ['Default', 'Night', 'Solarized']
    return themes.map((themeName) => {
        return {
            label: themeName,
            click () {
                mainWindow.webContents
                    .send('update-theme', 'theme_' + themeName.toLowerCase())
            }
        }
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
                {
                    label: 'Toggle Developer Tools (Webview)',
                    click () { mainWindow.webContents.send('open-dev-tool') },
                    accelerator: 'Alt+Cmd+J'
                },
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
                { label: 'Font', submenu: fontSubMenu() },
                { label: 'Theme', submenu: themeSubMenu() }
            ]
        },
        {
            label: 'Tool',
            submenu: [
                {
                    label: 'Toggle SideMenu',
                    click () {
                        mainWindow.webContents.send('toggle')
                    },
                    accelerator: 'Cmd+B',
                },
                {
                    label: 'Sign Out',
                    click () {
                        mainWindow.webContents.executeJavaScript("signout()") }
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
