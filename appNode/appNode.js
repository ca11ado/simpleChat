'use strict';

var http = require('http');
var stat = require('node-static');
var fileServer = new stat.Server('./public', { cache: 0 });
var Msg = require('../public/js/chat/Message');
var Channel = require('./channel');

var WebSocket = require('faye-websocket');

let chn = new Channel('def');
let check = require('./check');

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

  let _msg,
      _msgTime,
      _msgText,
      _restrict;

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
          var userTryName = msg.data.userName;
          _restrict = check.userName(userTryName);
            if (_restrict.error) {
              ws.send(JSON.stringify(Msg.createInfo({text:_restrict.errText})));
              break;
            }
          if (chn.isRegistered(msg.data.userName)) {
            ws.send(JSON.stringify(Msg.createInfo({text: 'Имя занято'})));
            break;
          }
          _name = msg.data.userName;
          chn.subscribe(ws,_name);
          ws.send(JSON.stringify(Msg.createAuth({userName:_name,status:'success'})));
          chn.sendSystemMsg('Пользователь ' + _name + ' зашел в чат');
          chn.broadcastUserList();
          break;
        case Msg.getMsgTypes().MESSAGE:
          _msgText = msg.data.text;
          _msgTime = msg.data.time;
          _restrict = check.messageText(_msgText);
          if (_msgText && _msgTime && !_restrict.error) {
            _msg = Msg.createMessage({userName:_name,text:_msgText,time:_msgTime});
            chn.broadcast(_msg);
          }
          if (_restrict.error) {
            ws.send(JSON.stringify(Msg.createInfo({text:_restrict.errText})));
          }
          break;
        default:
              //unknown
      }
    });

    ws.on('close', function(event) {
      console.log('close', event.code, event.reason);
      chn.unSubscribe(ws, _name);
      ws = null;
      chn.broadcastUserList();
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
  //console.log(_registeredUsers);
}
function delRegistered(userName) {
  //console.log(userName);
  _registeredUsers = _registeredUsers.map(function (v) {
    if (v === userName) return '';
    else return v;
  });
  //console.log(_registeredUsers);
}
