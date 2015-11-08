/**
 * Created by tos on 08.11.2015.
 */

let Emitter = function() {
};

Emitter.prototype.addMyListener = function(event,listener) {
    if (!this._events) this._events = {};
    if (!this._events.hasOwnProperty(event)) this._events[event] = [];
    this._events[event].push(listener);
};

Emitter.prototype.emit = function(event, arg) {
    if (this._events && this._events.hasOwnProperty(event)) {
        this._events[event].map(function(v) {
            v(arg);
        })
    }
};

module.exports = Emitter;