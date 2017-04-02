const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

let mainWindow

function createWindow () {

  // /usr/bin/google-chrome-stable --proxy-server="socks=localhost:12345" --proxy-bypass-list="*.oracle.com;*.oraclecorp.com;*.lan"  %U
  //app.commandLine.appendSwitch("proxy-server", "socks=localhost:12345")
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 })
  mainWindow.setMinimizable(false)
  mainWindow.setMenu(null)


  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "src", "index.html"),
    protocol: 'file:',
    slashes: true
  }))

  //mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  // Hack for iframe x-frame-options denying request
  // (can't use webview due to crashing electron)
  mainWindow.webContents.session.webRequest.onHeadersReceived({}, (d, c) => {
    if(d.responseHeaders['x-frame-options'] || d.responseHeaders['X-Frame-Options']){
        delete d.responseHeaders['x-frame-options'];
        delete d.responseHeaders['X-Frame-Options'];
    }
    d.responseHeaders['Access-Control-Allow-Origin'] = "*"
    c({cancel: false, responseHeaders: d.responseHeaders});
  });
}

// We need to call this outside "ready" otherwise
// Subvertise will stop running when it's backgrounded.
app.commandLine.appendSwitch('disable-renderer-backgrounding')
app.on('ready', createWindow)

app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
