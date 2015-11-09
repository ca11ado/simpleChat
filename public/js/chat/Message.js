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
    SYSTEM: null
});

function Msg(type,data) {
    if (!type || !data) new Error('Не задан один из параметров сообщения');
    this.type = type;
    this.data = data;
}
Msg.prototype.getType = function() {
    return this.type;
};
Msg.prototype.getData = function () {
    return this.data;
};

function MsgAuth (data) {
  if (!data.userName) new Error('Не задан параметр userName');

  this.type = MSG_TYPES.AUTH;
  this.data = {userName: data.userName, status: data.status || ''};
}
MsgAuth.prototype = Object.create(Msg.prototype);
MsgAuth.prototype.constructor = MsgAuth;

function MsgHistory (data) {
    this.type = MSG_TYPES.HISTORY;
    this.data = data;
}
MsgHistory.prototype = Object.create(Msg.prototype);
MsgHistory.prototype.constructor = MsgHistory;

function MsgMessage (data) {
    this.type = MSG_TYPES.MESSAGE;
    if (!data.text) new Error('Не задан текст сообщения');
    this.data = {userName:data.userName || '',text:data.text,time:new Date().toString()};
}
MsgMessage.prototype = Object.create(Msg.prototype);
MsgMessage.prototype.constructor = MsgMessage;

function MsgUserList (data) {
  if (!data.users) new Error('Не задан список пользователей');
  this.type = MSG_TYPES.USERLIST;
  this.data = data;
}
MsgUserList.prototype = Object.create(Msg.prototype);
MsgUserList.prototype.constructor = MsgUserList;

function MsgSystem (data) {
    if (!data.text) new Error('data.text is indefined');
    this.type = MSG_TYPES.SYSTEM;
    this.data = {text: data.text};
}
MsgSystem.prototype = Object.create(Msg.prototype);
MsgSystem.prototype.constructor = MsgSystem;

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
    getMsgTypes: function() {
      return MSG_TYPES;
    }
};