/**
 * Created by tos on 08.11.2015.
 */

let SChatDispatcher = require('../dispatcher/SChatDispatcher'),
    SChatConstants = require('../constants/SChatConstants');

let _users = [];

function updateUsers(newUsers) {
    _users = newUsers;
}

let SChatUsersStore = {
    addChangeListener: function() {

    }
};

SChatDispatcher.register(function(action){
    console.log('DISPATCHER registered in SChatUsersStore');
    switch (action.actionType) {
        case SChatConstants.UPDATE_USERS_LIST:
            updateUsers(action.list);
            // emit change event
            break;
        default:
            //nothing
    }
});

module.exports = SChatUsersStore;