const dateUtil = require('../date.util');
var fs = require('fs');
var util = require('util');
const appRoot = require('app-root-path');
const logPath = appRoot + '/logs';
const infopath = appRoot + '/logs/info';
const warnPath = appRoot + '/logs/warn';
const errPath = appRoot + '/logs/error';
const debugPath = appRoot + '/logs/debug';


module.exports = class FSLogger {
    options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

    today = new Date();
    logFile;
    warnFile;
    errorFile;
    debugFile;
    multiFile = false;
    constructor(multiFile) {
        try {
            if (multiFile) {
                this.multiFile = true;
                fs.mkdirSync(infopath);
                fs.mkdirSync(warnPath);
                fs.mkdirSync(errPath);
                fs.mkdirSync(debugPath);
            } else {
                fs.mkdirSync(logPath);
            }
        } catch (e) {
            if (e.code != 'EEXIST') throw e;
        }
    }

    log(msg) {
        if (!this.logFile) {
            if (this.multiFile) {
                this.logFile = fs.createWriteStream(infopath + '/' + dateUtil.getNow(0) + '.log', { flags: 'a' });
            } else {
                this.logFile = fs.createWriteStream(logPath + '/' + dateUtil.getNow(0) + '.log', { flags: 'a' });
            }
        }
        const fileSpec = !this.multiFile ? ' [INFO] ' : ' ';
        const log = dateUtil.getNow(0) + ' ' + this.today.toLocaleTimeString("en-US", this.options) + fileSpec + util.format(msg) + '\n';
        this.logFile.write(log);
    }

    warn(msg) {
        if (!this.warnFile) {
            if (this.multiFile) {
                this.warnFile = fs.createWriteStream(warnPath + '/' + dateUtil.getNow(0) + '.log', { flags: 'a' });
            } else {
                this.warnFile = fs.createWriteStream(logPath + '/' + dateUtil.getNow(0) + '.log', { flags: 'a' });
            }
        }
        const fileSpec = !this.multiFile ? ' [WARN] ' : ' ';
        this.warnFile.write(dateUtil.getNow(0) + ' ' + this.today.toLocaleTimeString("en-US", this.options) + fileSpec + util.format(msg) + '\n');
    }

    err(msg) {
        if (!this.errorFile) {
            if (this.multiFile) {
                this.errorFile = fs.createWriteStream(errPath + '/' + dateUtil.getNow(0) + '.log', { flags: 'a' });
            } else {
                this.errorFile = fs.createWriteStream(logPath + '/' + dateUtil.getNow(0) + '.log', { flags: 'a' });
            }
        }
        const fileSpec = !this.multiFile ? ' [ERROR] ' : ' ';
        this.errorFile.write(dateUtil.getNow(0) + ' ' + this.today.toLocaleTimeString("en-US", this.options) + fileSpec + util.format(msg) + '\n');
    }

    debug(msg) {
        if (!this.debugFile) {
            if (this.multiFile) {
                this.debugFile = fs.createWriteStream(debugPath + '/' + dateUtil.getNow(0) + '.log', { flags: 'a' });
            } else {
                this.debugFile = fs.createWriteStream(logPath + '/' + dateUtil.getNow(0) + '.log', { flags: 'a' });
            }
        }
        const fileSpec = !this.multiFile ? ' [DEBUG] ' : ' ';
        this.debugFile.write(dateUtil.getNow(0) + ' ' + this.today.toLocaleTimeString("en-US", this.options) + fileSpec + util.format(msg) + '\n');
    }

}