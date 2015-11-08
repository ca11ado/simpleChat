/**
 * Created by tos on 07.11.2015.
 */


let WS = require('./websocket'),
    Msg = require('./Message');

/* Обработчики интерфейса */
let button = document.getElementById('button');

button.onclick = function(e){
  let input = document.getElementById('login').querySelector('input');
  if (input.value) WS.sendMsg(Msg.createAuth({userName:input.value}));
};


let Interface = {
  showSection: function(section) {
    let sections = document.getElementsByClassName('mainSection'),
      activateSection = section ? document.getElementById(section) : false;

    for (let i=0; i<sections.length; i++) {
      sections[i].style.display = 'none';
    }
    if (activateSection) activateSection.style.display = 'block';
  }
};

module.exports = Interface;