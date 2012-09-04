/**
 * engine.io cantina plugin
 */

var engine = require('oil')

exports.name = 'engine.io';

exports.dependencies = {
  'http': '~1.0'
};

exports.init = function (app, done) {
  var conf = app.conf.get('engine.io');

  app.http.once('listening', function () {
    app.io = engine.attach(app.http, conf);

    app.io.on('connection', function (socket) {
      if (app.io.handshakeCallback) {
        app.io.handshakeCallback(socket, function (err) {
          if (err) {
            app.emit('error', err);
            return;
          }
          emitSocket();
        });
      }
      else {
        emitSocket();
      }

      function emitSocket() {
        app.emit('io:connected', socket);

        socket.once('close', function () {
          app.emit('io:disconnected', socket);
        });
      }
    });

    app.emit('io:listening');
  });

  done();
};