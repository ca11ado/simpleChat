/**
 * Created by tos on 08.11.2015.
 */

let _callbacks = [];

module.exports = {
    register: function(callback){
        _callbacks.push(callback);
    },
    dispatch: function(action){
        _callbacks.map(function (v) {
            v(action);
        });
    }
};