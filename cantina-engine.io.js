var app = require('cantina')
  , engine = require('oil')
  , conf = app.conf.get('engine.io');

if (!app.server || !app.server.listen) throw new Error('No valid server found on app.server');

// Expose oil api.
app.io = engine.attach(app.server, conf);

// Add useful hooks and events.
app.server.once('listening', function () {
  app.io.on('connection', function (socket) {
    app.hook('io:handshake').run(socket, function (err) {
      if (err) return app.emit('error', err);
      app.emit('io:connected', socket);
      socket.once('close', function () {
        app.emit('io:disconnected');
      });
    });
  });
  app.emit('io:listening');
});
