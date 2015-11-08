/**
 * Created by tos on 08.11.2015.
 */
'use strict';

module.exports = {
    keyMirror: function (obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) obj[key] = key;
        }
        return obj;
    }
};