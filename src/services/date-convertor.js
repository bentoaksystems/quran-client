/**
 * Created by Ali on 6/7/2017.
 */
const moment = require('moment-hijri');
module.exports= {
  convertToHijri: function (date) {
    return moment(date).format('iYYYY/iMM/iDD');
  }
}

