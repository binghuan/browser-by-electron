const { app, protocol, ipcMain, nativeTheme, shell, BrowserWindow, session } = require('electron');
const path = require('path');

console.log("process.env", process.env);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  console.log(" app.on [electron-squirrel-startup]");
  app.quit();
}

ipcMain.handle('dark-mode:system', () => {
  console.log("from dark-mode", nativeTheme.themeSource);
  nativeTheme.themeSource = 'system'
  console.log("to dark-mode", nativeTheme.themeSource);
})

ipcMain.handle('dark-mode:dark', () => {
  console.log("from dark-mode", nativeTheme.themeSource);
  nativeTheme.themeSource = 'dark'
  console.log("to dark-mode", nativeTheme.themeSource);
})

ipcMain.handle('dark-mode:light', () => {
  console.log("from dark-mode", nativeTheme.themeSource);
  nativeTheme.themeSource = 'light'
  console.log("to dark-mode", nativeTheme.themeSource);
})

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.on('close', (e) => {
    console.log("// --------------------- EVENT  window.on [close] ------------");
  })

  mainWindow.on('closed', (e) => {
    console.log("// --------------------- EVENT  window.on [closed] ------------");
  })

  mainWindow.on('ready-to-show', (e) => {
    console.log("// --------------------- EVENT  window.on [ready-to-show] -----");
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  console.log("// ---------------- EVENT  app.on [ready]");

  protocol.registerStringProtocol('electron', (request, callback) => {
    console.log(">> registerStringProtocol:", request);
    let reponse = {
      status: "ok",
      data: "hello"
    }
    callback(JSON.stringify(reponse));
  })

  createWindow()

  /*
    Sets the handler which can be used to respond to permission requests for the session. 
    Calling callback(true) will allow the permission and callback(false) will reject it. 
    To clear the handler, call setPermissionRequestHandler(null).
  */
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    console.log(">> setPermissionRequestHandler: ", permission);
    callback(true);
  })

  /*
    Sets the handler which can be used to respond to permission requests for the session. 
    Calling callback(true) will allow the permission and callback(false) will reject it. 
    To clear the handler, call setPermissionRequestHandler(null).
  */
  session.defaultSession.setPermissionCheckHandler((webContents, permission) => {
    console.log(">> setPermissionCheckHandler: ", permission);
    return true;
  })

});


// Listen for web contents being created
app.on('web-contents-created', (e, contents) => {
  console.log("// ---------------- EVENT  app.on [web-contents-created]");

  // Check for a webview
  if (contents.getType() == 'webview') {

    // Listen for any new window events
    contents.on('new-window', (e, url) => {
      console.log("// -------------------------- EVENT  webContents.on [new-window]", url);
      e.preventDefault()
      if (url != "about:blank") {
        shell.openExternal(url)
      }
    })
    contents.on('did-finish-load', (e, url) => {
      console.log("// -------------------------- EVENT  webContents.on [did-finish-load]");
    })
    contents.on('did-frame-finish-load', (e, url) => {
      console.log("// -------------------------- EVENT  webContents.on [did-frame-finish-load]");
    })
    contents.on('did-start-loading', (e, url) => {
      console.log("// -------------------------- EVENT  webContents.on [did-start-loading]");
    })
    contents.on('dom-ready', (e, url) => {
      console.log("// -------------------------- EVENT  webContents.on [dom-ready]");
    })
    contents.on('page-title-updated', (e, url) => {
      console.log("// -------------------------- EVENT  webContents.on [page-title-updated]");
    })
    contents.on('page-favicon-updated', (e, url) => {
      console.log("// -------------------------- EVENT  webContents.on [page-favicon-updated]");
    })
    contents.on('will-navigate', (e, url) => {
      console.log("// -------------------------- EVENT  webContents.on [will-navigate]");
    })
    contents.on('did-navigate', (e, url) => {
      console.log("// -------------------------- EVENT  webContents.on [did-navigate]");
    })
    contents.on('did-start-navigation', (e, url) => {
      console.log("// -------------------------- EVENT  webContents.on [did-start-navigation]");
    })
    contents.on('will-redirect', (e, url) => {
      console.log("// -------------------------- EVENT  webContents.on [will-redirect]");
    })
    contents.on('did-redirect-navigation', (e, url) => {
      console.log("// -------------------------- EVENT  webContents.on [did-redirect-navigation]");
    })
    contents.on('did-frame-navigate', (e, url) => {
      console.log("// -------------------------- EVENT  webContents.on [did-frame-navigate]");
    })
    contents.on('did-navigate-in-page', (e, url) => {
      console.log("// -------------------------- EVENT  webContents.on [did-navigate-in-page]");
    })
    contents.on('will-prevent-unload', (e, url) => {
      console.log("// -------------------------- EVENT  webContents.on [will-prevent-unload]");
    })
  }
});

app.on('activate', () => {
  console.log("// ---------------- EVENT  app.on [activate]");
});

app.on('did-become-active', () => {
  console.log("// ---------------- EVENT  app.on [did-become-active]");
});


app.on('will-finish-launching', () => {
  console.log("// ---------------- EVENT  app.on [will-finish-launching]");

  // configure the protocols
  protocol.registerSchemesAsPrivileged([
    { scheme: 'electron', privileges: { standard: true, secure: true, allowServiceWorkers: true, supportFetchAPI: true, corsEnabled: true } }
  ])

});

app.on('before-quit', () => {
  console.log("// ---------------- EVENT  app.on [before-quit]");
});

app.on('will-quit', () => {
  console.log("// ---------------- EVENT  app.on [will-quit]");
});

app.on('quit', () => {
  console.log("// ---------------- EVENT  app.on [quit]");
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  console.log("// ---------------- EVENT  app.on [window-all-closed]");
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  console.log("// ---------------- EVENT  app.on [activate]");
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

/*

navigator.geolocation.getCurrentPosition(
  success => console.log(success),
  error => console.log(error)
);

*/