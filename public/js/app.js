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

/*
function testFn(...rest) {
    console.log(rest);
}
testFn('dd', 'tt', 'pp');*/
