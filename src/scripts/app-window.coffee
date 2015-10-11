shell  = require 'shell'
window = require 'browser-window'
ipc    = require 'ipc'

{ EventEmitter } = require 'events'

class AppWindow extends EventEmitter
  constructor: (manifest, options) ->
    super()

    defaults =
      title: manifest.name
      'min-width': 520
      'min-height': 520
      frame: false
      resizable: true
      show: true
      icon: 'assets/images/icon.png'
      transparent: true
      center: true
      'web-preferences': 
        'webaudio': true,
        'web-security': false,
        'use-content-size': true,
        'subpixel-font-scaling': true,
        'direct-write': true,
        'plugins': true

    @settings = Object.assign defaults, options
    @window = @createBrowserWindow @settings

    if not @window.webContents.isDevToolsOpened() and process.env.NODE_ENV is 'dev'
      @window.webContents.toggleDevTools()

    @bindIpc @window

  createBrowserWindow: (settings) ->
    browserWindow = new window settings

    browserWindow.webContents.on 'new-window', (event, url) ->
      event.preventDefault()
      shell.openExternal(url)

    browserWindow

  bindIpc: ->
    ipc.on 'close', =>
      app.quit()
      return

    ipc.on 'open-url-in-external', (event, url) ->
      shell.openExternal url
      return

    ipc.on 'userdir', (evt, arg) =>
      evt.returnValue = require('app').getPath 'home'

    ipc.on 'focus', =>
      @window.focus()
      return

    ipc.on 'minimize', =>
      @window.minimize()
      return

    ipc.on 'maximize', =>
      @window.maximize()
      return

    ipc.on 'resize', (e, size) ->
      if @window.isMaximized()
        return
      
      width = @window.getSize()[0]
      height = width / size.ratio | 0
      
      @window.setSize width, height

      return 

    ipc.on 'enter-full-screen', =>
      @window.setFullScreen true
      return

    ipc.on 'exit-full-screen', =>
      @window.setFullScreen false
      @window.show()
      return

    return

  loadUrl: (targetUrl) ->
    @window.loadUrl targetUrl

  show: ->
    @window.show()

  close: ->
    @window.close()
    @window = null

module.exports = AppWindow
