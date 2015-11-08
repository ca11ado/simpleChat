/**
 * Created by tos on 08.11.2015.
 */

let SChatDispatcher = require('../dispatcher/SChatDispatcher'),
    SChatConstants = require('../constants/SChatConstants');

module.exports = {
  updateListOfUsers: function(newList){
      SChatDispatcher.dispatch({
          actionType: SChatConstants.UPDATE_USERS_LIST,
          list: newList
      });
  }
};