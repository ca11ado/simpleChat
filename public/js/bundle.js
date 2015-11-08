(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Created by tos on 08.11.2015.
 */

var SChatDispatcher = require('../dispatcher/SChatDispatcher'),
    SChatConstants = require('../constants/SChatConstants');

module.exports = {
    connectToWS: function connectToWS(url) {
        SChatDispatcher.dispatch({
            actionType: SChatConstants.CONNECT_TO_WS,
            url: url
        });
    },
    updateListOfUsers: function updateListOfUsers(newList) {
        SChatDispatcher.dispatch({
            actionType: SChatConstants.ACTIVATE_LOGIN_FORM,
            list: newList
        });
    },
    connectedToWebSocket: function connectedToWebSocket() {
        console.log('f:SChatActions > WebSocket connected');
        SChatDispatcher.dispatch({
            actionType: SChatConstants.CONN_OPEN
        });
    },
    authorized: function authorized(userName) {
        console.log('f:SChatActions > user %o authorized', userName);
        SChatDispatcher.dispatch({
            actionType: SChatConstants.AUTHORIZED,
            userName: userName
        });
    },
    sendMessage: function sendMessage(msg) {
        console.log('f:SChatActions > send message %o', msg);
        SChatDispatcher.dispatch({
            actionType: SChatConstants.WS_MESSAGE_SEND,
            msg: msg
        });
    }
};

},{"../constants/SChatConstants":8,"../dispatcher/SChatDispatcher":9}],2:[function(require,module,exports){
'use strict';

/**
 * Created by tos on 06.11.2015.
 */

var SChatComponent = require('./components/SChatComponent'),
    SChatUsersStore = require('./stores/SChatUsersStore'),
    SChatWebSocketComponent = require('./components/SChatWebSocketComponent'),
    SChatActions = require('./actions/SChatActions');

console.log('starting app');

SChatActions.connectedToWebSocket('ws://localhost:8080');

/* operator ...spread
function testFn(...rest) {
    console.log(rest);
}
testFn('dd', 'tt', 'pp');*/

},{"./actions/SChatActions":1,"./components/SChatComponent":6,"./components/SChatWebSocketComponent":7,"./stores/SChatUsersStore":14}],3:[function(require,module,exports){
/**
 * Created by tos on 08.11.2015.
 */
'use strict';

var keyMirror = require('../lib/MyUtils').keyMirror;

var MSG_TYPES = keyMirror({
    AUTH: null,
    HISTORY: null,
    MESSAGE: null,
    SYSTEM: null
});

function Msg(type, data) {
    if (!type || !data) new Error('�� ����� ���� �� ���������� ���������');
    this.type = type;
    this.data = data;
}
Msg.prototype.getType = function () {
    return this.type;
};
Msg.prototype.getData = function () {
    return this.data;
};

function MsgAuth(data) {
    this.type = MSG_TYPES.AUTH;
    this.data = data;
}
MsgAuth.prototype = Object.create(Msg.prototype);
MsgAuth.prototype.constructor = MsgAuth;

function MsgHistory(data) {
    this.type = MSG_TYPES.HISTORY;
    this.data = data;
}
MsgHistory.prototype = Object.create(Msg.prototype);
MsgHistory.prototype.constructor = MsgHistory;

function MsgMessage(data) {
    this.type = MSG_TYPES.MESSAGE;
    this.data = data;
}
MsgMessage.prototype = Object.create(Msg.prototype);
MsgMessage.prototype.constructor = MsgMessage;

module.exports = {
    createAuth: function createAuth(data) {
        return new MsgAuth(data);
    },
    createMessage: function createMessage(data) {
        return new MsgMessage(data);
    },
    getMsgTypes: function getMsgTypes() {
        return MSG_TYPES;
    }
};

},{"../lib/MyUtils":10}],4:[function(require,module,exports){
'use strict';

/**
 * Created by tos on 07.11.2015.
 */

var WS = require('./websocket'),
    Msg = require('./Message');

/* Обработчики интерфейса */
var button = document.getElementById('button');

button.onclick = function (e) {
  var input = document.getElementById('login').querySelector('input');
  if (input.value) WS.sendMsg(Msg.createAuth({ userName: input.value }));
};

var Interface = {
  showSection: function showSection(section) {
    var sections = document.getElementsByClassName('mainSection'),
        activateSection = section ? document.getElementById(section) : false;

    for (var i = 0; i < sections.length; i++) {
      sections[i].style.display = 'none';
    }
    if (activateSection) activateSection.style.display = 'block';
  }
};

module.exports = Interface;

},{"./Message":3,"./websocket":5}],5:[function(require,module,exports){
'use strict';

/**
 * Created by tos on 07.11.2015.
 */
var SChatActions = require('../actions/SChatActions'),
    MsgTypes = require('./Message').getMsgTypes();

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
      SChatActions.connectedToWebSocket();
      /*setTimeout(function () {
        _socket.send('New test user');
      }, 2000);*/
    };
    _socket.onclose = function (event) {
      console.log('Код: ' + event.code + ' причина: ' + event.reason);
    };
    _socket.onmessage = function (event) {
      console.log("f:websocket > получены данные %o", event.data);
      //SChatActions.authorized('Test');
      switch (event.data.type) {
        case MsgTypes.AUTH:
          SChatActions.authorized(event.data.userName);
          break;
        default:
        //todo don't know this type
      }
    };
    _socket.onerror = function (error) {
      console.log("Ошибка " + error.message);
    };

    return _socket;
  },

  getSocket: function getSocket() {
    return _socket;
  },

  sendMsg: function sendMsg(msg) {
    msg = JSON.stringify(msg);
    if (_socket) _socket.send(msg);else new Error('Socket does not exist yet');
    //console.log('Send message %o', JSON.stringify(msg));
  },

  sendTestMsg: function sendTestMsg(txt) {
    _socket.send(txt);
  }

};

module.exports = WS;

},{"../actions/SChatActions":1,"./Message":3}],6:[function(require,module,exports){
'use strict';

/**
 * Created by tos on 08.11.2015.
 */

var ChatInterface = require('../chat/interface');

var SChatActions = require('../actions/SChatActions'),
    SChatUsersStore = require('../stores/SChatUsersStore'),
    SChatSectionsStore = require('../stores/SChatSectionsStore');

SChatUsersStore.addChangeListener(function () {
    console.log('Component retrieve data from store');
});

SChatSectionsStore.addChangeListener(function () {
    ChatInterface.showSection(SChatSectionsStore.getActiveSection());
});

module.exports = setTimeout(function () {
    SChatActions.updateListOfUsers(['user1', 'user2']);
}, 2000);

},{"../actions/SChatActions":1,"../chat/interface":4,"../stores/SChatSectionsStore":13,"../stores/SChatUsersStore":14}],7:[function(require,module,exports){
'use strict';

/**
 * Created by tos on 08.11.2015.
 */

var SChatActions = require('../actions/SChatActions'),
    MsgTypes = require('../chat/Message').getMsgTypes(),
    SChatMsgStore = require('../stores/SChatMsgStore');

var _socket = undefined,
    _events = {};

var WS_TYPE_NEW = 'new',
    WS_TYPE_MSG = "message";

var WS = {

  connect: function connect(url) {
    console.log('f:SChatWebSocketComponent > starting ws');
    if (_socket) return Error('��� ���� ����������');

    _socket = new WebSocket(url);

    _socket.onopen = function () {
      SChatActions.connectedToWebSocket();
    };

    _socket.onclose = function (event) {
      console.log('���: ' + event.code + ' �������: ' + event.reason);
    };

    _socket.onmessage = function (event) {
      console.log("f:SChatWebSocketComponent > �������� ������ %o", event.data);
      switch (event.data.type) {
        case MsgTypes.AUTH:
          SChatActions.authorized(event.data.userName);
          break;
        default:
        //todo don't know this type
      }
    };
    _socket.onerror = function (error) {
      console.log("������ " + error.message);
    };

    return _socket;
  },

  getSocket: function getSocket() {
    return _socket;
  },

  sendMsg: function sendMsg(msg) {
    msg = JSON.stringify(msg);
    if (_socket) _socket.send(msg);else new Error('Socket does not exist yet');
  },

  sendTestMsg: function sendTestMsg(txt) {
    _socket.send(txt);
  }

};

SChatMsgStore.addChangeListener(function () {
  var wsMsg = SChatMsgStore.getMessage();
  if (wsMsg) WS.sendMsg(wsMsg);
});

module.exports = WS;

},{"../actions/SChatActions":1,"../chat/Message":3,"../stores/SChatMsgStore":12}],8:[function(require,module,exports){
'use strict';

/**
 * Created by tos on 08.11.2015.
 */

var keyMirror = require('../lib/MyUtils').keyMirror;

var SChatConstants = keyMirror({
    CONNECT_TO_WS: null,
    CONN_OPEN: null,
    AUTHORIZED: null,
    UPDATE_USERS_LIST: null,
    WS_MESSAGE_SEND: null
});

module.exports = SChatConstants;

},{"../lib/MyUtils":10}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
/**
 * Created by tos on 08.11.2015.
 */
'use strict';

module.exports = {
    keyMirror: function keyMirror(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) obj[key] = key;
        }
        return obj;
    }
};

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
'use strict';

/**
 * Created by tos on 08.11.2015.
 */

var SChatDispatcher = require('../dispatcher/SChatDispatcher'),
    SChatConstants = require('../constants/SChatConstants'),
    Emitter = require('../lib/emiter');

var CHANGE_EVENT = 'change';

var _message = undefined;

var SChatMsgStore = Object.assign({}, Emitter.prototype, {

  addChangeListener: function addChangeListener(callback) {
    this.addMyListener(CHANGE_EVENT, callback);
  },

  getMessage: function getMessage() {
    var m = _message;
    _message = '';
    return m;
  }

});

SChatDispatcher.register(function (action) {
  switch (action.actionType) {
    case SChatConstants.CONN_OPEN:

      break;
    case SChatConstants.WS_MESSAGE_SEND:

      SChatMsgStore.emit(CHANGE_EVENT);
      break;
    default:
    //nothing
  }
});

module.exports = SChatMsgStore;

},{"../constants/SChatConstants":8,"../dispatcher/SChatDispatcher":9,"../lib/emiter":11}],13:[function(require,module,exports){
'use strict';

/**
 * Created by tos on 08.11.2015.
 */

var SChatDispatcher = require('../dispatcher/SChatDispatcher'),
    SChatConstants = require('../constants/SChatConstants'),
    Emitter = require('../lib/emiter');

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
  }
  if (section) _sections[section] = true;
}

var SChatSectionsStore = Object.assign({}, Emitter.prototype, {
  addChangeListener: function addChangeListener(callback) {
    this.addMyListener(CHANGE_EVENT, callback);
  },

  getActiveSection: function getActiveSection() {
    for (var key in _sections) {
      if (_sections.hasOwnProperty(key) && _sections[key]) return key;
    }
    return false;
  }
});

SChatDispatcher.register(function (action) {
  //console.log('DISPATCHER registered in SChatSectionsStore');
  switch (action.actionType) {
    case SChatConstants.CONN_OPEN:
      console.log('f:SChatSectionsStore > activate section login');
      activateSection(SECTION_LOGIN);
      SChatSectionsStore.emit(CHANGE_EVENT);
      break;
    case SChatConstants.AUTHORIZED:
      activateSection(SECTION_CHAT);
      SChatSectionsStore.emit(CHANGE_EVENT);
      break;
    default:
    //nothing
  }
});

module.exports = SChatSectionsStore;

},{"../constants/SChatConstants":8,"../dispatcher/SChatDispatcher":9,"../lib/emiter":11}],14:[function(require,module,exports){
'use strict';

/**
 * Created by tos on 08.11.2015.
 */

var SChatDispatcher = require('../dispatcher/SChatDispatcher'),
    SChatConstants = require('../constants/SChatConstants'),
    Emitter = require('../lib/emiter');

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
    //console.log('DISPATCHER registered in SChatUsersStore');
    switch (action.actionType) {
        case SChatConstants.ACTIVATE_LOGIN_FORM:
            //SChatUsersStore.emit(CHANGE_EVENT);
            break;
        default:
        //nothing
    }
});

module.exports = SChatUsersStore;

},{"../constants/SChatConstants":8,"../dispatcher/SChatDispatcher":9,"../lib/emiter":11}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiU0NoYXRBY3Rpb25zLmpzIiwiYXBwLmpzIiwiTWVzc2FnZS5qcyIsImludGVyZmFjZS5qcyIsIndlYnNvY2tldC5qcyIsIlNDaGF0Q29tcG9uZW50LmpzIiwiU0NoYXRXZWJTb2NrZXRDb21wb25lbnQuanMiLCJTQ2hhdENvbnN0YW50cy5qcyIsIlNDaGF0RGlzcGF0Y2hlci5qcyIsIk15VXRpbHMuanMiLCJlbWl0ZXIuanMiLCJTQ2hhdE1zZ1N0b3JlLmpzIiwiU0NoYXRTZWN0aW9uc1N0b3JlLmpzIiwiU0NoYXRVc2Vyc1N0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDSUEsSUFBSSxlQUFlLEdBQUcsT0FBTyxDQUFDLCtCQUErQixDQUFDO0lBQzFELGNBQWMsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQzs7QUFFNUQsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNiLGVBQVcsRUFBRSxxQkFBUyxHQUFHLEVBQUU7QUFDekIsdUJBQWUsQ0FBQyxRQUFRLENBQUM7QUFDdkIsc0JBQVUsRUFBRSxjQUFjLENBQUMsYUFBYTtBQUN4QyxlQUFHLEVBQUUsR0FBRztTQUNULENBQUMsQ0FBQztLQUNKO0FBQ0QscUJBQWlCLEVBQUUsMkJBQVMsT0FBTyxFQUFDO0FBQ2xDLHVCQUFlLENBQUMsUUFBUSxDQUFDO0FBQ3JCLHNCQUFVLEVBQUUsY0FBYyxDQUFDLG1CQUFtQjtBQUM5QyxnQkFBSSxFQUFFLE9BQU87U0FDaEIsQ0FBQyxDQUFDO0tBQ0o7QUFDRCx3QkFBb0IsRUFBRSxnQ0FBVTtBQUM1QixlQUFPLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7QUFDcEQsdUJBQWUsQ0FBQyxRQUFRLENBQUM7QUFDckIsc0JBQVUsRUFBRSxjQUFjLENBQUMsU0FBUztT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LEVBQUM7O0FBRXJDLFlBQVEsTUFBTSxDQUFDLFVBQVU7QUFDckIsYUFBSyxjQUFjLENBQUMsbUJBQW1COztBQUVuQyxrQkFBTTtBQUFBLEFBQ1Y7O0FBQVEsS0FFWDtDQUNKLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuICogQ3JlYXRlZCBieSB0b3Mgb24gMDguMTEuMjAxNS5cclxuICovXHJcblxyXG5sZXQgU0NoYXREaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9TQ2hhdERpc3BhdGNoZXInKSxcclxuICAgIFNDaGF0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL1NDaGF0Q29uc3RhbnRzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGNvbm5lY3RUb1dTOiBmdW5jdGlvbih1cmwpIHtcclxuICAgICAgU0NoYXREaXNwYXRjaGVyLmRpc3BhdGNoKHtcclxuICAgICAgICBhY3Rpb25UeXBlOiBTQ2hhdENvbnN0YW50cy5DT05ORUNUX1RPX1dTLFxyXG4gICAgICAgIHVybDogdXJsXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHVwZGF0ZUxpc3RPZlVzZXJzOiBmdW5jdGlvbihuZXdMaXN0KXtcclxuICAgICAgU0NoYXREaXNwYXRjaGVyLmRpc3BhdGNoKHtcclxuICAgICAgICAgIGFjdGlvblR5cGU6IFNDaGF0Q29uc3RhbnRzLkFDVElWQVRFX0xPR0lOX0ZPUk0sXHJcbiAgICAgICAgICBsaXN0OiBuZXdMaXN0XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGNvbm5lY3RlZFRvV2ViU29ja2V0OiBmdW5jdGlvbigpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdmOlNDaGF0QWN0aW9ucyA+IFdlYlNvY2tldCBjb25uZWN0ZWQnKTtcclxuICAgICAgICBTQ2hhdERpc3BhdGNoZXIuZGlzcGF0Y2goe1xyXG4gICAgICAgICAgICBhY3Rpb25UeXBlOiBTQ2hhdENvbnN0YW50cy5DT05OX09QRU5cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBhdXRob3JpemVkOiBmdW5jdGlvbih1c2VyTmFtZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdmOlNDaGF0QWN0aW9ucyA+IHVzZXIgJW8gYXV0aG9yaXplZCcsIHVzZXJOYW1lKTtcclxuICAgICAgICBTQ2hhdERpc3BhdGNoZXIuZGlzcGF0Y2goe1xyXG4gICAgICAgICAgICBhY3Rpb25UeXBlOiBTQ2hhdENvbnN0YW50cy5BVVRIT1JJWkVELFxyXG4gICAgICAgICAgICB1c2VyTmFtZTogdXNlck5hbWVcclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuICAgIHNlbmRNZXNzYWdlOiBmdW5jdGlvbihtc2cpIHtcclxuICAgICAgY29uc29sZS5sb2coJ2Y6U0NoYXRBY3Rpb25zID4gc2VuZCBtZXNzYWdlICVvJywgbXNnKTtcclxuICAgICAgU0NoYXREaXNwYXRjaGVyLmRpc3BhdGNoKHtcclxuICAgICAgICBhY3Rpb25UeXBlOiBTQ2hhdENvbnN0YW50cy5XU19NRVNTQUdFX1NFTkQsXHJcbiAgICAgICAgbXNnOiBtc2dcclxuICAgICAgfSlcclxuICAgIH1cclxufTsiLCIvKipcclxuICogQ3JlYXRlZCBieSB0b3Mgb24gMDYuMTEuMjAxNS5cclxuICovXHJcblxyXG5sZXQgU0NoYXRDb21wb25lbnQgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvU0NoYXRDb21wb25lbnQnKSxcclxuICAgIFNDaGF0VXNlcnNTdG9yZSA9IHJlcXVpcmUoJy4vc3RvcmVzL1NDaGF0VXNlcnNTdG9yZScpLFxyXG4gICAgU0NoYXRXZWJTb2NrZXRDb21wb25lbnQgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvU0NoYXRXZWJTb2NrZXRDb21wb25lbnQnKSxcclxuICAgIFNDaGF0QWN0aW9ucyA9IHJlcXVpcmUoJy4vYWN0aW9ucy9TQ2hhdEFjdGlvbnMnKTtcclxuXHJcbmNvbnNvbGUubG9nKCdzdGFydGluZyBhcHAnKTtcclxuXHJcblNDaGF0QWN0aW9ucy5jb25uZWN0ZWRUb1dlYlNvY2tldCgnd3M6Ly9sb2NhbGhvc3Q6ODA4MCcpO1xyXG5cclxuLyogb3BlcmF0b3IgLi4uc3ByZWFkXHJcbmZ1bmN0aW9uIHRlc3RGbiguLi5yZXN0KSB7XHJcbiAgICBjb25zb2xlLmxvZyhyZXN0KTtcclxufVxyXG50ZXN0Rm4oJ2RkJywgJ3R0JywgJ3BwJyk7Ki9cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgdG9zIG9uIDA4LjExLjIwMTUuXHJcbiAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5sZXQga2V5TWlycm9yID0gcmVxdWlyZSgnLi4vbGliL015VXRpbHMnKS5rZXlNaXJyb3I7XHJcblxyXG5jb25zdCBNU0dfVFlQRVMgPSBrZXlNaXJyb3Ioe1xyXG4gICAgQVVUSDogbnVsbCxcclxuICAgIEhJU1RPUlk6IG51bGwsXHJcbiAgICBNRVNTQUdFOiBudWxsLFxyXG4gICAgU1lTVEVNOiBudWxsXHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gTXNnKHR5cGUsZGF0YSkge1xyXG4gICAgaWYgKCF0eXBlIHx8ICFkYXRhKSBuZXcgRXJyb3IoJ++/ve+/vSDvv73vv73vv73vv73vv70g77+977+977+977+9IO+/ve+/vSDvv73vv73vv73vv73vv73vv73vv73vv73vv73vv70g77+977+977+977+977+977+977+977+977+9Jyk7XHJcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgdGhpcy5kYXRhID0gZGF0YTtcclxufVxyXG5Nc2cucHJvdG90eXBlLmdldFR5cGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnR5cGU7XHJcbn07XHJcbk1zZy5wcm90b3R5cGUuZ2V0RGF0YSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGE7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBNc2dBdXRoIChkYXRhKSB7XHJcbiAgICB0aGlzLnR5cGUgPSBNU0dfVFlQRVMuQVVUSDtcclxuICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbn1cclxuTXNnQXV0aC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKE1zZy5wcm90b3R5cGUpO1xyXG5Nc2dBdXRoLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IE1zZ0F1dGg7XHJcblxyXG5mdW5jdGlvbiBNc2dIaXN0b3J5IChkYXRhKSB7XHJcbiAgICB0aGlzLnR5cGUgPSBNU0dfVFlQRVMuSElTVE9SWTtcclxuICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbn1cclxuTXNnSGlzdG9yeS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKE1zZy5wcm90b3R5cGUpO1xyXG5Nc2dIaXN0b3J5LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IE1zZ0hpc3Rvcnk7XHJcblxyXG5mdW5jdGlvbiBNc2dNZXNzYWdlIChkYXRhKSB7XHJcbiAgICB0aGlzLnR5cGUgPSBNU0dfVFlQRVMuTUVTU0FHRTtcclxuICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbn1cclxuTXNnTWVzc2FnZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKE1zZy5wcm90b3R5cGUpO1xyXG5Nc2dNZXNzYWdlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IE1zZ01lc3NhZ2U7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGNyZWF0ZUF1dGg6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1zZ0F1dGgoZGF0YSk7XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlTWVzc2FnZTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTXNnTWVzc2FnZShkYXRhKTtcclxuICAgIH0sXHJcbiAgICBnZXRNc2dUeXBlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1TR19UWVBFUztcclxuICAgIH1cclxufTsiLCIvKipcclxuICogQ3JlYXRlZCBieSB0b3Mgb24gMDcuMTEuMjAxNS5cclxuICovXHJcblxyXG5cclxubGV0IFdTID0gcmVxdWlyZSgnLi93ZWJzb2NrZXQnKSxcclxuICAgIE1zZyA9IHJlcXVpcmUoJy4vTWVzc2FnZScpO1xyXG5cclxuLyog0J7QsdGA0LDQsdC+0YLRh9C40LrQuCDQuNC90YLQtdGA0YTQtdC50YHQsCAqL1xyXG5sZXQgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvbicpO1xyXG5cclxuYnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbihlKXtcclxuICBsZXQgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9naW4nKS5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpO1xyXG4gIGlmIChpbnB1dC52YWx1ZSkgV1Muc2VuZE1zZyhNc2cuY3JlYXRlQXV0aCh7dXNlck5hbWU6aW5wdXQudmFsdWV9KSk7XHJcbn07XHJcblxyXG5cclxubGV0IEludGVyZmFjZSA9IHtcclxuICBzaG93U2VjdGlvbjogZnVuY3Rpb24oc2VjdGlvbikge1xyXG4gICAgbGV0IHNlY3Rpb25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbWFpblNlY3Rpb24nKSxcclxuICAgICAgYWN0aXZhdGVTZWN0aW9uID0gc2VjdGlvbiA/IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNlY3Rpb24pIDogZmFsc2U7XHJcblxyXG4gICAgZm9yIChsZXQgaT0wOyBpPHNlY3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHNlY3Rpb25zW2ldLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICB9XHJcbiAgICBpZiAoYWN0aXZhdGVTZWN0aW9uKSBhY3RpdmF0ZVNlY3Rpb24uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcmZhY2U7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgdG9zIG9uIDA3LjExLjIwMTUuXHJcbiAqL1xyXG5sZXQgU0NoYXRBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9TQ2hhdEFjdGlvbnMnKSxcclxuICAgIE1zZ1R5cGVzID0gcmVxdWlyZSgnLi9NZXNzYWdlJykuZ2V0TXNnVHlwZXMoKTtcclxuXHJcbmxldCBfc29ja2V0LFxyXG4gICAgX2V2ZW50cyA9IHt9O1xyXG5jb25zdCBXU19UWVBFX05FVyA9ICduZXcnLFxyXG4gICAgICBXU19UWVBFX01TRyA9IFwibWVzc2FnZVwiO1xyXG5cclxuZnVuY3Rpb24gbWVzc2FnZSh0eXBlLGRhdGEpIHtcclxuICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgIGNhc2UgdHlwZXMuTkVXOlxyXG4gICAgICByZXR1cm4ge3R5cGU6IHR5cGVzLk5FVywgbG9naW46IGRhdGEubG9naW59O1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgdHlwZXMuTUVTU0FHRTpcclxuICAgICAgcmV0dXJuIHt0eXBlOiB0eXBlcy5NRVNTQUdFLCBsb2dpbjpkYXRhLmxvZ2luLCBtc2c6IGRhdGEubXNnLCB0aW1lOiBkYXRhLnRpbWV9O1xyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQgOlxyXG4gICAgICAvL25vdGhpbmdcclxuICB9XHJcbn1cclxuXHJcbmxldCBXUyA9IHtcclxuXHJcbiAgY29ubmVjdDogZnVuY3Rpb24odXJsKSB7XHJcbiAgICBjb25zb2xlLmxvZygnc3RhcnRpbmcgd3MnKTtcclxuICAgIGlmIChfc29ja2V0KSByZXR1cm4gRXJyb3IoJ9Cj0LbQtSDQtdGB0YLRjCDRgdC+0LXQtNC40L3QtdC90LjQtScpO1xyXG5cclxuICAgIF9zb2NrZXQgPSBuZXcgV2ViU29ja2V0KHVybCk7XHJcblxyXG4gICAgX3NvY2tldC5vbm9wZW4gPSBmdW5jdGlvbigpIHtcclxuICAgICAgU0NoYXRBY3Rpb25zLmNvbm5lY3RlZFRvV2ViU29ja2V0KCk7XHJcbiAgICAgIC8qc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgX3NvY2tldC5zZW5kKCdOZXcgdGVzdCB1c2VyJyk7XHJcbiAgICAgIH0sIDIwMDApOyovXHJcbiAgICB9O1xyXG4gICAgX3NvY2tldC5vbmNsb3NlID0gZnVuY3Rpb24oZXZlbnQpIHsgY29uc29sZS5sb2coJ9Ca0L7QtDogJyArIGV2ZW50LmNvZGUgKyAnINC/0YDQuNGH0LjQvdCwOiAnICsgZXZlbnQucmVhc29uKTsgfTtcclxuICAgIF9zb2NrZXQub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJmOndlYnNvY2tldCA+INC/0L7Qu9GD0YfQtdC90Ysg0LTQsNC90L3Ri9C1ICVvXCIsIGV2ZW50LmRhdGEpO1xyXG4gICAgICAvL1NDaGF0QWN0aW9ucy5hdXRob3JpemVkKCdUZXN0Jyk7XHJcbiAgICAgIHN3aXRjaCAoZXZlbnQuZGF0YS50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBNc2dUeXBlcy5BVVRIOlxyXG4gICAgICAgICAgU0NoYXRBY3Rpb25zLmF1dGhvcml6ZWQoZXZlbnQuZGF0YS51c2VyTmFtZSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgIC8vdG9kbyBkb24ndCBrbm93IHRoaXMgdHlwZVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgX3NvY2tldC5vbmVycm9yID0gZnVuY3Rpb24oZXJyb3IpIHsgY29uc29sZS5sb2coXCLQntGI0LjQsdC60LAgXCIgKyBlcnJvci5tZXNzYWdlKTsgfTtcclxuXHJcbiAgICByZXR1cm4gX3NvY2tldDtcclxuICB9LFxyXG5cclxuICBnZXRTb2NrZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIF9zb2NrZXQ7XHJcbiAgfSxcclxuXHJcbiAgc2VuZE1zZzogZnVuY3Rpb24obXNnKSB7XHJcbiAgICBtc2cgPSBKU09OLnN0cmluZ2lmeShtc2cpO1xyXG4gICAgaWYgKF9zb2NrZXQpIF9zb2NrZXQuc2VuZChtc2cpO1xyXG4gICAgZWxzZSBuZXcgRXJyb3IoJ1NvY2tldCBkb2VzIG5vdCBleGlzdCB5ZXQnKTtcclxuICAgIC8vY29uc29sZS5sb2coJ1NlbmQgbWVzc2FnZSAlbycsIEpTT04uc3RyaW5naWZ5KG1zZykpO1xyXG4gIH0sXHJcblxyXG4gIHNlbmRUZXN0TXNnOiBmdW5jdGlvbih0eHQpIHtcclxuICAgIF9zb2NrZXQuc2VuZCh0eHQpO1xyXG4gIH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFdTOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHRvcyBvbiAwOC4xMS4yMDE1LlxyXG4gKi9cclxuXHJcbmxldCBDaGF0SW50ZXJmYWNlID0gcmVxdWlyZSgnLi4vY2hhdC9pbnRlcmZhY2UnKTtcclxuXHJcbmxldCBTQ2hhdEFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL1NDaGF0QWN0aW9ucycpLFxyXG4gICAgU0NoYXRVc2Vyc1N0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL1NDaGF0VXNlcnNTdG9yZScpLFxyXG4gICAgU0NoYXRTZWN0aW9uc1N0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL1NDaGF0U2VjdGlvbnNTdG9yZScpO1xyXG5cclxuU0NoYXRVc2Vyc1N0b3JlLmFkZENoYW5nZUxpc3RlbmVyKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDb21wb25lbnQgcmV0cmlldmUgZGF0YSBmcm9tIHN0b3JlJyk7XHJcbn0pO1xyXG5cclxuU0NoYXRTZWN0aW9uc1N0b3JlLmFkZENoYW5nZUxpc3RlbmVyKGZ1bmN0aW9uICgpIHtcclxuICAgIENoYXRJbnRlcmZhY2Uuc2hvd1NlY3Rpb24oU0NoYXRTZWN0aW9uc1N0b3JlLmdldEFjdGl2ZVNlY3Rpb24oKSk7XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICBTQ2hhdEFjdGlvbnMudXBkYXRlTGlzdE9mVXNlcnMoWyd1c2VyMScsJ3VzZXIyJ10pO1xyXG59LDIwMDApOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHRvcyBvbiAwOC4xMS4yMDE1LlxyXG4gKi9cclxuXHJcbmxldCBTQ2hhdEFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL1NDaGF0QWN0aW9ucycpLFxyXG4gICAgTXNnVHlwZXMgPSByZXF1aXJlKCcuLi9jaGF0L01lc3NhZ2UnKS5nZXRNc2dUeXBlcygpLFxyXG4gICAgU0NoYXRNc2dTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9TQ2hhdE1zZ1N0b3JlJyk7XHJcblxyXG5sZXQgX3NvY2tldCxcclxuICAgIF9ldmVudHMgPSB7fTtcclxuXHJcbmNvbnN0IFdTX1RZUEVfTkVXID0gJ25ldycsXHJcbiAgICAgIFdTX1RZUEVfTVNHID0gXCJtZXNzYWdlXCI7XHJcblxyXG5sZXQgV1MgPSB7XHJcblxyXG4gIGNvbm5lY3Q6IGZ1bmN0aW9uKHVybCkge1xyXG4gICAgY29uc29sZS5sb2coJ2Y6U0NoYXRXZWJTb2NrZXRDb21wb25lbnQgPiBzdGFydGluZyB3cycpO1xyXG4gICAgaWYgKF9zb2NrZXQpIHJldHVybiBFcnJvcign77+977+977+9IO+/ve+/ve+/ve+/vSDvv73vv73vv73vv73vv73vv73vv73vv73vv73vv70nKTtcclxuXHJcbiAgICBfc29ja2V0ID0gbmV3IFdlYlNvY2tldCh1cmwpO1xyXG5cclxuICAgIF9zb2NrZXQub25vcGVuID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIFNDaGF0QWN0aW9ucy5jb25uZWN0ZWRUb1dlYlNvY2tldCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBfc29ja2V0Lm9uY2xvc2UgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBjb25zb2xlLmxvZygn77+977+977+9OiAnICsgZXZlbnQuY29kZSArICcg77+977+977+977+977+977+977+9OiAnICsgZXZlbnQucmVhc29uKTtcclxuICAgIH07XHJcblxyXG4gICAgX3NvY2tldC5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcImY6U0NoYXRXZWJTb2NrZXRDb21wb25lbnQgPiDvv73vv73vv73vv73vv73vv73vv73vv70g77+977+977+977+977+977+9ICVvXCIsIGV2ZW50LmRhdGEpO1xyXG4gICAgICBzd2l0Y2ggKGV2ZW50LmRhdGEudHlwZSkge1xyXG4gICAgICAgIGNhc2UgTXNnVHlwZXMuQVVUSDpcclxuICAgICAgICAgIFNDaGF0QWN0aW9ucy5hdXRob3JpemVkKGV2ZW50LmRhdGEudXNlck5hbWUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAvL3RvZG8gZG9uJ3Qga25vdyB0aGlzIHR5cGVcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIF9zb2NrZXQub25lcnJvciA9IGZ1bmN0aW9uKGVycm9yKSB7IGNvbnNvbGUubG9nKFwi77+977+977+977+977+977+9IFwiICsgZXJyb3IubWVzc2FnZSk7IH07XHJcblxyXG4gICAgcmV0dXJuIF9zb2NrZXQ7XHJcbiAgfSxcclxuXHJcbiAgZ2V0U29ja2V0OiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBfc29ja2V0O1xyXG4gIH0sXHJcblxyXG4gIHNlbmRNc2c6IGZ1bmN0aW9uKG1zZykge1xyXG4gICAgbXNnID0gSlNPTi5zdHJpbmdpZnkobXNnKTtcclxuICAgIGlmIChfc29ja2V0KSBfc29ja2V0LnNlbmQobXNnKTtcclxuICAgIGVsc2UgbmV3IEVycm9yKCdTb2NrZXQgZG9lcyBub3QgZXhpc3QgeWV0Jyk7XHJcbiAgfSxcclxuXHJcbiAgc2VuZFRlc3RNc2c6IGZ1bmN0aW9uKHR4dCkge1xyXG4gICAgX3NvY2tldC5zZW5kKHR4dCk7XHJcbiAgfVxyXG5cclxufTtcclxuXHJcblNDaGF0TXNnU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIoZnVuY3Rpb24gKCkge1xyXG4gIGxldCB3c01zZyA9IFNDaGF0TXNnU3RvcmUuZ2V0TWVzc2FnZSgpO1xyXG4gIGlmICh3c01zZykgV1Muc2VuZE1zZyh3c01zZyk7XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXUzsiLCIvKipcclxuICogQ3JlYXRlZCBieSB0b3Mgb24gMDguMTEuMjAxNS5cclxuICovXHJcblxyXG5sZXQga2V5TWlycm9yID0gcmVxdWlyZSgnLi4vbGliL015VXRpbHMnKS5rZXlNaXJyb3I7XHJcblxyXG5sZXQgU0NoYXRDb25zdGFudHMgPSBrZXlNaXJyb3Ioe1xyXG4gICAgQ09OTkVDVF9UT19XUzogbnVsbCxcclxuICAgIENPTk5fT1BFTjogbnVsbCxcclxuICAgIEFVVEhPUklaRUQ6IG51bGwsXHJcbiAgICBVUERBVEVfVVNFUlNfTElTVDogbnVsbCxcclxuICAgIFdTX01FU1NBR0VfU0VORDogbnVsbFxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU0NoYXRDb25zdGFudHM7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgdG9zIG9uIDA4LjExLjIwMTUuXHJcbiAqL1xyXG5cclxubGV0IF9jYWxsYmFja3MgPSBbXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgcmVnaXN0ZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKXtcclxuICAgICAgICBfY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgfSxcclxuICAgIGRpc3BhdGNoOiBmdW5jdGlvbihhY3Rpb24pe1xyXG4gICAgICAgIF9jYWxsYmFja3MubWFwKGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHYoYWN0aW9uKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTsiLCIvKipcclxuICogQ3JlYXRlZCBieSB0b3Mgb24gMDguMTEuMjAxNS5cclxuICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAga2V5TWlycm9yOiBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgZm9yIChsZXQga2V5IGluIG9iaikge1xyXG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIG9ialtrZXldID0ga2V5O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgfVxyXG59OyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHRvcyBvbiAwOC4xMS4yMDE1LlxyXG4gKi9cclxuXHJcbmxldCBFbWl0dGVyID0gZnVuY3Rpb24oKSB7XHJcbn07XHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5hZGRNeUxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsbGlzdGVuZXIpIHtcclxuICAgIGlmICghdGhpcy5fZXZlbnRzKSB0aGlzLl9ldmVudHMgPSB7fTtcclxuICAgIGlmICghdGhpcy5fZXZlbnRzLmhhc093blByb3BlcnR5KGV2ZW50KSkgdGhpcy5fZXZlbnRzW2V2ZW50XSA9IFtdO1xyXG4gICAgdGhpcy5fZXZlbnRzW2V2ZW50XS5wdXNoKGxpc3RlbmVyKTtcclxufTtcclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCwgYXJnKSB7XHJcbiAgICBpZiAodGhpcy5fZXZlbnRzICYmIHRoaXMuX2V2ZW50cy5oYXNPd25Qcm9wZXJ0eShldmVudCkpIHtcclxuICAgICAgICB0aGlzLl9ldmVudHNbZXZlbnRdLm1hcChmdW5jdGlvbih2KSB7XHJcbiAgICAgICAgICAgIHYoYXJnKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHRvcyBvbiAwOC4xMS4yMDE1LlxyXG4gKi9cclxuXHJcbmxldCBTQ2hhdERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL1NDaGF0RGlzcGF0Y2hlcicpLFxyXG4gICAgU0NoYXRDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvU0NoYXRDb25zdGFudHMnKSxcclxuICAgIEVtaXR0ZXIgPSByZXF1aXJlKCcuLi9saWIvZW1pdGVyJyk7XHJcblxyXG5jb25zdCBDSEFOR0VfRVZFTlQgPSAnY2hhbmdlJztcclxuXHJcbmxldCBfbWVzc2FnZTtcclxuXHJcbmxldCBTQ2hhdE1zZ1N0b3JlID0gT2JqZWN0LmFzc2lnbih7fSwgRW1pdHRlci5wcm90b3R5cGUsIHtcclxuXHJcbiAgYWRkQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICB0aGlzLmFkZE15TGlzdGVuZXIoQ0hBTkdFX0VWRU5ULCBjYWxsYmFjayk7XHJcbiAgfSxcclxuXHJcbiAgZ2V0TWVzc2FnZTogZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgbSA9IF9tZXNzYWdlO1xyXG4gICAgX21lc3NhZ2UgPSAnJztcclxuICAgIHJldHVybiBtO1xyXG4gIH1cclxuXHJcbn0pO1xyXG5cclxuU0NoYXREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKGFjdGlvbil7XHJcbiAgc3dpdGNoIChhY3Rpb24uYWN0aW9uVHlwZSkge1xyXG4gICAgY2FzZSBTQ2hhdENvbnN0YW50cy5DT05OX09QRU46XHJcblxyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgU0NoYXRDb25zdGFudHMuV1NfTUVTU0FHRV9TRU5EOlxyXG5cclxuICAgICAgU0NoYXRNc2dTdG9yZS5lbWl0KENIQU5HRV9FVkVOVCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgIC8vbm90aGluZ1xyXG4gIH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNDaGF0TXNnU3RvcmU7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgdG9zIG9uIDA4LjExLjIwMTUuXHJcbiAqL1xyXG5cclxuXHJcbmxldCBTQ2hhdERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL1NDaGF0RGlzcGF0Y2hlcicpLFxyXG4gIFNDaGF0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL1NDaGF0Q29uc3RhbnRzJyksXHJcbiAgRW1pdHRlciA9IHJlcXVpcmUoJy4uL2xpYi9lbWl0ZXInKTtcclxuXHJcbmNvbnN0ICAgQ0hBTkdFX0VWRU5UID0gJ2NoYW5nZScsXHJcbiAgU0VDVElPTl9MT0dJTiA9ICdsb2dpbicsXHJcbiAgU0VDVElPTl9DSEFUID0gJ2NoYXQnO1xyXG5cclxubGV0IF9zZWN0aW9ucyA9IHtcclxuICBTRUNUSU9OX0xPR0lOOiBmYWxzZSxcclxuICBTRUNUSU9OX0NIQVQ6IGZhbHNlXHJcbn07XHJcblxyXG5mdW5jdGlvbiBhY3RpdmF0ZVNlY3Rpb24oc2VjdGlvbikge1xyXG4gIGZvciAobGV0IGtleSBpbiBfc2VjdGlvbnMpIHtcclxuICAgIGlmIChfc2VjdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSkgX3NlY3Rpb25zW2tleV0gPSBmYWxzZTtcclxuICB9XHJcbiAgaWYgKHNlY3Rpb24pIF9zZWN0aW9uc1tzZWN0aW9uXSA9IHRydWU7XHJcbn1cclxuXHJcbmxldCBTQ2hhdFNlY3Rpb25zU3RvcmUgPSBPYmplY3QuYXNzaWduKHt9LCBFbWl0dGVyLnByb3RvdHlwZSwge1xyXG4gIGFkZENoYW5nZUxpc3RlbmVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gICAgdGhpcy5hZGRNeUxpc3RlbmVyKENIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xyXG4gIH0sXHJcblxyXG4gIGdldEFjdGl2ZVNlY3Rpb246IGZ1bmN0aW9uKCl7XHJcbiAgICBmb3IgKGxldCBrZXkgaW4gX3NlY3Rpb25zKSB7XHJcbiAgICAgIGlmIChfc2VjdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBfc2VjdGlvbnNba2V5XSkgcmV0dXJuIGtleTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn0pO1xyXG5cclxuU0NoYXREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKGFjdGlvbil7XHJcbiAgLy9jb25zb2xlLmxvZygnRElTUEFUQ0hFUiByZWdpc3RlcmVkIGluIFNDaGF0U2VjdGlvbnNTdG9yZScpO1xyXG4gIHN3aXRjaCAoYWN0aW9uLmFjdGlvblR5cGUpIHtcclxuICAgIGNhc2UgU0NoYXRDb25zdGFudHMuQ09OTl9PUEVOOlxyXG4gICAgICBjb25zb2xlLmxvZygnZjpTQ2hhdFNlY3Rpb25zU3RvcmUgPiBhY3RpdmF0ZSBzZWN0aW9uIGxvZ2luJyk7XHJcbiAgICAgIGFjdGl2YXRlU2VjdGlvbihTRUNUSU9OX0xPR0lOKTtcclxuICAgICAgU0NoYXRTZWN0aW9uc1N0b3JlLmVtaXQoQ0hBTkdFX0VWRU5UKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIFNDaGF0Q29uc3RhbnRzLkFVVEhPUklaRUQ6XHJcbiAgICAgIGFjdGl2YXRlU2VjdGlvbihTRUNUSU9OX0NIQVQpO1xyXG4gICAgICBTQ2hhdFNlY3Rpb25zU3RvcmUuZW1pdChDSEFOR0VfRVZFTlQpO1xyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAvL25vdGhpbmdcclxuICB9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTQ2hhdFNlY3Rpb25zU3RvcmU7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgdG9zIG9uIDA4LjExLjIwMTUuXHJcbiAqL1xyXG5cclxubGV0IFNDaGF0RGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvU0NoYXREaXNwYXRjaGVyJyksXHJcbiAgICBTQ2hhdENvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9TQ2hhdENvbnN0YW50cycpLFxyXG4gICAgRW1pdHRlciA9IHJlcXVpcmUoJy4uL2xpYi9lbWl0ZXInKTtcclxuXHJcbmNvbnN0IENIQU5HRV9FVkVOVCA9ICdjaGFuZ2UnO1xyXG5sZXQgX3VzZXJzID0gW107XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVVc2VycyhuZXdVc2Vycykge1xyXG4gICAgX3VzZXJzID0gbmV3VXNlcnM7XHJcbn1cclxuXHJcbmxldCBTQ2hhdFVzZXJzU3RvcmUgPSBPYmplY3QuYXNzaWduKHt9LCBFbWl0dGVyLnByb3RvdHlwZSwge1xyXG4gICAgYWRkQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5hZGRNeUxpc3RlbmVyKENIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xyXG4gICAgfVxyXG59KTtcclxuXHJcblNDaGF0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihhY3Rpb24pe1xyXG4gICAgLy9jb25zb2xlLmxvZygnRElTUEFUQ0hFUiByZWdpc3RlcmVkIGluIFNDaGF0VXNlcnNTdG9yZScpO1xyXG4gICAgc3dpdGNoIChhY3Rpb24uYWN0aW9uVHlwZSkge1xyXG4gICAgICAgIGNhc2UgU0NoYXRDb25zdGFudHMuQUNUSVZBVEVfTE9HSU5fRk9STTpcclxuICAgICAgICAgICAgLy9TQ2hhdFVzZXJzU3RvcmUuZW1pdChDSEFOR0VfRVZFTlQpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAvL25vdGhpbmdcclxuICAgIH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNDaGF0VXNlcnNTdG9yZTsiXX0=
