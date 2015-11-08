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
            actionType: SChatConstants.UPDATE_USERS_LIST,
            list: newList
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

},{"./chat/chat":3,"./chat/websocket":4,"./components/SChatComponent":5,"./dispatcher/SChatDispatcher":7,"./stores/SChatUsersStore":8}],3:[function(require,module,exports){
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
      _socket.send('Hello world2');
    };
    _socket.onclose = function (event) {
      console.log('Код: ' + event.code + ' причина: ' + event.reason);
    };
    _socket.onmessage = function (event) {
      WS.emitMsg('myMsg', event.data);
      console.log("Получены данные" + event.data);
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

},{}],5:[function(require,module,exports){
'use strict';

/**
 * Created by tos on 08.11.2015.
 */

var SChatActions = require('../actions/SChatActions');

module.exports = setTimeout(function () {
  SChatActions.updateListOfUsers(['user1', 'user2']);
}, 2000);

},{"../actions/SChatActions":1}],6:[function(require,module,exports){
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
    SChatConstants = require('../constants/SChatConstants');

var _users = [];

function updateUsers(newUsers) {
    _users = newUsers;
}

var SChatUsersStore = {
    addChangeListener: function addChangeListener() {}
};

SChatDispatcher.register(function (action) {
    console.log('DISPATCHER registered in SChatUsersStore');
    switch (action.actionType) {
        case SChatConstants.UPDATE_USERS_LIST:
            updateUsers(action.list);
            // emit change event
            break;
        default:
        //nothing
    }
});

module.exports = SChatUsersStore;

},{"../constants/SChatConstants":6,"../dispatcher/SChatDispatcher":7}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiU0NoYXRBY3Rpb25zLmpzIiwiYXBwLmpzIiwiY2hhdC5qcyIsIndlYnNvY2tldC5qcyIsIlNDaGF0Q29tcG9uZW50LmpzIiwiU0NoYXRDb25zdGFudHMuanMiLCJTQ2hhdERpc3BhdGNoZXIuanMiLCJTQ2hhdFVzZXJzU3RvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNJQSxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMsK0JBQStCLENBQUM7SUFDMUQsY0FBYyxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDOztBQUU1RCxNQUFNLENBQUMsT0FBTyxHQUFHO0FBQ2YscUJBQWlCLEVBQUUsMkJBQVMsT0FBTyxFQUFDO0FBQ2hDLHVCQUFlLENBQUMsUUFBUSxDQUFDO0FBQ3JCLHNCQUFVLEVBQUUsY0FBYyxDQUFDLGlCQUFpQjtBQUM1QyxnQkFBSSxFQUFFLE9BQU87U0FDaEIsQ0FBQyxDQUFDO0tBQ047Q0FDRixDQUFDOzs7Ozs7Ozs7QUNWRixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDbEMsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDckMsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUM7QUFDekQsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDO0lBQ2xELGVBQWUsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQzs7QUFFMUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFekIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDOztBQUVsQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFV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IGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuICogQ3JlYXRlZCBieSB0b3Mgb24gMDguMTEuMjAxNS5cclxuICovXHJcblxyXG5sZXQgU0NoYXREaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9TQ2hhdERpc3BhdGNoZXInKSxcclxuICAgIFNDaGF0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL1NDaGF0Q29uc3RhbnRzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICB1cGRhdGVMaXN0T2ZVc2VyczogZnVuY3Rpb24obmV3TGlzdCl7XHJcbiAgICAgIFNDaGF0RGlzcGF0Y2hlci5kaXNwYXRjaCh7XHJcbiAgICAgICAgICBhY3Rpb25UeXBlOiBTQ2hhdENvbnN0YW50cy5VUERBVEVfVVNFUlNfTElTVCxcclxuICAgICAgICAgIGxpc3Q6IG5ld0xpc3RcclxuICAgICAgfSk7XHJcbiAgfVxyXG59OyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHRvcyBvbiAwNi4xMS4yMDE1LlxyXG4gKi9cclxuXHJcbmxldCBjaGF0ID0gcmVxdWlyZSgnLi9jaGF0L2NoYXQnKTtcclxubGV0IHdzID0gcmVxdWlyZSgnLi9jaGF0L3dlYnNvY2tldCcpO1xyXG5sZXQgZGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4vZGlzcGF0Y2hlci9TQ2hhdERpc3BhdGNoZXInKTtcclxubGV0IGNvbXBvbmVudCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9TQ2hhdENvbXBvbmVudCcpLFxyXG4gICAgU0NoYXRVc2Vyc1N0b3JlID0gcmVxdWlyZSgnLi9zdG9yZXMvU0NoYXRVc2Vyc1N0b3JlJyk7XHJcblxyXG5jb25zb2xlLmxvZygnc3RhcnQgYXBwJyk7XHJcblxyXG53cy5jb25uZWN0KCd3czovL2xvY2FsaG9zdDo4MDgwJyk7XHJcblxyXG53cy5vbk1zZygnbXlNc2cnLCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gIGNvbnNvbGUubG9nKCdOZXcgbXlNc2cgbWVzc2FnZScsIGRhdGEpO1xyXG59KTtcclxuXHJcbnNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICB3cy5zZW5kVGVzdE1zZygndGVzdCBtZXNzYWdlIGZyb20gYXBwJyk7XHJcbn0sMjAwMCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgdG9zIG9uIDA2LjExLjIwMTUuXHJcbiAqL1xyXG5cclxubGV0IHdzID0gcmVxdWlyZSgnLi93ZWJzb2NrZXQuanMnKTtcclxubGV0IGRpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL1NDaGF0RGlzcGF0Y2hlcicpO1xyXG5cclxuc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gIHdzLnNlbmRUZXN0TXNnKCd0ZXN0IG1lc3NhZ2UgZnJvbSBjaGF0Jyk7XHJcbn0sMjAwMCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcclxuICB7XHJcbiAgICBuYW1lOiAndDBzJyxcclxuICAgIG1lc3NhZ2VzOiAxMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgbmFtZTogJ3Rlc3QnLFxyXG4gICAgbWVzc2FnZXM6IDVcclxuICB9XHJcbl07IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgdG9zIG9uIDA3LjExLjIwMTUuXHJcbiAqL1xyXG5cclxubGV0IF9zb2NrZXQsXHJcbiAgICBfZXZlbnRzID0ge307XHJcbmNvbnN0IFdTX1RZUEVfTkVXID0gJ25ldycsXHJcbiAgICAgIFdTX1RZUEVfTVNHID0gXCJtZXNzYWdlXCI7XHJcblxyXG5mdW5jdGlvbiBtZXNzYWdlKHR5cGUsZGF0YSkge1xyXG4gIHN3aXRjaCAodHlwZSkge1xyXG4gICAgY2FzZSB0eXBlcy5ORVc6XHJcbiAgICAgIHJldHVybiB7dHlwZTogdHlwZXMuTkVXLCBsb2dpbjogZGF0YS5sb2dpbn07XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSB0eXBlcy5NRVNTQUdFOlxyXG4gICAgICByZXR1cm4ge3R5cGU6IHR5cGVzLk1FU1NBR0UsIGxvZ2luOmRhdGEubG9naW4sIG1zZzogZGF0YS5tc2csIHRpbWU6IGRhdGEudGltZX07XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdCA6XHJcbiAgICAgIC8vbm90aGluZ1xyXG4gIH1cclxufVxyXG5cclxubGV0IFdTID0ge1xyXG5cclxuICBjb25uZWN0OiBmdW5jdGlvbih1cmwpIHtcclxuICAgIGNvbnNvbGUubG9nKCdzdGFydGluZyB3cycpO1xyXG4gICAgaWYgKF9zb2NrZXQpIHJldHVybiBFcnJvcign0KPQttC1INC10YHRgtGMINGB0L7QtdC00LjQvdC10L3QuNC1Jyk7XHJcblxyXG4gICAgX3NvY2tldCA9IG5ldyBXZWJTb2NrZXQodXJsKTtcclxuXHJcbiAgICBfc29ja2V0Lm9ub3BlbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBfc29ja2V0LnNlbmQoJ0hlbGxvIHdvcmxkMicpO1xyXG4gICAgfTtcclxuICAgIF9zb2NrZXQub25jbG9zZSA9IGZ1bmN0aW9uKGV2ZW50KSB7IGNvbnNvbGUubG9nKCfQmtC+0LQ6ICcgKyBldmVudC5jb2RlICsgJyDQv9GA0LjRh9C40L3QsDogJyArIGV2ZW50LnJlYXNvbik7IH07XHJcbiAgICBfc29ja2V0Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIFdTLmVtaXRNc2coJ215TXNnJywgZXZlbnQuZGF0YSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwi0J/QvtC70YPRh9C10L3RiyDQtNCw0L3QvdGL0LVcIiArIGV2ZW50LmRhdGEpO1xyXG4gICAgfTtcclxuICAgIF9zb2NrZXQub25lcnJvciA9IGZ1bmN0aW9uKGVycm9yKSB7IGNvbnNvbGUubG9nKFwi0J7RiNC40LHQutCwIFwiICsgZXJyb3IubWVzc2FnZSk7IH07XHJcblxyXG4gICAgcmV0dXJuIF9zb2NrZXQ7XHJcbiAgfSxcclxuXHJcbiAgZ2V0U29ja2V0OiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBfc29ja2V0O1xyXG4gIH0sXHJcblxyXG4gIG9uTXNnOiBmdW5jdGlvbihldmVudCwgY2FsbGJhY2spIHtcclxuICAgIF9ldmVudHNbZXZlbnRdID0gX2V2ZW50c1tldmVudF0gPyBfZXZlbnRzW2V2ZW50XS5wdXNoKGNhbGxiYWNrKSA6IFtdO1xyXG4gIH0sXHJcblxyXG4gIGVtaXRNc2c6IGZ1bmN0aW9uKGV2ZW50LCBhcmcpIHtcclxuICAgIGlmIChfZXZlbnRzLmhhc093blByb3BlcnR5KGV2ZW50KSkge1xyXG4gICAgICBfZXZlbnRzW2V2ZW50XS5tYXAoZnVuY3Rpb24odil7XHJcbiAgICAgICAgdihhcmcpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBzZW5kVGVzdE1zZzogZnVuY3Rpb24odHh0KSB7XHJcbiAgICBfc29ja2V0LnNlbmQodHh0KTtcclxuICB9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXUzsiLCIvKipcclxuICogQ3JlYXRlZCBieSB0b3Mgb24gMDguMTEuMjAxNS5cclxuICovXHJcblxyXG5sZXQgU0NoYXRBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9TQ2hhdEFjdGlvbnMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgU0NoYXRBY3Rpb25zLnVwZGF0ZUxpc3RPZlVzZXJzKFsndXNlcjEnLCd1c2VyMiddKTtcclxufSwyMDAwKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSB0b3Mgb24gMDguMTEuMjAxNS5cclxuICovXHJcblxyXG5mdW5jdGlvbiBrZXlNaXJyb3Iob2JqKSB7XHJcbiAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSBvYmpba2V5XSA9IGtleTtcclxuICAgIH1cclxuICAgIHJldHVybiBvYmo7XHJcbn1cclxuXHJcbmxldCBTQ2hhdENvbnN0YW50cyA9IGtleU1pcnJvcih7XHJcbiAgICBVUERBVEVfVVNFUlNfTElTVDogbnVsbFxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU0NoYXRDb25zdGFudHM7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgdG9zIG9uIDA4LjExLjIwMTUuXHJcbiAqL1xyXG5cclxubGV0IF9jYWxsYmFja3MgPSBbXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgcmVnaXN0ZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKXtcclxuICAgICAgICBfY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgfSxcclxuICAgIGRpc3BhdGNoOiBmdW5jdGlvbihhY3Rpb24pe1xyXG4gICAgICAgIF9jYWxsYmFja3MubWFwKGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHYoYWN0aW9uKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTsiLCIvKipcclxuICogQ3JlYXRlZCBieSB0b3Mgb24gMDguMTEuMjAxNS5cclxuICovXHJcblxyXG5sZXQgU0NoYXREaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9TQ2hhdERpc3BhdGNoZXInKSxcclxuICAgIFNDaGF0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL1NDaGF0Q29uc3RhbnRzJyk7XHJcblxyXG5sZXQgX3VzZXJzID0gW107XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVVc2VycyhuZXdVc2Vycykge1xyXG4gICAgX3VzZXJzID0gbmV3VXNlcnM7XHJcbn1cclxuXHJcbmxldCBTQ2hhdFVzZXJzU3RvcmUgPSB7XHJcbiAgICBhZGRDaGFuZ2VMaXN0ZW5lcjogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgfVxyXG59O1xyXG5cclxuU0NoYXREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKGFjdGlvbil7XHJcbiAgICBjb25zb2xlLmxvZygnRElTUEFUQ0hFUiByZWdpc3RlcmVkIGluIFNDaGF0VXNlcnNTdG9yZScpO1xyXG4gICAgc3dpdGNoIChhY3Rpb24uYWN0aW9uVHlwZSkge1xyXG4gICAgICAgIGNhc2UgU0NoYXRDb25zdGFudHMuVVBEQVRFX1VTRVJTX0xJU1Q6XHJcbiAgICAgICAgICAgIHVwZGF0ZVVzZXJzKGFjdGlvbi5saXN0KTtcclxuICAgICAgICAgICAgLy8gZW1pdCBjaGFuZ2UgZXZlbnRcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgLy9ub3RoaW5nXHJcbiAgICB9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTQ2hhdFVzZXJzU3RvcmU7Il19
