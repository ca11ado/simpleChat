/**
 * Created by tos on 09.11.2015.
 */
'use strict';

const WRONG_NAME = 'Разрешены согласные символы и подчеркивание. Длина от 2х до 10 символов';

module.exports = {

    userName: function(name){
        let result = {error:false, errText:WRONG_NAME};
        result.error = !/^\w{2,10}$/.test(name);
        return result;
    }

};