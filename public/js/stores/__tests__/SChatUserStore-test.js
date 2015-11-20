/**
 * Created by tos on 20.11.2015.
 */

'use strict';

jest.dontMock('../SChatUsersStore.js');
jest.dontMock('../../constants/SChatConstants.js');
jest.dontMock('../../lib/MyUtils');

describe("SChat User Store", function () {

  var SChatConstants = require('../../constants/SChatConstants');
  var SChatDispatcher;
  var SChatUsersStore;
  var callback;
  var userName = 't0s';
  var userList = ['t0s', 'admin', 'test'];

  // mock actions
  var actionAuthorized = {
    actionType: SChatConstants.AUTHORIZED,
    userName: userName,
    status: 'success' //todo немного путанная техника определения успешной авторизации пользователя
  };
  var actionUpdateUsersList = {
    actionType: SChatConstants.UPDATE_USERS_LIST,
    users: userList
  };

  beforeEach(function () {
    SChatDispatcher = require('../../dispatcher/SChatDispatcher');
    SChatUsersStore = require('../../stores/SChatUsersStore');
    callback = SChatDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function () {
    expect(SChatDispatcher.register.mock.calls.length).toBe(1);
  });

  it('user was authorized and user name was set', function () {
    callback(actionAuthorized);
    expect(SChatUsersStore.getUserName()).toBe(userName);
  });

  it('updates users list', function () {
    callback(actionUpdateUsersList);
    expect(SChatUsersStore.getRegisteredUsers()).toBe(userList);
  });

});