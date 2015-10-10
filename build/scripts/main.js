(function() {
  var app, child_process, main, manifest, path;

  app = require('app');

  main = require('./application');

  manifest = require('../../package.json');

  path = require('path');

  child_process = require('child_process');

  process.on('uncaughtException', function(error) {
    return console.error(error.stack);
  });

  (function() {
    app.on('ready', function() {
      global.application = new main(manifest);
    });
  })();

}).call(this);
