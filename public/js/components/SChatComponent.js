/**
 * Created by tos on 08.11.2015.
 */

let ChatInterface = require('../chat/interface');

let SChatActions = require('../actions/SChatActions'),
    SChatUsersStore = require('../stores/SChatUsersStore'),
    SChatSectionsStore = require('../stores/SChatSectionsStore'),
    SChatMsgStore = require('../stores/SChatMsgStore');

SChatUsersStore.addChangeListener(function () {
  ChatInterface.showUserName(SChatUsersStore.getUserName());
  ChatInterface.updateRegisteredUsers(SChatUsersStore.getRegisteredUsers());
});

SChatSectionsStore.addChangeListener(function () {
  ChatInterface.showSection(SChatSectionsStore.getActiveSection());
  ChatInterface.showInfoMsg(SChatSectionsStore.getInfoTxt());
});

SChatMsgStore.addChangeListener(function () {
  let msgObj = SChatMsgStore.getReceivedMessage();
  if (msgObj) ChatInterface.addReceivedMsg(msgObj);
});