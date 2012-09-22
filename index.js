var app = require('cantina'),
    engine = require('oil');

app.on('init', function() {
  var conf = app.conf.get('engine.io');

  app.http.once('listening', function () {
    app.io = engine.attach(app.http, conf);

    app.io.on('connection', function (socket) {
      app.invoke('io:handshake', socket, function(err) {
        if (err) {
          app.emit('error', err);
          return;
        }
        app.emit('io:connected', socket);
        socket.once('close', function () {
          app.emit('io:disconnected', socket);
        });
      });
    });

    app.emit('io:listening');
  });
});

app.on('ready', function() {
  // Provide default handshake callback.
  if (!app.listeners('io:handshake').length) {
    app.on('io:handshake', function(socket, done) {
      done(null);
    });
  }
});