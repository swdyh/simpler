const fs = require('fs')
const path = require('path')

const css = fs.readdirSync(path.join(__dirname, 'css')).reduce((r, i) => {
    var f = path.join(__dirname, 'css', i)
    r[i.split('.css')[0]] = fs.readFileSync(f).toString('UTF-8')
    return r
}, {})
let webview
onload = () => {
    webview = document.querySelector('webview')
    const loadstop = () => {
        webview.insertCSS(css.base)
        setTimeout(() => { webview.classList.remove('hide') }, 100) 
    }
    webview.addEventListener('dom-ready', loadstop)
    window.addEventListener('focus', () => webview.focus())
}
let changeFont = (fontName) => {
    console.log('changeFont')
    webview.insertCSS('.note #txtarea { font-family: "' + fontName + '" !important; }')
}
let insertCSS = (cssName) => {
    console.log('insertCSS')
    webview.insertCSS(css[cssName] || '')
}
let showSidebar = false
let toggle = () => {
    webview.insertCSS(showSidebar ? css.hide_sidebar : css.show_sidebar)
    showSidebar = !showSidebar
}
