/**
 * Created by tos on 07.11.2015.
 */


let Msg = require('./Message'),
    SChatActions = require('../actions/SChatActions');

/* Обработчики интерфейса */
let button = document.getElementById('button');

button.onclick = function(e){
  let input = document.getElementById('login').querySelector('input');
  if (input.value) SChatActions.sendMessage(Msg.createAuth({userName: input.value}));
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

module.exports = Interface;