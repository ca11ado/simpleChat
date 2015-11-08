/**
 * Created by tos on 08.11.2015.
 */

let SChatDispatcher = require('../dispatcher/SChatDispatcher'),
    SChatConstants = require('../constants/SChatConstants'),
    Emitter = require('../lib/emiter');

const CHANGE_EVENT = 'change';
let _users = [];

function updateUsers(newUsers) {
    _users = newUsers;
}

let SChatUsersStore = Object.assign({}, Emitter.prototype, {
    addChangeListener: function(callback) {
        this.addMyListener(CHANGE_EVENT, callback);
    }
});

SChatDispatcher.register(function(action){
    //console.log('DISPATCHER registered in SChatUsersStore');
    switch (action.actionType) {
        case SChatConstants.ACTIVATE_LOGIN_FORM:
            //SChatUsersStore.emit(CHANGE_EVENT);
            break;
        default:
            //nothing
    }
});

module.exports = SChatUsersStore;