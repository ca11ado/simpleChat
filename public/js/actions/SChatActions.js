/**
 * Created by tos on 08.11.2015.
 */

let SChatDispatcher = require('../dispatcher/SChatDispatcher'),
    SChatConstants = require('../constants/SChatConstants');

module.exports = {
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
    }
};