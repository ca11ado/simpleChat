/**
 * Created by tos on 08.11.2015.
 */

let SChatActions = require('../actions/SChatActions'),
    SChatUsersStore = require('../stores/SChatUsersStore');

SChatUsersStore.addChangeListener(function () {
    console.log('Component retrieve data from store');
});

module.exports = setTimeout(function(){
    SChatActions.updateListOfUsers(['user1','user2']);
},2000);