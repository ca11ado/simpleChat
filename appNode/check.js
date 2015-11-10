/**
 * Created by tos on 09.11.2015.
 */
'use strict';


const NAME_LENGTH = 15,
      TEXT_LENGTH = 500;
const WRONG_NAME = 'Разрешены согласные символы и подчеркивание. Длина от 2х до 10 символов',
      WRONG_TEXT_LENGTH = 'Ограничение по длине сообщения '+TEXT_LENGTH+' символов';

module.exports = {

  userName: function(name){
    let result = {error:false, errText:WRONG_NAME};
    let re = new RegExp('^[А-Яа-я\\w]{2,'+NAME_LENGTH+'}$');
    result.error = !re.test(name);
    return result;
  },

  messageText: function(text) {
    let result = {error:false, errText:WRONG_TEXT_LENGTH};
    result.error = text.length > TEXT_LENGTH;
    return result;
  }

};