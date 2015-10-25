(function() {
  var AppWindow, EventEmitter, app, ipc, shell, window,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  shell = require('shell');

  window = require('browser-window');

  ipc = require('ipc');

  app = require('app');

  EventEmitter = require('events').EventEmitter;

  AppWindow = (function(superClass) {
    extend(AppWindow, superClass);

    function AppWindow(manifest, options) {
      var defaults;
      AppWindow.__super__.constructor.call(this);
      defaults = {
        title: manifest.name,
        'min-width': 520,
        'min-height': 520,
        frame: false,
        resizable: true,
        show: true,
        icon: 'assets/images/icon.png',
        transparent: true,
        center: true,
        'web-preferences': {
          'webaudio': true,
          'web-security': false,
          'use-content-size': true,
          'subpixel-font-scaling': true,
          'direct-write': true,
          'plugins': true
        }
      };
      this.settings = Object.assign(defaults, options);
      this.window = this.createBrowserWindow(this.settings);
      if (!this.window.webContents.isDevToolsOpened() && process.env.NODE_ENV === 'dev') {
        this.window.webContents.toggleDevTools();
      }
      this.bindIpc(this.window);
    }

    AppWindow.prototype.createBrowserWindow = function(settings) {
      var browserWindow;
      browserWindow = new window(settings);
      browserWindow.webContents.on('new-window', function(event, url) {
        event.preventDefault();
        return shell.openExternal(url);
      });
      return browserWindow;
    };

    AppWindow.prototype.bindIpc = function() {
      ipc.on('close', (function(_this) {
        return function() {
          app.quit();
        };
      })(this));
      ipc.on('open-url-in-external', function(event, url) {
        shell.openExternal(url);
      });
      ipc.on('userdir', (function(_this) {
        return function(evt, arg) {
          return evt.returnValue = require('app').getPath('userDesktop');
        };
      })(this));
      ipc.on('focus', (function(_this) {
        return function() {
          _this.window.focus();
        };
      })(this));
      ipc.on('minimize', (function(_this) {
        return function() {
          _this.window.minimize();
        };
      })(this));
      ipc.on('maximize', (function(_this) {
        return function() {
          _this.window.maximize();
        };
      })(this));
      ipc.on('resize', function(e, size) {
        var height, width;
        if (this.window.isMaximized()) {
          return;
        }
        width = this.window.getSize()[0];
        height = width / size.ratio | 0;
        this.window.setSize(width, height);
      });
      ipc.on('enter-full-screen', (function(_this) {
        return function() {
          _this.window.setFullScreen(true);
        };
      })(this));
      ipc.on('exit-full-screen', (function(_this) {
        return function() {
          _this.window.setFullScreen(false);
          _this.window.show();
        };
      })(this));
    };

    AppWindow.prototype.loadUrl = function(targetUrl) {
      return this.window.loadUrl(targetUrl);
    };

    AppWindow.prototype.show = function() {
      return this.window.show();
    };

    AppWindow.prototype.close = function() {
      this.window.close();
      return this.window = null;
    };

    return AppWindow;

  })(EventEmitter);

  module.exports = AppWindow;

}).call(this);
