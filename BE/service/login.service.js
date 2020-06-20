const core = require('../core/login.core');
const logger = require('../utilityJS/logger/logger');
const bcryption = require('../utilityJS/bcrypt-password');
const secretKey = require('../secretKey.json');
const jwt = require('jsonwebtoken');

exports.findLoggedinUser = findLoggedinUser;
exports.generateAuthToken = generateAuthToken;
exports.updateLoginSession = updateLoginSession;
exports.authenticateUser = authenticateUser;

async function findLoggedinUser(userName, collection) {
    try {
        return await core.findLoggedinUser(userName, collection);
    } catch (ex) {
        return ex;
    }
}

async function generateAuthToken(userName, password, collection) {
    try {
        // check if the given user is in the DB
        let user = await findLoggedinUser(userName, collection);
        if (user instanceof Error) {
            logger.warn(user);
            throw (user);
        }
        // check if the password is valid by bcryption
        let validPassword = bcryption.comparePassword(password, user.hashed_password);
        if (validPassword instanceof Error) {
            logger.error(validPassword);
            throw (validPassword)
        }
        // check if there is a secret key for JWT encryption
        if (secretKey && secretKey.SECRET) {
            const token = jwt.sign(
                { userId: user._id },
                secretKey.SECRET,
                { expiresIn: '24h' });
            incrementLoginCount(collection, user._id);
            return {
                success: {
                    userId: user._id,
                    category: user.category_code,
                    token: token
                }
            }
        } else {
            logger.error('AUTH KEY not found. Contact administrator!');
            throw ('AUTH KEY not found. Contact administrator!');
        }
    } catch (error) {
        return {
            error: error
        }
    }
}

async function incrementLoginCount(collection, userId) {
    try {
        // incrementing the logincount in user collection
        await core.incrementLoginCount(collection, userId);
    } catch (err) {
        logger.warn('Error in incrementing login count for ' + userId);
        logger.warn(err);
    }
}

async function updateLoginSession(ip, userName, loginSession) {
    try {
        //updating login session in login_sessions collection
        core.updateLoginSession(ip, userName, loginSession);
    } catch (err) {
        logger.warn('User Login Err ' + req.query.username);
    }
}

async function authenticateUser(token, collection) {
    try {
        if (secretKey && secretKey.SECRET) {
            const decodedToken = await jwt.verify(token, secretKey.SECRET);
            if (decodedToken) {
                const userId = decodedToken.userId;
                try {
                    console.log(userId);
                    await core.getUserList(collection, userId);
                    return {
                        success: true
                    }
                }
                catch (err) {
                    console.log(err);
                    let error = new Error();
                    error.name = 'NO_USER_FOUND';
                    error.msg = `Failed to authenticate user`;
                    logger.warn(error);
                    throw (error);
                }
            } else {
                let error = new Error();
                error.name = 'INVALID_TOKEN';
                error.msg = `Invalid Token`;
                logger.warn(error);
                throw (error);
            }
        } else {
            logger.error('AUTH KEY not found. Contact administrator!');
            throw ('AUTH KEY not found. Contact administrator!');
        }
    } catch (err) {
        return {
            error: err
        }
    }
};