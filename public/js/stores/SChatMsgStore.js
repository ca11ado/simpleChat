/**
 * Created by tos on 08.11.2015.
 */

let SChatDispatcher = require('../dispatcher/SChatDispatcher'),
    SChatConstants = require('../constants/SChatConstants'),
    Emitter = require('../lib/emiter');

const CHANGE_EVENT = 'change';

let _message;

let SChatMsgStore = Object.assign({}, Emitter.prototype, {

  addChangeListener: function(callback) {
    this.addMyListener(CHANGE_EVENT, callback);
  },

  getMessage: function() {
    let m = _message;
    _message = '';
    return m;
  }

});

SChatDispatcher.register(function(action){
  switch (action.actionType) {
    case SChatConstants.CONN_OPEN:

      break;
    case SChatConstants.WS_MESSAGE_SEND:

      SChatMsgStore.emit(CHANGE_EVENT);
      break;
    default:
    //nothing
  }
});

module.exports = SChatMsgStore;