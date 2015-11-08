/**
 * Created by tos on 06.11.2015.
 */

let ws = require('./websocket.js');
let dispatcher = require('../dispatcher/SChatDispatcher');

setTimeout(function(){
  ws.sendTestMsg('test message from chat');
},2000);

module.exports = [
  {
    name: 't0s',
    messages: 10
  },
  {
    name: 'test',
    messages: 5
  }
];