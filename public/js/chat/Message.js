/**
 * Created by tos on 08.11.2015.
 */
'use strict';

let keyMirror = require('../lib/MyUtils').keyMirror;

const MSG_TYPES = keyMirror({
    AUTH: null,
    HISTORY: null,
    MESSAGE: null,
    USERLIST: null,
    INFO: null,
    SYSTEM: null
});

function MsgAuth (data) {
  if (!data.userName) new Error('Не задан параметр userName');

  this.type = MSG_TYPES.AUTH;
  this.data = {userName: data.userName, status: data.status || ''};
}

function MsgHistory (data) {
    this.type = MSG_TYPES.HISTORY;
    this.data = data;
}

function MsgMessage (data) {
    this.type = MSG_TYPES.MESSAGE;
    if (!data.text) new Error('Не задан текст сообщения');
    this.data = {userName:data.userName || '',text:data.text,time:new Date().toLocaleString()};
}

function MsgUserList (data) {
  if (!data.users) new Error('Не задан список пользователей');
  this.type = MSG_TYPES.USERLIST;
  this.data = data;
}

function MsgSystem (data) {
  if (!data.text) new Error('data.text is indefined');
  this.type = MSG_TYPES.SYSTEM;
  this.data = {text:data.text,time:new Date().toLocaleString()};
}

function MsgInfo (data) {
    if (!data.text) new Error('data.text is indefined');
    this.type = MSG_TYPES.INFO;
    this.data = {text: data.text};
}

module.exports = {
    createAuth: function(data) {
      return new MsgAuth(data);
    },
    createMessage: function(data) {
      return new MsgMessage(data);
    },
    createUserList: function(data) {
      return new MsgUserList(data);
    },
    createSysMsg: function(data){
      return new MsgSystem(data);
    },
    createInfo: function(data){
      return new MsgInfo(data);
    },
    getMsgTypes: function() {
      return MSG_TYPES;
    }
};