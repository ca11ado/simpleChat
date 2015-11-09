/**
 * Created by tos on 08.11.2015.
 */

let SChatActions = require('../actions/SChatActions'),
    MsgTypes = require('../chat/Message').getMsgTypes(),
    SChatMsgStore = require('../stores/SChatMsgStore');

let _socket,
    _events = {};

const WS_TYPE_NEW = 'new',
      WS_TYPE_MSG = "message";

let WS = {

  connect: function(url) {
    console.log('f:SChatWebSocketComponent > starting ws');
    if (_socket) return Error('Уже есть соединение');

    _socket = new WebSocket(url);

    _socket.onopen = function() {
      SChatActions.connectedToWebSocket();
    };

    _socket.onclose = function(event) {
      console.log('Код: ' + event.code + ' причина: ' + event.reason);
    };

    _socket.onmessage = function(event) {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch (e) {
        console.log('Parsing error ', e);
      }
      console.log("f:SChatWebSocketComponent > получены данные %o", event.data);
      switch (msg.type) {
        case MsgTypes.AUTH:
          SChatActions.authorized(msg.data.userName,msg.data.status);
          break;
        case MsgTypes.USERLIST:
          SChatActions.updateUserList(msg.data.users);
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
    msg = JSON.stringify(msg);
    if (_socket) _socket.send(msg);
    else new Error('Socket does not exist yet');
  },

  sendTestMsg: function(msg) {
    _socket.send(msg);
  }

};

SChatMsgStore.addChangeListener(function () {
  if (!_socket) {
    WS.connect(SChatMsgStore.getUrl());
  }

  let wsMsg = SChatMsgStore.getMessage();
  if (wsMsg) WS.sendMsg(wsMsg);
});

module.exports = WS;