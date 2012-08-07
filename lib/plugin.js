/**
 * engine.io cantina plugin
 */

var engine = require('oil')
  , utils = require('cantina-utils')

utils.pkginfo(module);

exports.attach = function(options) {
  var app = this;

  if (app.mode !== 'http') {
    throw new Error('The cantina-engine.io plugin can only be used with http apps.');
  }

  options = options || {};

  app.on('started', function() {

    app.io = engine.attach(app.server, options);

    app.io.on('connection', function(socket) {
      app.emit('io:connected', socket);

      socket.on('close', function() {
        app.emit('io:disconnected', socket);
      });
    });

    app.emit('io:listening');
  });
};