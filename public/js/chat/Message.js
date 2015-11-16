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

function Message(type,data) {
  this.type = type;
  this.data = data;
}

module.exports = {
    createAuth: function(data) {
      data = {userName: data.userName, status: data.status || ''};
      return new Message(MSG_TYPES.AUTH, data);
    },
    createMessage: function(data) {
      if (!data.text) new Error('Не задан текст сообщения');
      data = {userName:data.userName || '',text:data.text,time:new Date().toLocaleString()};
      return new Message(MSG_TYPES.MESSAGE, data);
    },
    createHistory: function(data) {
      if (!data.msgs) new Error('Не задан массив сообщений');
      return new Message(MSG_TYPES.HISTORY, data);
    },
    createUserList: function(data) {
      return new Message(MSG_TYPES.USERLIST, data);
    },
    createSysMsg: function(data){
      data = {text:data.text,time:new Date().toLocaleString()};
      return new Message(MSG_TYPES.SYSTEM, data);
    },
    createInfo: function(data){
      return new Message(MSG_TYPES.INFO, data);
    },
    getMsgTypes: function() {
      return MSG_TYPES;
    }
};