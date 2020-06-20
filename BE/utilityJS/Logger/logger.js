const FSLogger = require('./fs-logger');

module.exports.setLoggerSystem = setLoggerSystem;
module.exports.log = log;
module.exports.warn = warn;
module.exports.error = error;
module.exports.debug = debug;
module.exports.critical = critical;
global.logger;

function setLoggerSystem(loggerSystem, multiFile) {
    switch (loggerSystem) {
        case 'fs': this.logger = new FSLogger(multiFile); break;
        default: this.logger = new FSLogger(); break;
    }
}

function log(msg) {
    if (!this.logger) {
        this.setLoggerSystem('fs', false);
    }
    this.logger.log(msg);
}

function warn(msg) {
    if (!this.logger) {
        this.setLoggerSystem('fs', false);
    }
    this.logger.warn(msg);
}

function error(msg) {
    if (!this.logger) {
        this.setLoggerSystem('fs', false);
    }
    this.logger.err(msg);
}

function debug(msg) {
    if (!this.logger) {
        this.setLoggerSystem('fs', false);
    }
    this.logger.debug(msg);
}

function critical(msg) {
    if (!this.logger) {
        this.setLoggerSystem('fs', false);
    }
    this.logger.critical(msg);
}
