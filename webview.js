const fs = require('fs')
const path = require('path')
const {ipcRenderer} = require('electron')

let webview
let searchText
let serchForm

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
let search = () => {
    searchForm.style.visibility = 'visible'
    searchText.focus()
}
let searchStop = () => {
    webview.stopFindInPage('clearSelection')
    searchForm.style.visibility = 'hidden'
}
let nextNote = () => {
    webview.executeJavaScript("document.querySelector('ul.notes li.selected').nextSibling.nodeName == 'LI' && document.querySelector('ul.notes li.selected').nextSibling.click()")
}
let prevNote = () => {
    webview.executeJavaScript("document.querySelector('ul.notes li.selected').previousSibling.nodeName == 'LI' && document.querySelector('ul.notes li.selected').previousSibling.click()")
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
    ipcRenderer.on('addnote', () => {
        webview.executeJavaScript("document.querySelector('a.add').click()")
    })
    ipcRenderer.on('deletenote', () => {
        webview.executeJavaScript("document.querySelector('a.delete').click()")
    })
    ipcRenderer.on('toggle', toggle)
    ipcRenderer.on('update-font', (event, arg) => updateFont(arg))
    ipcRenderer.on('update-theme', (event, arg) => updateTheme(arg))
    ipcRenderer.on('search', (event, arg) => search(arg))
    ipcRenderer.on('search-stop', (event, arg) => searchStop(arg))
    ipcRenderer.on('next-note', (event, arg) => nextNote(arg))
    ipcRenderer.on('prev-note', (event, arg) => prevNote(arg))

    ipcRenderer.send('initial-config', {
        font: localStorage.configFont,
        theme: localStorage.configTheme
    })


    searchForm = document.querySelector('#search-form')
    searchForm.addEventListener('submit', (ev) => {
        console.log('sub')
        ev.preventDefault()
        webview.findInPage(searchText.value)
    })
    searchText = document.querySelector('#search-text')
}
