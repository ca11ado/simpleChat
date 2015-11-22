'use strict';

var http = require('http');
var stat = require('node-static');
var fileServer = new stat.Server('./public', { cache: 3600 });
var Msg = require('../public/js/chat/Message');
var Channel = require('./channel');
let OutLog = require('./output');

var WebSocket = require('faye-websocket');

let chn = new Channel('def');
let check = require('./check');

let connLog = new OutLog('Информация о соединениях');
connLog.show();

var server = http.createServer(function (request, response) {
  request.addListener('end', function () {
    //console.log(request.url);
    fileServer.serve(request, response, function (e, res) {
    });
  }).resume();
}).listen(8080);

server.on('upgrade', function(request, socket, body) {
  let _name,
      _lastMsgTime;

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
          chn.sendHistory(ws);
          chn.sendSystemMsg('Пользователь ' + _name + ' зашел в чат');
          chn.broadcastUserList();

          connLog.addLine('Количество соединений', chn.clientsCount());
          break;

        case Msg.getMsgTypes().MESSAGE:
          if (_lastMsgTime) _restrict = check.frequency(_lastMsgTime);

          _msgText = msg.data.text;
          _msgTime = msg.data.time;
          _restrict = _restrict.error ? _restrict : check.messageText(_msgText);
          if (_msgText && _msgTime && !_restrict.error) {
            _msg = Msg.createMessage({userName:_name,text:_msgText,time:_msgTime});
            chn.broadcast(_msg);
            _lastMsgTime = new Date();
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
      //console.log('close', event.code, event.reason);
      chn.unSubscribe(ws, _name);
      ws = null;
      chn.sendSystemMsg('Пользователь ' + _name + ' вышел из чата');
      chn.broadcastUserList();
      connLog.addLine('Количество соединений', chn.clientsCount());
    });
  }
});