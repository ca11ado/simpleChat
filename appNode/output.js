/**
 * Created by tos on 22.11.2015.
 */

'use strict';

var terminalClear = require('cli-clear');

function OutLog(title) {
  this.data = {};
  this.addLine(title, 'starts at ' + new Date().toString());
}
OutLog.prototype.addLine = function (name, data) {
  //this.data += name + ': ' + 'data' + '\n';
  this.data[name] = data;
  this.show();
};
OutLog.prototype.show = function () {
  terminalClear();
  for (let key in this.data) {
    if (this.data.hasOwnProperty(key))  console.log(key + ': ' + this.data[key]);
  }
};

module.exports = OutLog;