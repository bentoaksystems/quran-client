/**
 * Created by Ali on 6/7/2017.
 */
var moment = require('moment-hijri');

var exports = module.exports = {};

exports.convertToHijri = function(date){
  return moment(date).format('iYYYY-iMMM-iD');
}


