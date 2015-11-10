/**
 * Created by tos on 08.11.2015.
 */

let SChatDispatcher = require('../dispatcher/SChatDispatcher'),
    SChatConstants = require('../constants/SChatConstants'),
    Emitter = require('../lib/emiter');

const CHANGE_EVENT = 'change';

let _sendingMessage,
    _receivedMessage,
    _url;

function updateSendedMsg(msg){
  _sendingMessage = msg;
}

function updateReceivedMsg(msgObj) {
  _receivedMessage = msgObj;
}

function updateUrl(url) {
  _url = url;
}

let SChatMsgStore = Object.assign({}, Emitter.prototype, {

  addChangeListener: function(callback) {
    this.addMyListener(CHANGE_EVENT, callback);
  },

  getSendingMessage: function() {
    let m = _sendingMessage;
    _sendingMessage = '';
    return m;
  },

  getReceivedMessage: function() {
    let mObj = _receivedMessage;
    _receivedMessage = '';
    return mObj;
  },

  getUrl: function(){
    return _url;
  }

});

SChatDispatcher.register(function(action){
  switch (action.actionType) {
    case SChatConstants.CONNECT_TO_WS:
      updateUrl(action.url);
      SChatMsgStore.emit(CHANGE_EVENT);
      break;
    case SChatConstants.WS_MESSAGE_SEND:
      updateSendedMsg(action.msg);
      SChatMsgStore.emit(CHANGE_EVENT);
      break;
    case SChatConstants.WS_MESSAGE_RECEIVE:
      updateReceivedMsg(action.msgObj);
      SChatMsgStore.emit(CHANGE_EVENT);
      break;
    case SChatConstants.WS_SYSMESSAGE_RECEIVE:
      updateReceivedMsg(action.msgObj);
      SChatMsgStore.emit(CHANGE_EVENT);
      break;
    default:
    //nothing
  }
});

module.exports = SChatMsgStore;