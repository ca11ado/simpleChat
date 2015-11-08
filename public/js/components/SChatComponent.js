/**
 * Created by tos on 08.11.2015.
 */

let ChatInterface = require('../chat/interface');

let SChatActions = require('../actions/SChatActions'),
    SChatUsersStore = require('../stores/SChatUsersStore'),
    SChatSectionsStore = require('../stores/SChatSectionsStore');

SChatUsersStore.addChangeListener(function () {
    console.log('Component retrieve data from store');
});

SChatSectionsStore.addChangeListener(function () {
    ChatInterface.showSection(SChatSectionsStore.getActiveSection());
});

module.exports = setTimeout(function(){
    SChatActions.updateListOfUsers(['user1','user2']);
},2000);