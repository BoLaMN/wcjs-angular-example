(function() {
  var AppMenu, AppWindow, Application, EventEmitter, app, path, shell, window,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  app = require('app');

  path = require('path');

  shell = require('shell');

  window = require('browser-window');

  EventEmitter = require('events').EventEmitter;

  AppMenu = require('./app-menu');

  AppWindow = require('./app-window');

  Application = (function(superClass) {
    extend(Application, superClass);

    function Application(manifest, options) {
      Application.__super__.constructor.call(this);
      this.manifest = manifest;
      this.options = options;
      app.on('window-all-closed', function() {
        if (process.platform !== 'darwin') {
          return app.quit();
        }
      });
      this.menu = this.createMenu();
      this.menu.makeDefault();
      this.mainWindow = new AppWindow(manifest, options);
      this.mainWindow.loadUrl('file://' + path.resolve(__dirname, '..', 'index.html'));
    }

    Application.prototype.createMenu = function() {
      var menu;
      menu = new AppMenu();
      menu.on('application:quit', function() {
        return app.quit();
      });
      menu.on('application:open-url', function(menuItem) {
        return shell.openExternal(menuItem.url);
      });
      menu.on('window:reload', function() {
        return window.getFocusedWindow().reload();
      });
      menu.on('window:toggle-full-screen', function() {
        var focusedWindow;
        focusedWindow = window.getFocusedWindow();
        return focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
      });
      menu.on('window:toggle-dev-tools', function() {
        return window.getFocusedWindow().toggleDevTools();
      });
      return menu;
    };

    return Application;

  })(EventEmitter);

  module.exports = Application;

}).call(this);
