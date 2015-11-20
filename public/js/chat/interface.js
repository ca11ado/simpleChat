/**
 * Created by tos on 07.11.2015.
 */

const INFO_HIDE_TIME = 6000;

let Msg = require('./Message'),
    SChatActions = require('../actions/SChatActions'),
    SChatConstants = require('../constants/SChatConstants');


/* Обработчики интерфейса */
let buttonReg = eL('button');
let buttonSend = eL('msgSend');
let history = eL('history');

let chatScrollInfo = scrollingInfo(history);

buttonReg.onclick = function(e){
  let input = eL('login').querySelector('input');
  if (input.value) SChatActions.sendMessage(Msg.createAuth({userName: input.value}));
};

eL('msgText').onkeydown = function (e) {
  if (e.keyCode == 13) {
    sendMsg();
  }
};
if (buttonSend) buttonSend.onclick = function (e) {
  sendMsg();
};

history.addEventListener('scroll', function (e) {
  //console.log(chatScrollInfo());
  let scroll = chatScrollInfo();
  if (scroll.direction === SChatConstants.SCROLL_DIRECTION_UP) SChatActions.autoScrollEnabled(false);
  else if(scroll.position === SChatConstants.SCROLL_POSITION_BOTTOM) SChatActions.autoScrollEnabled(true);
});

let Interface = {

  showUserName: function(userName) {
    eL('userName').textContent = userName;
  },

  showInfoMsg: function(msg) {
    showInfoMessage(msg);
  },

  showSection: function(section) {
    let sections = document.getElementsByClassName('mainSection'),
      activateSection = section ? eL(section) : false;

    for (let i=0; i<sections.length; i++) {
      sections[i].style.display = 'none';
    }
    if (activateSection) activateSection.style.display = 'block';
  },

  updateRegisteredUsers: function(users) {
    eL('userList').innerHTML = users.reduce(function(prev,current){
      let newEl = current ? '<span>'+current+ '</span></br>' : '';
      return prev+ newEl;
    },'');
  },

  addReceivedMsg: function(msgObj) {
    let element = messageElement(msgObj);
    eL('history').appendChild(element);
  },

  scrollChat: function(position) {
    let chatHistory = eL('history');
    switch (position) {
      case SChatConstants.SCROLL_POSITION_BOTTOM:
        chatHistory.scrollTop = chatHistory.scrollHeight - chatHistory.clientHeight;
        break;
      case SChatConstants.SCROLL_POSITION_TOP:
        //todo дописать скролл к топу
        break;
      default:
    }
  }
};

function showInfoMessage(text) {
  let el = eL('info');
  el.textContent = text;
  setTimeout(function () {
    el.textContent = '';
  }, INFO_HIDE_TIME);
}

function sendMsg() {
  let text = eL('msgText');
  let history = eL('history');
  if (text.value) SChatActions.sendMessage(Msg.createMessage({text:text.value}));
  text.value = '';
}

function eL(id){
  return document.getElementById(id);
}

function messageElement(msgObj) {
  let p = document.createElement('p');

  let name = msgObj.userName ? document.createElement('span') : false;
  if (name) {
    name.className = 'msgUserName';
    name.appendChild(document.createTextNode(msgObj.userName));
  }
  let time = document.createElement('span');
  time.className = 'msgTime';
  time.appendChild(document.createTextNode(msgObj.time));
  let text = document.createElement('span');
  text.className = 'msgText';
  text.appendChild(document.createTextNode(msgObj.text));

  let p2 = document.createElement('p');
  p2.className = 'msgNameAndTime';
  if (name) p2.appendChild(name);
  p2.appendChild(time);

  p.appendChild(p2);
  p.appendChild(text);
  return p;
}

function scrollingInfo(element) {
  let _lastScrollTop = 0;
  let result = {
    position: '', // top, bottom, between
    direction: '' // up, down
  };
  return function() {
    let currentPosition,
        currentScrollTop;

    currentScrollTop = element.scrollTop;
    if (currentScrollTop - _lastScrollTop > 0) result.direction = SChatConstants.SCROLL_DIRECTION_DOWN;
    else result.direction = SChatConstants.SCROLL_DIRECTION_UP;

    if (currentScrollTop) {
      if (currentScrollTop == element.scrollHeight - element.clientHeight) currentPosition = SChatConstants.SCROLL_POSITION_BOTTOM;
      else currentPosition = SChatConstants.SCROLL_POSITION_BETWEEN;
    } else {
      currentPosition = SChatConstants.SCROLL_POSITION_TOP;
    }
    result.position = currentPosition;

    _lastScrollTop = currentScrollTop;
    return result;
  }
}

module.exports = Interface;