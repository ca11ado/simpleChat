/**
 * Created by tos on 08.11.2015.
 */


let SChatDispatcher = require('../dispatcher/SChatDispatcher'),
  SChatConstants = require('../constants/SChatConstants'),
  Emitter = require('../lib/emiter');

const CHANGE_EVENT = 'change';

const SECTION_LOGIN = 'login',
      SECTION_CHAT = 'chat';

const INFO_EXIST = 'Такой пользователь уже существует';

let _sections = {
      SECTION_LOGIN: false,
      SECTION_CHAT: false
    },
    _info;

function updateInfoText(txt) {
  _info = txt;
}

function activateSection(section) {
  for (let key in _sections) {
    if (_sections.hasOwnProperty(key)) _sections[key] = false;
  }
  if (section) _sections[section] = true;
}

let SChatSectionsStore = Object.assign({}, Emitter.prototype, {
  addChangeListener: function(callback) {
    this.addMyListener(CHANGE_EVENT, callback);
  },

  getActiveSection: function(){
    for (let key in _sections) {
      if (_sections.hasOwnProperty(key) && _sections[key]) return key;
    }
    return false;
  },

  getInfoTxt: function() {
    let info = _info;
    _info = '';
    return info;
  }
});

SChatDispatcher.register(function(action){
  switch (action.actionType) {
    case SChatConstants.CONN_OPEN:
      activateSection(SECTION_LOGIN);
      SChatSectionsStore.emit(CHANGE_EVENT);
      break;
    case SChatConstants.AUTHORIZED:
      if (action.status === 'success') {
        activateSection(SECTION_CHAT);
      } else if (action.status === 'exist') {
        updateInfoText(INFO_EXIST);
      }
      SChatSectionsStore.emit(CHANGE_EVENT);
      break;
    default:
  }
});

module.exports = SChatSectionsStore;