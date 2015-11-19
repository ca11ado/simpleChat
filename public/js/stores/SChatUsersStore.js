/**
 * Created by tos on 08.11.2015.
 */

'use strict';

let SChatDispatcher = require('../dispatcher/SChatDispatcher'),
    SChatConstants = require('../constants/SChatConstants'),
    Emitter = require('../lib/emiter');

const CHANGE_EVENT = 'change';
let _users = [],
    _userName,
    _registeredUsers = [];

function updateUsers(newUsers) {
    _users = newUsers;
}

function setUserName(name) {
  _userName = name;
}

function updateRegisteredUsers(users) {
  _registeredUsers = users;
}

let SChatUsersStore = Object.assign({}, Emitter.prototype, {

  addChangeListener: function(callback) {
      this.addMyListener(CHANGE_EVENT, callback);
  },

  getUserName: function() {
    return _userName;
  },

  getRegisteredUsers: function() {
    return _registeredUsers;
  }

});

SChatDispatcher.register(function(action){
    switch (action.actionType) {
      case SChatConstants.AUTHORIZED:
        if (action.status === 'success') {
            setUserName(action.userName);
            SChatUsersStore.emit(CHANGE_EVENT);
        }
        break;
      case SChatConstants.UPDATE_USERS_LIST:
        updateRegisteredUsers(action.users);
        SChatUsersStore.emit(CHANGE_EVENT);
        break;
        default:
            //nothing
    }
});

module.exports = SChatUsersStore;