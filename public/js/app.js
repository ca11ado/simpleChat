/**
 * Created by tos on 06.11.2015.
 */

let SChatComponent = require('./components/SChatComponent'),
    SChatUsersStore = require('./stores/SChatUsersStore'),
    SChatWebSocketComponent = require('./components/SChatWebSocketComponent'),
    SChatActions = require('./actions/SChatActions');

console.log('starting app');

SChatActions.connectedToWebSocket('ws://localhost:8080');

/* operator ...spread
function testFn(...rest) {
    console.log(rest);
}
testFn('dd', 'tt', 'pp');*/
