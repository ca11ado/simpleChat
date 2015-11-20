/**
 * Created by tos on 19.11.2015.
 */

'use strict';

jest.dontMock('../SChatSectionsStore.js');
jest.dontMock('../../constants/SChatConstants.js');
jest.dontMock('../../lib/MyUtils');

describe("SChat Sections Store", function () {

  var SChatConstants = require('../../constants/SChatConstants');
  var SChatDispatcher;
  var SChatSectionsStore;
  var callback;

  // mock actions
  var actionConnectionOpen = {
    actionType: SChatConstants.CONN_OPEN
  };
  var actionAuthorized = {
    actionType: SChatConstants.AUTHORIZED,
    status: 'success' //todo немного путанная техника определения успешной авторизации пользователя
  };
  var actionInfoMessage = {
    actionType: SChatConstants.WS_INFO_MSG,
    msg: 'Information for user'
  };

  beforeEach(function () {
    SChatDispatcher = require('../../dispatcher/SChatDispatcher');
    SChatSectionsStore = require('../../stores/SChatSectionsStore');
    callback = SChatDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function () {
    expect(SChatDispatcher.register.mock.calls.length).toBe(1);
  });

  it('connection was open and activated login section', function () {
    callback(actionConnectionOpen);
    expect(SChatSectionsStore.getActiveSection()).toBe('login');
  });

  it('user was authorized and activated chat section', function () {
    callback(actionAuthorized);
    expect(SChatSectionsStore.getActiveSection()).toBe('chat');
  });

  it('user receives information message and then variable clears', function () {
    callback(actionInfoMessage);
    expect(SChatSectionsStore.getInfoTxt()).toBe('Information for user');
    expect(SChatSectionsStore.getInfoTxt()).toBe('');
  });

});