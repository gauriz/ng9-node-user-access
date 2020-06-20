const service = require('../service/login.service');
const logger = require('../utilityJS/logger/logger');
module.exports.login = login;
module.exports.authenticateUser = authenticateUser;
logger.setLoggerSystem('fs', false);

async function login(req, res) {
    if (req.app.locals.usersCollection) {
        const userName = req.query.username;
        const password = req.query.password;
        let loginRet = await service.generateAuthToken(userName, password, req.app.locals.usersCollection);
        if (req.app.locals.loginSessionCollection) {
            let ip = req.connection.remoteAddress.split(`:`).pop();
            if (!ip) {
                ip = undefined;
                logger.warn('User loggedin IP not found');
            }
            service.updateLoginSession(ip, userName, req.app.locals.loginSessionCollection);
        }
        if (loginRet) {
            if (loginRet.success) {
                return res.status(200).json(loginRet.success);
            } else {
                return res.status(401).json(loginRet.error);
            }
        }
    } else {
        return res.status(400).json({
            error: 'User Collection not found. Check DB Connection!'
        });
    }
};

async function authenticateUser(req, res, collection) {
    const token = req.headers.authorization;
    loginRet = await service.authenticateUser(token, collection);
    if (loginRet) {
        if (loginRet.success) {
            return true;
        } else {
            return res.status(401).json(loginRet);
        }
    }
};
