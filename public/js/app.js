/**
 * Created by tos on 06.11.2015.
 */

let chat = require('./chat/chat');
let ws = require('./chat/websocket');
let dispatcher = require('./dispatcher/SChatDispatcher');
let component = require('./components/SChatComponent'),
    SChatUsersStore = require('./stores/SChatUsersStore');

console.log('start app');

ws.connect('ws://localhost:8080');

ws.onMsg('myMsg', function (data) {
  console.log('New myMsg message', data);
});

setTimeout(function(){
  ws.sendTestMsg('test message from app');
},2000);