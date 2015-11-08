/**
 * Created by tos on 08.11.2015.
 */

function keyMirror(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) obj[key] = key;
    }
    return obj;
}

let SChatConstants = keyMirror({
    CONN_OPEN: null,
    AUTHORIZED: null,
    UPDATE_USERS_LIST: null
});

module.exports = SChatConstants;