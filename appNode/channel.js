/**
 * Created by tos on 09.11.2015.
 */
'use strict';
let Message = require('../public/js/chat/Message');

function Channel(name) {
    this.name = name;
    this._clients = [];
    this._users = [];
}
Channel.prototype.subscribe = function(client, userName){
    if (!client || !userName) new Error('Undefined parametr in Channel.subscribe');
    this._clients.push(client);
    this._users.push(userName);
};
Channel.prototype.unSubscribe = function(client, userName){
    if (!client || !userName) new Error('Undefined parametr in Channel.unSubscribe');
    let index = this._clients.indexOf(client);
    if (index > -1) this._clients.splice(index,1);
};
Channel.prototype.broadcast = function (msg) {
  this._clients.map(function (v) {
      v.send(JSON.stringify(msg));
  });
};
Channel.prototype.getUsers = function(){
    return this._users;
};
Channel.prototype.isRegistered = function(userName){
    let result = false;
    this._users.map(function (v) {
        if (v === userName) result = true;
    });
    return result;
};
Channel.prototype.sendSystemMsg = function (text) {
    let msg = Message.createSysMsg({text:text});
    this.broadcast(msg);
};

module.exports = Channel;