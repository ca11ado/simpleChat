/**
 * Created by tos on 07.11.2015.
 */


let Msg = require('./Message'),
    SChatActions = require('../actions/SChatActions');


/* Обработчики интерфейса */
let buttonReg = eL('button');
let buttonSend = eL('msgSend');

buttonReg.onclick = function(e){
  let input = eL('login').querySelector('input');
  if (input.value) SChatActions.sendMessage(Msg.createAuth({userName: input.value}));
};
buttonSend.onclick = function (e) {
  sendMsg();
};


let Interface = {

  showUserName: function(userName) {
    eL('userName').textContent = userName;
  },

  showInfoMsg: function(msg) {
    eL('info').textContent = msg;
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
    /*let msgEl = document.createElement('div');
        msgEl.className = 'message';
    let textEl = document.createElement('span'),
        authorEl = document.createElement('span'),
        timeEl = document.createElement('span');

    textEl.textContent = msgObj.text;
    authorEl.textContent = msgObj.userName;
    timeEl.textContent = msgObj.time;

    msgEl.appendChild(authorEl);
    msgEl.appendChild(timeEl);
    msgEl.appendChild(textEl);

    eL('history').appendChild(msgEl);*/
    let element = messageElement(msgObj);
    eL('history').appendChild(element);
  }
};

function sendMsg() {
  let text = eL('msgText').value;
  if (text) SChatActions.sendMessage(Msg.createMessage({text:text}));
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

module.exports = Interface;