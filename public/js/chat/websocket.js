/**
 * Created by tos on 07.11.2015.
 */

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
      _socket.send('Hello world2');
    };
    _socket.onclose = function(event) { console.log('Код: ' + event.code + ' причина: ' + event.reason); };
    _socket.onmessage = function(event) {
      //WS.emitMsg('myMsg', event.data);
      console.log("Получены данные " + event.data);
    };
    _socket.onerror = function(error) { console.log("Ошибка " + error.message); };

    return _socket;
  },

  getSocket: function() {
    return _socket;
  },

  onMsg: function(event, callback) {
    _events[event] = _events[event] ? _events[event].push(callback) : [];
  },

  emitMsg: function(event, arg) {
    if (_events.hasOwnProperty(event)) {
      _events[event].map(function(v){
        v(arg);
      });
    }
  },

  sendTestMsg: function(txt) {
    _socket.send(txt);
  }

};

module.exports = WS;