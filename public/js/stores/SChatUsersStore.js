/**
 * Created by tos on 08.11.2015.
 */

let SChatDispatcher = require('../dispatcher/SChatDispatcher'),
    SChatConstants = require('../constants/SChatConstants'),
    Emitter = require('../lib/emiter');

const CHANGE_EVENT = 'change';
let _users = [],
    _userName;

function updateUsers(newUsers) {
    _users = newUsers;
}

function setUserName(name) {
  _userName = name;
}

let SChatUsersStore = Object.assign({}, Emitter.prototype, {
    addChangeListener: function(callback) {
        this.addMyListener(CHANGE_EVENT, callback);
    }
});

SChatDispatcher.register(function(action){
    //console.log('DISPATCHER registered in SChatUsersStore');
    switch (action.actionType) {
        case SChatConstants.AUTHORIZED:
            setUserName(action.userName);
            SChatUsersStore.emit(CHANGE_EVENT);
            break;
        default:
            //nothing
    }
});

module.exports = SChatUsersStore;