const dateUtil = require('./date.util');
var fs = require('fs');
var util = require('util');
var appRoot = require('app-root-path');
var log_file = fs.createWriteStream(appRoot + '/logs/' + dateUtil.getNow(0) + '.log', { flags: 'a' });

module.exports.log = (msg) => {
    log_file.write(dateUtil.getNow(1) + util.format(msg) + '\n');
}