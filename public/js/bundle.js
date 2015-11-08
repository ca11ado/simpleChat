(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Created by tos on 08.11.2015.
 */

var SChatDispatcher = require('../dispatcher/SChatDispatcher'),
    SChatConstants = require('../constants/SChatConstants');

module.exports = {
    updateListOfUsers: function updateListOfUsers(newList) {
        SChatDispatcher.dispatch({
            actionType: SChatConstants.ACTIVATE_LOGIN_FORM,
            list: newList
        });
    },
    connectedToWebSocket: function connectedToWebSocket() {
        SChatDispatcher.dispatch({
            actionType: SChatConstants.CONN_OPEN
        });
    }
};

},{"../constants/SChatConstants":6,"../dispatcher/SChatDispatcher":7}],2:[function(require,module,exports){
'use strict';

/**
 * Created by tos on 06.11.2015.
 */

var chat = require('./chat/chat');
var ws = require('./chat/websocket');
var dispatcher = require('./dispatcher/SChatDispatcher');
var component = require('./components/SChatComponent'),
    SChatUsersStore = require('./stores/SChatUsersStore');

console.log('start app');

ws.connect('ws://localhost:8080');

ws.onMsg('myMsg', function (data) {
  console.log('New myMsg message', data);
});

setTimeout(function () {
  ws.sendTestMsg('test message from app');
}, 2000);

},{"./chat/chat":3,"./chat/websocket":4,"./components/SChatComponent":5,"./dispatcher/SChatDispatcher":7,"./stores/SChatUsersStore":9}],3:[function(require,module,exports){
'use strict';

/**
 * Created by tos on 06.11.2015.
 */

var ws = require('./websocket.js');
var dispatcher = require('../dispatcher/SChatDispatcher');

setTimeout(function () {
  ws.sendTestMsg('test message from chat');
}, 2000);

module.exports = [{
  name: 't0s',
  messages: 10
}, {
  name: 'test',
  messages: 5
}];

},{"../dispatcher/SChatDispatcher":7,"./websocket.js":4}],4:[function(require,module,exports){
'use strict';

/**
 * Created by tos on 07.11.2015.
 */
var SChatActions = require('../actions/SChatActions');

var _socket = undefined,
    _events = {};
var WS_TYPE_NEW = 'new',
    WS_TYPE_MSG = "message";

function message(type, data) {
  switch (type) {
    case types.NEW:
      return { type: types.NEW, login: data.login };
      break;
    case types.MESSAGE:
      return { type: types.MESSAGE, login: data.login, msg: data.msg, time: data.time };
      break;
    default:
    //nothing
  }
}

var WS = {

  connect: function connect(url) {
    console.log('starting ws');
    if (_socket) return Error('Уже есть соединение');

    _socket = new WebSocket(url);

    _socket.onopen = function () {
      //_socket.send('Hello world2');
      SChatActions.connectedToWebSocket();
    };
    _socket.onclose = function (event) {
      console.log('Код: ' + event.code + ' причина: ' + event.reason);
    };
    _socket.onmessage = function (event) {
      //WS.emitMsg('myMsg', event.data);
      console.log("f:websocket > получены данные " + event.data);
    };
    _socket.onerror = function (error) {
      console.log("Ошибка " + error.message);
    };

    return _socket;
  },

  getSocket: function getSocket() {
    return _socket;
  },

  onMsg: function onMsg(event, callback) {
    _events[event] = _events[event] ? _events[event].push(callback) : [];
  },

  emitMsg: function emitMsg(event, arg) {
    if (_events.hasOwnProperty(event)) {
      _events[event].map(function (v) {
        v(arg);
      });
    }
  },

  sendTestMsg: function sendTestMsg(txt) {
    _socket.send(txt);
  }

};

module.exports = WS;

},{"../actions/SChatActions":1}],5:[function(require,module,exports){
'use strict';

/**
 * Created by tos on 08.11.2015.
 */

var SChatActions = require('../actions/SChatActions'),
    SChatUsersStore = require('../stores/SChatUsersStore'),
    SChatSectionsStore = require('../stores/SChatSectionsStore');

SChatUsersStore.addChangeListener(function () {
    console.log('Component retrieve data from store');
});

SChatSectionsStore.addChangeListener(function () {
    console.log('Component retrieve data from SectionsStore');
    console.log('f:SChatComponent > Activate section: ', SChatSectionsStore.getActiveSection());
});

module.exports = setTimeout(function () {
    SChatActions.updateListOfUsers(['user1', 'user2']);
}, 2000);

},{"../actions/SChatActions":1,"../stores/SChatSectionsStore":8,"../stores/SChatUsersStore":9}],6:[function(require,module,exports){
"use strict";

/**
 * Created by tos on 08.11.2015.
 */

function keyMirror(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) obj[key] = key;
    }
    return obj;
}

var SChatConstants = keyMirror({
    CONN_OPEN: null,
    UPDATE_USERS_LIST: null
});

module.exports = SChatConstants;

},{}],7:[function(require,module,exports){
"use strict";

/**
 * Created by tos on 08.11.2015.
 */

var _callbacks = [];

module.exports = {
    register: function register(callback) {
        _callbacks.push(callback);
    },
    dispatch: function dispatch(action) {
        _callbacks.map(function (v) {
            v(action);
        });
    }
};

},{}],8:[function(require,module,exports){
'use strict';

/**
 * Created by tos on 08.11.2015.
 */

var SChatDispatcher = require('../dispatcher/SChatDispatcher'),
    SChatConstants = require('../constants/SChatConstants'),
    Emitter = require('./emiter');

var CHANGE_EVENT = 'change',
    SECTION_LOGIN = 'login',
    SECTION_CHAT = 'chat';

var _sections = {
    SECTION_LOGIN: false,
    SECTION_CHAT: false
};

function activateSection(section) {
    for (var key in _sections) {
        if (_sections.hasOwnProperty(key)) _sections[key] = false;
        _sections[section] = true;
    }
}

var SChatSectionsStore = Object.assign({}, Emitter.prototype, {
    addChangeListener: function addChangeListener(callback) {
        this.addMyListener(CHANGE_EVENT, callback);
    },

    getActiveSection: function getActiveSection() {
        for (var key in _sections) {
            if (_sections.hasOwnProperty(key) && _sections[key]) return key;
        }
    }
});

SChatDispatcher.register(function (action) {
    console.log('DISPATCHER registered in SChatSectionsStore');
    switch (action.actionType) {
        case SChatConstants.CONN_OPEN:
            activateSection(SECTION_LOGIN);
            SChatSectionsStore.emit(CHANGE_EVENT);
            break;
        default:
        //nothing
    }
});

module.exports = SChatSectionsStore;

},{"../constants/SChatConstants":6,"../dispatcher/SChatDispatcher":7,"./emiter":10}],9:[function(require,module,exports){
'use strict';

/**
 * Created by tos on 08.11.2015.
 */

var SChatDispatcher = require('../dispatcher/SChatDispatcher'),
    SChatConstants = require('../constants/SChatConstants'),
    Emitter = require('./emiter');

var CHANGE_EVENT = 'change';
var _users = [];

function updateUsers(newUsers) {
    _users = newUsers;
}

var SChatUsersStore = Object.assign({}, Emitter.prototype, {
    addChangeListener: function addChangeListener(callback) {
        this.addMyListener(CHANGE_EVENT, callback);
    }
});

SChatDispatcher.register(function (action) {
    console.log('DISPATCHER registered in SChatUsersStore');
    switch (action.actionType) {
        case SChatConstants.ACTIVATE_LOGIN_FORM:
            //SChatUsersStore.emit(CHANGE_EVENT);
            break;
        default:
        //nothing
    }
});

module.exports = SChatUsersStore;

},{"../constants/SChatConstants":6,"../dispatcher/SChatDispatcher":7,"./emiter":10}],10:[function(require,module,exports){
"use strict";

/**
 * Created by tos on 08.11.2015.
 */

var Emitter = function Emitter() {};

Emitter.prototype.addMyListener = function (event, listener) {
    if (!this._events) this._events = {};
    if (!this._events.hasOwnProperty(event)) this._events[event] = [];
    this._events[event].push(listener);
};

Emitter.prototype.emit = function (event, arg) {
    if (this._events && this._events.hasOwnProperty(event)) {
        this._events[event].map(function (v) {
            v(arg);
        });
    }
};

module.exports = Emitter;

},{}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiU0NoYXRBY3Rpb25zLmpzIiwiYXBwLmpzIiwiY2hhdC5qcyIsIndlYnNvY2tldC5qcyIsIlNDaGF0Q29tcG9uZW50LmpzIiwiU0NoYXRDb25zdGFudHMuanMiLCJTQ2hhdERpc3BhdGNoZXIuanMiLCJTQ2hhdFNlY3Rpb25zU3RvcmUuanMiLCJTQ2hhdFVzZXJzU3RvcmUuanMiLCJlbWl0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNJQSxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMsK0JBQStCLENBQUM7SUFDMUQsY0FBYyxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDOztBQUU1RCxNQUFNLENBQUMsT0FBTyxHQUFHO0FBQ2IscUJBQWlCLEVBQUUsMkJBQVMsT0FBTyxFQUFDO0FBQ2xDLHVCQUFlLENBQUMsUUFBUSxDQUFDO0FBQ3JCLHNCQUFVLEVBQUUsY0FBYyxDQUFDLG1CQUFtQjtBQUM5QyxnQkFBSSxFQUFFLE9BQU87U0FDaEIsQ0FBQyxDQUFDO0tBQ0o7QUFDRCx3QkFBb0IsRUFBRSxnQ0FBVTtBQUM1Qix1QkFBZSxDQUFDLFFBQVEsQ0FBQztBQUNyQixzQkFBVSxFQUFFLGNBQWMsQ0FBQyxTQUFTO1NBQ3ZDLENBQUMsQ0FBQztLQUNWO0NBQ0EsQ0FBQzs7Ozs7Ozs7O0FDZkYsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2xDLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3JDLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBQ3pELElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQztJQUNsRCxlQUFlLEdBQUcsT0FBTyxDQUFDLDBCQUEw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LElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDckMsUUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2xFLFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0NBQ3RDLENBQUM7O0FBRUYsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsVUFBUyxLQUFLLEVBQUUsR0FBRyxFQUFFO0FBQzFDLFFBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNwRCxZQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFTLENBQUMsRUFBRTtBQUNoQyxhQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDVixDQUFDLENBQUE7S0FDTDtDQUNKLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgdG9zIG9uIDA4LjExLjIwMTUuXHJcbiAqL1xyXG5cclxubGV0IFNDaGF0RGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvU0NoYXREaXNwYXRjaGVyJyksXHJcbiAgICBTQ2hhdENvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9TQ2hhdENvbnN0YW50cycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICB1cGRhdGVMaXN0T2ZVc2VyczogZnVuY3Rpb24obmV3TGlzdCl7XHJcbiAgICAgIFNDaGF0RGlzcGF0Y2hlci5kaXNwYXRjaCh7XHJcbiAgICAgICAgICBhY3Rpb25UeXBlOiBTQ2hhdENvbnN0YW50cy5BQ1RJVkFURV9MT0dJTl9GT1JNLFxyXG4gICAgICAgICAgbGlzdDogbmV3TGlzdFxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBjb25uZWN0ZWRUb1dlYlNvY2tldDogZnVuY3Rpb24oKXtcclxuICAgICAgICBTQ2hhdERpc3BhdGNoZXIuZGlzcGF0Y2goe1xyXG4gICAgICAgICAgICBhY3Rpb25UeXBlOiBTQ2hhdENvbnN0YW50cy5DT05OX09QRU5cclxuICAgICAgICB9KTtcclxufVxyXG59OyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHRvcyBvbiAwNi4xMS4yMDE1LlxyXG4gKi9cclxuXHJcbmxldCBjaGF0ID0gcmVxdWlyZSgnLi9jaGF0L2NoYXQnKTtcclxubGV0IHdzID0gcmVxdWlyZSgnLi9jaGF0L3dlYnNvY2tldCcpO1xyXG5sZXQgZGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4vZGlzcGF0Y2hlci9TQ2hhdERpc3BhdGNoZXInKTtcclxubGV0IGNvbXBvbmVudCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9TQ2hhdENvbXBvbmVudCcpLFxyXG4gICAgU0NoYXRVc2Vyc1N0b3JlID0gcmVxdWlyZSgnLi9zdG9yZXMvU0NoYXRVc2Vyc1N0b3JlJyk7XHJcblxyXG5jb25zb2xlLmxvZygnc3RhcnQgYXBwJyk7XHJcblxyXG53cy5jb25uZWN0KCd3czovL2xvY2FsaG9zdDo4MDgwJyk7XHJcblxyXG53cy5vbk1zZygnbXlNc2cnLCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gIGNvbnNvbGUubG9nKCdOZXcgbXlNc2cgbWVzc2FnZScsIGRhdGEpO1xyXG59KTtcclxuXHJcbnNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICB3cy5zZW5kVGVzdE1zZygndGVzdCBtZXNzYWdlIGZyb20gYXBwJyk7XHJcbn0sMjAwMCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgdG9zIG9uIDA2LjExLjIwMTUuXHJcbiAqL1xyXG5cclxubGV0IHdzID0gcmVxdWlyZSgnLi93ZWJzb2NrZXQuanMnKTtcclxubGV0IGRpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL1NDaGF0RGlzcGF0Y2hlcicpO1xyXG5cclxuc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gIHdzLnNlbmRUZXN0TXNnKCd0ZXN0IG1lc3NhZ2UgZnJvbSBjaGF0Jyk7XHJcbn0sMjAwMCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcclxuICB7XHJcbiAgICBuYW1lOiAndDBzJyxcclxuICAgIG1lc3NhZ2VzOiAxMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgbmFtZTogJ3Rlc3QnLFxyXG4gICAgbWVzc2FnZXM6IDVcclxuICB9XHJcbl07IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgdG9zIG9uIDA3LjExLjIwMTUuXHJcbiAqL1xyXG5sZXQgU0NoYXRBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9TQ2hhdEFjdGlvbnMnKTtcclxuXHJcbmxldCBfc29ja2V0LFxyXG4gICAgX2V2ZW50cyA9IHt9O1xyXG5jb25zdCBXU19UWVBFX05FVyA9ICduZXcnLFxyXG4gICAgICBXU19UWVBFX01TRyA9IFwibWVzc2FnZVwiO1xyXG5cclxuZnVuY3Rpb24gbWVzc2FnZSh0eXBlLGRhdGEpIHtcclxuICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgIGNhc2UgdHlwZXMuTkVXOlxyXG4gICAgICByZXR1cm4ge3R5cGU6IHR5cGVzLk5FVywgbG9naW46IGRhdGEubG9naW59O1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgdHlwZXMuTUVTU0FHRTpcclxuICAgICAgcmV0dXJuIHt0eXBlOiB0eXBlcy5NRVNTQUdFLCBsb2dpbjpkYXRhLmxvZ2luLCBtc2c6IGRhdGEubXNnLCB0aW1lOiBkYXRhLnRpbWV9O1xyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQgOlxyXG4gICAgICAvL25vdGhpbmdcclxuICB9XHJcbn1cclxuXHJcbmxldCBXUyA9IHtcclxuXHJcbiAgY29ubmVjdDogZnVuY3Rpb24odXJsKSB7XHJcbiAgICBjb25zb2xlLmxvZygnc3RhcnRpbmcgd3MnKTtcclxuICAgIGlmIChfc29ja2V0KSByZXR1cm4gRXJyb3IoJ9Cj0LbQtSDQtdGB0YLRjCDRgdC+0LXQtNC40L3QtdC90LjQtScpO1xyXG5cclxuICAgIF9zb2NrZXQgPSBuZXcgV2ViU29ja2V0KHVybCk7XHJcblxyXG4gICAgX3NvY2tldC5vbm9wZW4gPSBmdW5jdGlvbigpIHtcclxuICAgICAgLy9fc29ja2V0LnNlbmQoJ0hlbGxvIHdvcmxkMicpO1xyXG4gICAgICBTQ2hhdEFjdGlvbnMuY29ubmVjdGVkVG9XZWJTb2NrZXQoKTtcclxuICAgIH07XHJcbiAgICBfc29ja2V0Lm9uY2xvc2UgPSBmdW5jdGlvbihldmVudCkgeyBjb25zb2xlLmxvZygn0JrQvtC0OiAnICsgZXZlbnQuY29kZSArICcg0L/RgNC40YfQuNC90LA6ICcgKyBldmVudC5yZWFzb24pOyB9O1xyXG4gICAgX3NvY2tldC5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAvL1dTLmVtaXRNc2coJ215TXNnJywgZXZlbnQuZGF0YSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiZjp3ZWJzb2NrZXQgPiDQv9C+0LvRg9GH0LXQvdGLINC00LDQvdC90YvQtSBcIiArIGV2ZW50LmRhdGEpO1xyXG4gICAgfTtcclxuICAgIF9zb2NrZXQub25lcnJvciA9IGZ1bmN0aW9uKGVycm9yKSB7IGNvbnNvbGUubG9nKFwi0J7RiNC40LHQutCwIFwiICsgZXJyb3IubWVzc2FnZSk7IH07XHJcblxyXG4gICAgcmV0dXJuIF9zb2NrZXQ7XHJcbiAgfSxcclxuXHJcbiAgZ2V0U29ja2V0OiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBfc29ja2V0O1xyXG4gIH0sXHJcblxyXG4gIG9uTXNnOiBmdW5jdGlvbihldmVudCwgY2FsbGJhY2spIHtcclxuICAgIF9ldmVudHNbZXZlbnRdID0gX2V2ZW50c1tldmVudF0gPyBfZXZlbnRzW2V2ZW50XS5wdXNoKGNhbGxiYWNrKSA6IFtdO1xyXG4gIH0sXHJcblxyXG4gIGVtaXRNc2c6IGZ1bmN0aW9uKGV2ZW50LCBhcmcpIHtcclxuICAgIGlmIChfZXZlbnRzLmhhc093blByb3BlcnR5KGV2ZW50KSkge1xyXG4gICAgICBfZXZlbnRzW2V2ZW50XS5tYXAoZnVuY3Rpb24odil7XHJcbiAgICAgICAgdihhcmcpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBzZW5kVGVzdE1zZzogZnVuY3Rpb24odHh0KSB7XHJcbiAgICBfc29ja2V0LnNlbmQodHh0KTtcclxuICB9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXUzsiLCIvKipcclxuICogQ3JlYXRlZCBieSB0b3Mgb24gMDguMTEuMjAxNS5cclxuICovXHJcblxyXG5sZXQgU0NoYXRBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9TQ2hhdEFjdGlvbnMnKSxcclxuICAgIFNDaGF0VXNlcnNTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9TQ2hhdFVzZXJzU3RvcmUnKSxcclxuICAgIFNDaGF0U2VjdGlvbnNTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9TQ2hhdFNlY3Rpb25zU3RvcmUnKTtcclxuXHJcblNDaGF0VXNlcnNTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zb2xlLmxvZygnQ29tcG9uZW50IHJldHJpZXZlIGRhdGEgZnJvbSBzdG9yZScpO1xyXG59KTtcclxuXHJcblNDaGF0U2VjdGlvbnNTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zb2xlLmxvZygnQ29tcG9uZW50IHJldHJpZXZlIGRhdGEgZnJvbSBTZWN0aW9uc1N0b3JlJyk7XHJcbiAgICBjb25zb2xlLmxvZygnZjpTQ2hhdENvbXBvbmVudCA+IEFjdGl2YXRlIHNlY3Rpb246ICcsIFNDaGF0U2VjdGlvbnNTdG9yZS5nZXRBY3RpdmVTZWN0aW9uKCkpO1xyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgU0NoYXRBY3Rpb25zLnVwZGF0ZUxpc3RPZlVzZXJzKFsndXNlcjEnLCd1c2VyMiddKTtcclxufSwyMDAwKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSB0b3Mgb24gMDguMTEuMjAxNS5cclxuICovXHJcblxyXG5mdW5jdGlvbiBrZXlNaXJyb3Iob2JqKSB7XHJcbiAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSBvYmpba2V5XSA9IGtleTtcclxuICAgIH1cclxuICAgIHJldHVybiBvYmo7XHJcbn1cclxuXHJcbmxldCBTQ2hhdENvbnN0YW50cyA9IGtleU1pcnJvcih7XHJcbiAgICBDT05OX09QRU46IG51bGwsXHJcbiAgICBVUERBVEVfVVNFUlNfTElTVDogbnVsbFxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU0NoYXRDb25zdGFudHM7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgdG9zIG9uIDA4LjExLjIwMTUuXHJcbiAqL1xyXG5cclxubGV0IF9jYWxsYmFja3MgPSBbXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgcmVnaXN0ZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKXtcclxuICAgICAgICBfY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgfSxcclxuICAgIGRpc3BhdGNoOiBmdW5jdGlvbihhY3Rpb24pe1xyXG4gICAgICAgIF9jYWxsYmFja3MubWFwKGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHYoYWN0aW9uKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTsiLCIvKipcclxuICogQ3JlYXRlZCBieSB0b3Mgb24gMDguMTEuMjAxNS5cclxuICovXHJcblxyXG5cclxubGV0IFNDaGF0RGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvU0NoYXREaXNwYXRjaGVyJyksXHJcbiAgICBTQ2hhdENvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9TQ2hhdENvbnN0YW50cycpLFxyXG4gICAgRW1pdHRlciA9IHJlcXVpcmUoJy4vZW1pdGVyJyk7XHJcblxyXG5jb25zdCAgIENIQU5HRV9FVkVOVCA9ICdjaGFuZ2UnLFxyXG4gICAgICAgIFNFQ1RJT05fTE9HSU4gPSAnbG9naW4nLFxyXG4gICAgICAgIFNFQ1RJT05fQ0hBVCA9ICdjaGF0JztcclxuXHJcbmxldCBfc2VjdGlvbnMgPSB7XHJcbiAgICBTRUNUSU9OX0xPR0lOOiBmYWxzZSxcclxuICAgIFNFQ1RJT05fQ0hBVDogZmFsc2VcclxufTtcclxuXHJcbmZ1bmN0aW9uIGFjdGl2YXRlU2VjdGlvbihzZWN0aW9uKSB7XHJcbiAgICBmb3IgKGxldCBrZXkgaW4gX3NlY3Rpb25zKSB7XHJcbiAgICAgICAgaWYgKF9zZWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBfc2VjdGlvbnNba2V5XSA9IGZhbHNlO1xyXG4gICAgICAgIF9zZWN0aW9uc1tzZWN0aW9uXSA9IHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBTQ2hhdFNlY3Rpb25zU3RvcmUgPSBPYmplY3QuYXNzaWduKHt9LCBFbWl0dGVyLnByb3RvdHlwZSwge1xyXG4gICAgYWRkQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5hZGRNeUxpc3RlbmVyKENIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRBY3RpdmVTZWN0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBfc2VjdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKF9zZWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIF9zZWN0aW9uc1trZXldKSByZXR1cm4ga2V5O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcblxyXG5TQ2hhdERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24oYWN0aW9uKXtcclxuICAgIGNvbnNvbGUubG9nKCdESVNQQVRDSEVSIHJlZ2lzdGVyZWQgaW4gU0NoYXRTZWN0aW9uc1N0b3JlJyk7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi5hY3Rpb25UeXBlKSB7XHJcbiAgICAgICAgY2FzZSBTQ2hhdENvbnN0YW50cy5DT05OX09QRU46XHJcbiAgICAgICAgICAgIGFjdGl2YXRlU2VjdGlvbihTRUNUSU9OX0xPR0lOKTtcclxuICAgICAgICAgICAgU0NoYXRTZWN0aW9uc1N0b3JlLmVtaXQoQ0hBTkdFX0VWRU5UKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAvL25vdGhpbmdcclxuICAgIH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNDaGF0U2VjdGlvbnNTdG9yZTsiLCIvKipcclxuICogQ3JlYXRlZCBieSB0b3Mgb24gMDguMTEuMjAxNS5cclxuICovXHJcblxyXG5sZXQgU0NoYXREaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9TQ2hhdERpc3BhdGNoZXInKSxcclxuICAgIFNDaGF0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL1NDaGF0Q29uc3RhbnRzJyksXHJcbiAgICBFbWl0dGVyID0gcmVxdWlyZSgnLi9lbWl0ZXInKTtcclxuXHJcbmNvbnN0IENIQU5HRV9FVkVOVCA9ICdjaGFuZ2UnO1xyXG5sZXQgX3VzZXJzID0gW107XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVVc2VycyhuZXdVc2Vycykge1xyXG4gICAgX3VzZXJzID0gbmV3VXNlcnM7XHJcbn1cclxuXHJcbmxldCBTQ2hhdFVzZXJzU3RvcmUgPSBPYmplY3QuYXNzaWduKHt9LCBFbWl0dGVyLnByb3RvdHlwZSwge1xyXG4gICAgYWRkQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5hZGRNeUxpc3RlbmVyKENIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xyXG4gICAgfVxyXG59KTtcclxuXHJcblNDaGF0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihhY3Rpb24pe1xyXG4gICAgY29uc29sZS5sb2coJ0RJU1BBVENIRVIgcmVnaXN0ZXJlZCBpbiBTQ2hhdFVzZXJzU3RvcmUnKTtcclxuICAgIHN3aXRjaCAoYWN0aW9uLmFjdGlvblR5cGUpIHtcclxuICAgICAgICBjYXNlIFNDaGF0Q29uc3RhbnRzLkFDVElWQVRFX0xPR0lOX0ZPUk06XHJcbiAgICAgICAgICAgIC8vU0NoYXRVc2Vyc1N0b3JlLmVtaXQoQ0hBTkdFX0VWRU5UKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgLy9ub3RoaW5nXHJcbiAgICB9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTQ2hhdFVzZXJzU3RvcmU7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgdG9zIG9uIDA4LjExLjIwMTUuXHJcbiAqL1xyXG5cclxubGV0IEVtaXR0ZXIgPSBmdW5jdGlvbigpIHtcclxufTtcclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLmFkZE15TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCxsaXN0ZW5lcikge1xyXG4gICAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xyXG4gICAgaWYgKCF0aGlzLl9ldmVudHMuaGFzT3duUHJvcGVydHkoZXZlbnQpKSB0aGlzLl9ldmVudHNbZXZlbnRdID0gW107XHJcbiAgICB0aGlzLl9ldmVudHNbZXZlbnRdLnB1c2gobGlzdGVuZXIpO1xyXG59O1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKGV2ZW50LCBhcmcpIHtcclxuICAgIGlmICh0aGlzLl9ldmVudHMgJiYgdGhpcy5fZXZlbnRzLmhhc093blByb3BlcnR5KGV2ZW50KSkge1xyXG4gICAgICAgIHRoaXMuX2V2ZW50c1tldmVudF0ubWFwKGZ1bmN0aW9uKHYpIHtcclxuICAgICAgICAgICAgdihhcmcpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7Il19
