/**
 * Created by tos on 07.11.2015.
 */

let _socket;

let WS = {

  connect: function(ws) {
    "use strict";
    if (_socket) return Error('Уже есть соединение');
    return _socket = new WebSocket(ws);
  }

};

module.exports = WS;