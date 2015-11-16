/**
 * Created by tos on 09.11.2015.
 */
'use strict';


const NAME_LENGTH = 15,
      TEXT_LENGTH = 500,
      DELAY_BETWEEN_MSG = 250;

const WRONG_NAME = 'Разрешены согласные символы и подчеркивание. Длина от 2х до 10 символов',
      WRONG_TEXT_LENGTH = 'Ограничение по длине сообщения '+TEXT_LENGTH+' символов',
      TOO_OFTEN = 'Сообщения отправляются слишком часто';

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
  },

  frequency: function(lastTime) {
    let result = {error: false, errText: TOO_OFTEN},
        timeNow = new Date();
    if ( (timeNow.getTime() - lastTime.getTime()) < DELAY_BETWEEN_MSG) result.error = true;
    return result;
  }

};