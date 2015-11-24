/**
 * Created by tos on 06.11.2015.
 */

'use strict';


let SChatWebSocketComponent = require('./components/SChatWebSocketComponent'),
    SChatComponent = require('./components/SChatComponent'),
    SChatActions = require('./actions/SChatActions');

console.log('starting app');

SChatActions.connectToWS('ws://localhost:8080');

function httpGet(url) {
    return new Promise(function(resolve){
      setTimeout(function(){
          resolve(url);
      }, 100);
    });
}

let urls = ['guest.json', 'user.json'];

// ... ваш код
let results = [];
let all = urls.reduce((prev, current) => {
    return prev.then(result => {
        if (result) results.push(result);
        return httpGet(current);
    });
}, Promise.resolve());

//all.then(console.log(results));


Promise.resolve().then(httpGet('test1')).then(result => httpGet(result + 'url2')).then(result => console.log(result));