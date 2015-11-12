/**
 * Created by tos on 06.11.2015.
 */

let SChatWebSocketComponent = require('./components/SChatWebSocketComponent'),
    SChatComponent = require('./components/SChatComponent'),
    SChatActions = require('./actions/SChatActions');

console.log('starting app');

SChatActions.connectToWS('ws://localhost:8080');
