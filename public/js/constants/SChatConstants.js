/**
 * Created by tos on 08.11.2015.
 */

let keyMirror = require('../lib/MyUtils').keyMirror;

let SChatConstants = keyMirror({
    CONNECT_TO_WS: null,
    CONN_OPEN: null,
    AUTHORIZED: null,
    UPDATE_USERS_LIST: null,
    WS_MESSAGE_SEND: null,
    WS_MESSAGE_RECEIVE: null,
    WS_SYSMESSAGE_RECEIVE: null,
    WS_INFO_MSG: null
});

module.exports = SChatConstants;