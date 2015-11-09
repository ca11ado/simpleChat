/**
 * Created by tos on 09.11.2015.
 */
'use strict';

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
      v.send(msg);
  });
};
Channel.prototype.getUsers = function(){
    return this._users;
};

module.exports = Channel;