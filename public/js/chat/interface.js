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

history.addEventListener('scroll', function () {
  console.log('scrolling');

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

  scrollChat: function(direction) {
    let chatHistory = eL('history');
    switch (direction) {
      case SChatConstants.SCROLL_BOTTOM:
        chatHistory.scrollTop = chatHistory.scrollHeight - chatHistory.clientHeight;
        break;
      case 'top':
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

function scrolling() {
  let _lastPosition = 0;
  let result = {
    position: '', // top, bottom, between
    direction: '' // up, down
  };
  return function(currentPosition, scrollHeight) {
    if (currentPosition - _lastPosition > 0) result.direction = 'down';
    else result.direction = 'up';

    if (currentPosition == 0) result.position = 'top';
    else if (currentPosition == scrollHeight) result.position = 'borrom';
    else result.position = 'between';

    return result;
  }
}

module.exports = Interface;