/**
 * Created by tos on 08.11.2015.
 */

let SChatDispatcher = require('../dispatcher/SChatDispatcher'),
    SChatConstants = require('../constants/SChatConstants'),
    Emitter = require('../lib/emiter');

const CHANGE_EVENT = 'change';

let _message,
    _url;

function updateMsg(msg){
  _message = msg;
}

function updateUrl(url) {
  _url = url;
}

let SChatMsgStore = Object.assign({}, Emitter.prototype, {

  addChangeListener: function(callback) {
    this.addMyListener(CHANGE_EVENT, callback);
  },

  getMessage: function() {
    let m = _message;
    _message = '';
    return m;
  },

  getUrl: function(){
    return _url;
  }

});

SChatDispatcher.register(function(action){
  switch (action.actionType) {
    case SChatConstants.AUTHORIZED:
      if (action.status !== 'success') {

        SChatMsgStore.emit(CHANGE_EVENT);
      }
      break;
    case SChatConstants.CONNECT_TO_WS:
      updateUrl(action.url);
      SChatMsgStore.emit(CHANGE_EVENT);
      break;
    case SChatConstants.CONN_OPEN:

      break;
    case SChatConstants.WS_MESSAGE_SEND:
      updateMsg(action.msg);
      SChatMsgStore.emit(CHANGE_EVENT);
      break;
    default:
    //nothing
  }
});

module.exports = SChatMsgStore;