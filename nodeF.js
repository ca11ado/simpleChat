var http = require('http');
var static = require('node-static');
var fileServer = new static.Server('./public', { cache: 0 });
var Msg = require('./public/js/chat/Message');

var WebSocket = require('faye-websocket');



var server = http.createServer(function (request, response) {
  request.addListener('end', function () {
    fileServer.serve(request, response, function (e, res) {
      /*if (e && (e.status === 404)) { // If the file wasn't found
        console.log(e);
        fileServer.serveFile('./public/not-found.html', 404, {}, request, response);
      }*/
    });
  }).resume();
}).listen(8080);

server.on('upgrade', function(request, socket, body) {
  if (WebSocket.isWebSocket(request)) {
    var ws = new WebSocket(request, socket, body);

    ws.on('message', function(event) {
      //console.log(JSON.parse(event.data));
      try {
        var msg = JSON.parse(event.data);
      } catch (e) {
        console.log('Parsing error: ',e);
      }

      msg = msg ? msg : {};
      msg.type = msg.type ? msg.type : 'unknown';
      switch (msg.type) {
        case Msg.getMsgTypes().AUTH:
          msg.status = 'success';
            ws.send(JSON.stringify(msg));
          break;
        default:
              //unknown
      }
      //ws.send(event.data);
    });

    ws.on('close', function(event) {
      console.log('close', event.code, event.reason);
      ws = null;
    });
  }
});
