/**
 * Created by tos on 08.11.2015.
 */

let SChatDispatcher = require('../dispatcher/SChatDispatcher'),
    SChatConstants = require('../constants/SChatConstants');

module.exports = {
    connectToWS: function(url) {
      SChatDispatcher.dispatch({
        actionType: SChatConstants.CONNECT_TO_WS,
        url: url
      });
    },
    connectedToWebSocket: function(){
        console.log('f:SChatActions > WebSocket connected');
        SChatDispatcher.dispatch({
            actionType: SChatConstants.CONN_OPEN
        });
    },
    authorized: function(userName,status) {
        console.log('f:SChatActions > user %o authorized', userName);
        SChatDispatcher.dispatch({
            actionType: SChatConstants.AUTHORIZED,
            userName: userName,
            status: status
        })
    },
    sendMessage: function(msg) {
      console.log('f:SChatActions > send message %o', msg);
      SChatDispatcher.dispatch({
        actionType: SChatConstants.WS_MESSAGE_SEND,
        msg: msg
      })
    }
};