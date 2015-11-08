/**
 * Created by tos on 08.11.2015.
 */


let SChatDispatcher = require('../dispatcher/SChatDispatcher'),
    SChatConstants = require('../constants/SChatConstants'),
    Emitter = require('./emiter');

const   CHANGE_EVENT = 'change',
        SECTION_LOGIN = 'login',
        SECTION_CHAT = 'chat';

let _sections = {
    SECTION_LOGIN: false,
    SECTION_CHAT: false
};

function activateSection(section) {
    for (let key in _sections) {
        if (_sections.hasOwnProperty(key)) _sections[key] = false;
        _sections[section] = true;
    }
}

let SChatSectionsStore = Object.assign({}, Emitter.prototype, {
    addChangeListener: function(callback) {
        this.addMyListener(CHANGE_EVENT, callback);
    },

    getActiveSection: function(){
        for (let key in _sections) {
            if (_sections.hasOwnProperty(key) && _sections[key]) return key;
        }
    }
});

SChatDispatcher.register(function(action){
    console.log('DISPATCHER registered in SChatSectionsStore');
    switch (action.actionType) {
        case SChatConstants.CONN_OPEN:
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