/**
 * Created by tos on 07.11.2015.
 */


let Msg = require('./Message'),
    SChatActions = require('../actions/SChatActions');

/* Обработчики интерфейса */
let buttonReg = document.getElementById('button');
let buttonSend = document.getElementById('msgSend');

buttonReg.onclick = function(e){
  let input = document.getElementById('login').querySelector('input');
  if (input.value) SChatActions.sendMessage(Msg.createAuth({userName: input.value}));
};
buttonSend.onclick = function (e) {
  sendMsg();
};


let Interface = {
  showUserName: function(userName) {
    document.getElementById('userName').textContent = userName;
  },
  showInfoMsg: function(msg) {
    document.getElementById('info').textContent = msg;
  },
  showSection: function(section) {
    let sections = document.getElementsByClassName('mainSection'),
      activateSection = section ? document.getElementById(section) : false;

    for (let i=0; i<sections.length; i++) {
      sections[i].style.display = 'none';
    }
    if (activateSection) activateSection.style.display = 'block';
  },
  updateRegisteredUsers: function(users) {
    document.getElementById('userList').innerHTML = users.reduce(function(prev,current){
      let newEl = current ? '<span>'+current+ '</span></br>' : '';
      return prev+ newEl;
    },'');
  }
};

function sendMsg() {
  let text = document.getElementById('msgText').value;
  if (text) SChatActions.sendMessage(Msg.createMessage({text:text}));
}

module.exports = Interface;