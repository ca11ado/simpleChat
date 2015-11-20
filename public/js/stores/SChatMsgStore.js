/**
 * Created by tos on 08.11.2015.
 */

'use strict';

let SChatDispatcher = require('../dispatcher/SChatDispatcher'),
    SChatConstants = require('../constants/SChatConstants'),
    Emitter = require('../lib/emiter');

const CHANGE_EVENT = 'change';

let _sendingMessage,
    _receivedMessage,
    _url,
    _autoScrollEnabled = true,
    _positionToScroll;

function updateSendedMsg(msg){
  _sendingMessage = msg;
}

function updateReceivedMsg(msgObj) {
  _receivedMessage = msgObj;
}

function updateUrl(url) {
  _url = url;
}

function updateAutoScrollStatus(enabled) {
  _autoScrollEnabled = enabled;
}

function updatePositionToScroll (position) {
  _positionToScroll = position;
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
  },

  getAutoScrollStatus: function() {
    return _autoScrollEnabled;
  },

  getPositionToScroll: function() {
    let _position = _positionToScroll;
    _positionToScroll = null;
    return _position;
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
    case SChatConstants.WS_MESSAGE_HISTORY:
      action.messages.map(function (v) {
        updateReceivedMsg(v);
        SChatMsgStore.emit(CHANGE_EVENT);
      });
      break;
    case SChatConstants.SCROLL_AUTO_ENABLED:
      updateAutoScrollStatus(action.status);
      SChatMsgStore.emit(CHANGE_EVENT);
      break;
    case SChatConstants.SCROLL_TO:
      updatePositionToScroll(action.position);
      SChatMsgStore.emit(CHANGE_EVENT);
      break;
    default:
    //nothing
  }
});

module.exports = SChatMsgStore;