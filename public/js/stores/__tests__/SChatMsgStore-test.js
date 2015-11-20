/**
 * Created by tos on 19.11.2015.
 */

'use strict';

jest.dontMock('../SChatMsgStore.js');
jest.dontMock('../../constants/SChatConstants.js');
jest.dontMock('../../lib/MyUtils');

describe("SChat Msg Store", function () {

  var SChatConstants = require('../../constants/SChatConstants');
  var SChatDispatcher;
  var SChatMsgStore;
  var callback;

  // класс создания сообщений
  function Message(name,text) {
    this.userName = name;
    this.time = new Date();
    this.text = text;
  }
  function arrOfMessages(count, templateText, templateName) {
    let result = [];

    templateText = templateText || 'Тестовое сообщение';
    templateName = templateName || 'TestUser';

    for (let i=0; i<count; i++) {
      //todo возможно засовывание каждого сообщения в объект со свойством "data" слега запутывает код
      result.push({data:new Message(templateName, templateText + ' ' + i)});
    }
    return result;
  }

  // mock actions
  var actionConnectToWS = {
    actionType: SChatConstants.CONNECT_TO_WS,
    url: 'ws://localhost:8080'
  };
  var actionWSMessageSend = {
    actionType: SChatConstants.WS_MESSAGE_SEND,
    msg: 'Тестовое отправленное сообщение'
  };
  var actionReceiveMessage = {
    actionType: SChatConstants.WS_MESSAGE_RECEIVE,
    msgObj: new Message('t0s', 'Тестовое полученное сообщение')
  };
  var actionReceiveHistory = {
    actionType: SChatConstants.WS_MESSAGE_HISTORY,
    messages: arrOfMessages(10, 'Тестовое сообщение истории', 't0s')
  };

  beforeEach(function () {
    SChatDispatcher = require('../../dispatcher/SChatDispatcher');
    SChatMsgStore = require('../../stores/SChatMsgStore');
    callback = SChatDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function () {
    expect(SChatDispatcher.register.mock.calls.length).toBe(1);
  });

  it('it initializes with empty values', function () {
    let sendingMsg = SChatMsgStore.getSendingMessage(),
        receivedMsg = SChatMsgStore.getReceivedMessage(),
        url = SChatMsgStore.getUrl();

    let empty = !sendingMsg && !receivedMsg && !url;
    expect(empty).toBe(true);
  });

  it('receive an url for connection', function () {
    callback(actionConnectToWS);
    // todo use "toMatch" to validate received url
    //expect(SChatMsgStore.getUrl()).toEqual(jasmine.any(String));
    expect(SChatMsgStore.getUrl()).toMatch(/^ws:\/\/[\w|\d]*:\d{2,5}$/);
  });

  it('update variable with sending message', function () {
    callback(actionWSMessageSend);
    expect(SChatMsgStore.getSendingMessage()).toEqual(jasmine.any(String));
  });

  it('it receives message object', function () {
    let msgObj;
    callback(actionReceiveMessage);
    msgObj = SChatMsgStore.getReceivedMessage();
    expect(msgObj.userName).toBe('t0s');
    expect(msgObj.time).toEqual(jasmine.any(Date));
    expect(msgObj.text).toBe('Тестовое полученное сообщение');
  });

  it('it receives history with 10 messages in an array', function () {
    let msgObj;
    callback(actionReceiveHistory);

    msgObj = SChatMsgStore.getReceivedMessage();
    expect(msgObj.userName).toBe('t0s');
    expect(msgObj.time).toEqual(jasmine.any(Date));
    expect(msgObj.text).toBe('Тестовое сообщение истории 9');
  });

});