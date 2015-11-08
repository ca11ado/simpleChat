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
    updateListOfUsers: function(newList){
      SChatDispatcher.dispatch({
          actionType: SChatConstants.ACTIVATE_LOGIN_FORM,
          list: newList
      });
    },
    connectedToWebSocket: function(){
        console.log('f:SChatActions > WebSocket connected');
        SChatDispatcher.dispatch({
            actionType: SChatConstants.CONN_OPEN
        });
    },
    authorized: function(userName) {
        console.log('f:SChatActions > user %o authorized', userName);
        SChatDispatcher.dispatch({
            actionType: SChatConstants.AUTHORIZED,
            userName: userName
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