/**
 * Created by tos on 06.11.2015.
 */

let SChatComponent = require('./components/SChatComponent'),
    SChatUsersStore = require('./stores/SChatUsersStore'),
    SChatMsgStore = require('./stores/SChatMsgStore'),
    SChatWebSocketComponent = require('./components/SChatWebSocketComponent'),
    SChatActions = require('./actions/SChatActions');

console.log('starting app');

SChatActions.connectToWS('ws://localhost:8080');
