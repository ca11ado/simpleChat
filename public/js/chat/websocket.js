/**
 * Created by tos on 07.11.2015.
 */
let SChatActions = require('../actions/SChatActions'),
    MsgTypes = require('./Message').getMsgTypes();

let _socket,
    _events = {};
const WS_TYPE_NEW = 'new',
      WS_TYPE_MSG = "message";

function message(type,data) {
  switch (type) {
    case types.NEW:
      return {type: types.NEW, login: data.login};
      break;
    case types.MESSAGE:
      return {type: types.MESSAGE, login:data.login, msg: data.msg, time: data.time};
      break;
    default :
      //nothing
  }
}

let WS = {

  connect: function(url) {
    console.log('starting ws');
    if (_socket) return Error('Уже есть соединение');

    _socket = new WebSocket(url);

    _socket.onopen = function() {
      SChatActions.connectedToWebSocket();
      /*setTimeout(function () {
        _socket.send('New test user');
      }, 2000);*/
    };
    _socket.onclose = function(event) { console.log('Код: ' + event.code + ' причина: ' + event.reason); };
    _socket.onmessage = function(event) {
      console.log("f:websocket > получены данные %o", event.data);
      //SChatActions.authorized('Test');
      switch (event.data.type) {
        case MsgTypes.AUTH:
          SChatActions.authorized(event.data.userName);
          break;
        default:
              //todo don't know this type
      }
    };
    _socket.onerror = function(error) { console.log("Ошибка " + error.message); };

    return _socket;
  },

  getSocket: function() {
    return _socket;
  },

  sendMsg: function(msg) {
    if (_socket) _socket.send(msg);
    else new Error('Socket does not exist yet');
    console.log('Send message %o', JSON.stringify(msg));
  },

  sendTestMsg: function(txt) {
    _socket.send(txt);
  }

};

module.exports = WS;