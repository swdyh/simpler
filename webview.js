const fs = require('fs')
const path = require('path')
const {ipcRenderer} = require('electron')

let webview
const css = fs.readdirSync(path.join(__dirname, 'css')).reduce((r, i) => {
    var f = path.join(__dirname, 'css', i)
    r[i.split('.css')[0]] = fs.readFileSync(f).toString('UTF-8')
    return r
}, {})
let updateFont = (font) => {
    if (css[font]) {
        webview.insertCSS(css[font])
        localStorage.configFont = font
    }
}
let updateTheme = (theme) => {
    if (css[theme]) {
        webview.insertCSS(css[theme])
        localStorage.configTheme = theme
    }
}
let insertCSS = (cssName) => {
    webview.insertCSS(css[cssName] || '')
}
let showSidebar = false
let toggle = () => {
    webview.insertCSS(showSidebar ? css.hide_sidebar : css.show_sidebar)
    showSidebar = !showSidebar
}
let signout = () => {
    webview.executeJavaScript("document.querySelector('#signoutform').submit()")
}

onload = () => {
    webview = document.querySelector('webview')
    const loadstop = () => {
        if (webview.getURL() == 'https://app.simplenote.com/') {
            webview.insertCSS(css.base)
            if (localStorage.configFont) {
                webview.insertCSS(css[localStorage.configFont])
            }
            if (localStorage.configTheme) {
                webview.insertCSS(css[localStorage.configTheme])
            }
        }
        setTimeout(() => { webview.classList.remove('hide') }, 100)
    }
    webview.addEventListener('dom-ready', loadstop)
    window.addEventListener('focus', () => webview.focus())
    ipcRenderer.on('open-dev-tool', () => webview.openDevTools())
    ipcRenderer.on('signout', signout)
    ipcRenderer.on('toggle', toggle)
    ipcRenderer.on('update-font', (event, arg) => updateFont(arg))
    ipcRenderer.on('update-theme', (event, arg) => updateTheme(arg))
    ipcRenderer.send('initial-config', {
        font: localStorage.configFont,
        theme: localStorage.configTheme
    })
}
