'use strict';

var http = require('http');
var stat = require('node-static');
var fileServer = new stat.Server('./public', { cache: 0 });
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
  let _name;

  if (WebSocket.isWebSocket(request)) {
    var ws = new WebSocket(request, socket, body);

    ws.on('message', function(event) {
      try {
        var msg = JSON.parse(event.data);
      } catch (e) {
        console.log('Parsing error: ',e);
      }
      msg = msg ? msg : {};
      msg.type = msg.type ? msg.type : 'unknown';

      switch (msg.type) {
        case Msg.getMsgTypes().AUTH:
          if (checkRegistered(msg.data.userName)) {
            msg.data.status = 'exist';
          } else {
            msg.data.status = 'success';
            addRegistered(msg.data.userName);
            _name = msg.data.userName;
          }
          ws.send(JSON.stringify(msg));
          ws.send(JSON.stringify(Msg.createUserList({users:_registeredUsers}))); //todo в отдельный компонент рассылающий всем зарегестрированным список пользователей
          break;
        default:
              //unknown
      }
    });

    ws.on('close', function(event) {
      console.log('close', event.code, event.reason);
      ws = null;
      delRegistered(_name);
    });
  }
});

let _registeredUsers = ['admin','test'];
function checkRegistered(userName) {
  let result = false;
  _registeredUsers.map(function (v) {
    if (v === userName) result = true;
  });
  return result;
}
function addRegistered(userName) {
  _registeredUsers.push(userName);
  console.log(_registeredUsers);
}
function delRegistered(userName) {
  console.log(userName);
  _registeredUsers = _registeredUsers.map(function (v) {
    if (v === userName) return '';
    else return v;
  });
  console.log(_registeredUsers);
}
