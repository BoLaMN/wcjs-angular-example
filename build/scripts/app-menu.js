(function() {
  var AppMenu, EventEmitter, Menu,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Menu = require('menu');

  EventEmitter = require('events').EventEmitter;

  AppMenu = (function(superClass) {
    extend(AppMenu, superClass);

    function AppMenu() {
      var template;
      AppMenu.__super__.constructor.call(this);
      template = require('./menus/' + process.platform);
      this.wireUpCommands(template);
      this.menu = Menu.buildFromTemplate(template);
    }

    AppMenu.prototype.makeDefault = function() {
      return Menu.setApplicationMenu(this.menu);
    };

    AppMenu.prototype.wireUpCommands = function(submenu) {
      return submenu.forEach((function(_this) {
        return function(item) {
          var existingOnClick;
          if (item.command) {
            existingOnClick = item.click;
            item.click = function() {
              _this.emit(item.command, item);
              if (existingOnClick) {
                return existingOnClick();
              }
            };
          }
          if (item.submenu) {
            return _this.wireUpCommands(item.submenu);
          }
        };
      })(this));
    };

    return AppMenu;

  })(EventEmitter);

  module.exports = AppMenu;

}).call(this);
