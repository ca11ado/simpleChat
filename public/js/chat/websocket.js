/**
 * Created by tos on 07.11.2015.
 */

let keyMirror = require('keymirror');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

let _socket;
let types = keyMirror({
  NEW: null,
  MESSAGE: null
});

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

let WS = assign({}, EventEmitter.prototype, {

  connect: function(url) {
    if (_socket) return Error('Уже есть соединение');

    _socket = new WebSocket(url);

    _socket.onopen = function() {
      _socket.send('Hello world');
    };
    _socket.onclose = function(event) { console.log('Код: ' + event.code + ' причина: ' + event.reason); };
    _socket.onmessage = function(event) {
      WS.emit('myMsg', event.data);
      //console.log("Получены данные " + event.data);
    };
    _socket.onerror = function(error) { console.log("Ошибка " + error.message); };

    return _socket;
  },

  getSocket: function() {
    return _socket;
  }

});


module.exports = WS;