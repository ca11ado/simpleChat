/**
 * Created by tos on 08.11.2015.
 */

let keyMirror = require('../lib/MyUtils').keyMirror

const MSG_TYPES = keyMirror({
    AUTH: null,
    HISTORY: null,
    MESSAGE: null,
    SYSTEM: null
});

function Msg(type,data) {
    if (!type || !data) new Error('Ќе задан один из параметров сообщени€');
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
    this.type = MSG_TYPES.AUTH;
    this.data = data;
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
    this.data = data;
}
MsgMessage.prototype = Object.create(Msg.prototype);
MsgMessage.prototype.constructor = MsgMessage;

module.exports = {
    createAuth: function(data) {
        return new MsgAuth(data);
    },
    createMessage: function(data) {
        return new MsgMessage(data);
    },
    getMsgTypes: function() {
        return MSG_TYPES;
    }
};