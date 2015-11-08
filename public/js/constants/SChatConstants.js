/**
 * Created by tos on 08.11.2015.
 */

let keyMirror = require('../lib/MyUtils').keyMirror;

let SChatConstants = keyMirror({
    CONN_OPEN: null,
    AUTHORIZED: null,
    UPDATE_USERS_LIST: null
});

module.exports = SChatConstants;