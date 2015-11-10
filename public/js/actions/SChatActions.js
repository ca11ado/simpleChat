/**
 * Created by tos on 08.11.2015.
 */

let SChatDispatcher = require('../dispatcher/SChatDispatcher'),
    SChatConstants = require('../constants/SChatConstants');

module.exports = {
  connectToWS: function(url) {
    //console.log('f:SChatActions > Websocket connecting to url %o', url);
    SChatDispatcher.dispatch({
      actionType: SChatConstants.CONNECT_TO_WS,
      url: url
    });
  },
  connectedToWebSocket: function(){
    //console.log('f:SChatActions > WebSocket connected');
    SChatDispatcher.dispatch({
        actionType: SChatConstants.CONN_OPEN
    });
  },
  authorized: function(userName,status) {
    //console.log('f:SChatActions > user %o authorized', userName);
    SChatDispatcher.dispatch({
        actionType: SChatConstants.AUTHORIZED,
        userName: userName,
        status: status
    })
  },
  updateUserList: function(users) {
    //console.log('f:SChatActions > new userList %o', users);
    SChatDispatcher.dispatch({
      actionType: SChatConstants.UPDATE_USERS_LIST,
      users: users
    })
  },
  sendMessage: function(msg) {
    //console.log('f:SChatActions > send message %o', msg);
    SChatDispatcher.dispatch({
      actionType: SChatConstants.WS_MESSAGE_SEND,
      msg: msg
    })
  },
  receiveMessage: function(msgObj){
    //console.log('f:SChatActions > receive message %o', msgObj);
    SChatDispatcher.dispatch({
      actionType: SChatConstants.WS_MESSAGE_RECEIVE,
      msgObj: msgObj
    })
  },
  receiveHistory: function(messages){
    //console.log('f:SChatActions > receive history %o', messages);
    SChatDispatcher.dispatch({
      actionType: SChatConstants.WS_MESSAGE_HISTORY,
      messages: messages
    })
  },
  infoMessage: function(msg) {
    //console.log('f:SChatActions > receive info message %o', msg);
    SChatDispatcher.dispatch({
      actionType: SChatConstants.WS_INFO_MSG,
      msg: msg
    })
  }
};