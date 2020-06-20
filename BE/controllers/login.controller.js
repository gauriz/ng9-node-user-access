const bcryption = require('../utilityJS/bcrypt-password');
const logger = require('../utilityJS/logger/logger');
const secretKey = require('../secretKey.json');
const jwt = require('jsonwebtoken');
var ObjectId = require('mongodb').ObjectId;
module.exports.login = login;
module.exports.authenticateUser = authenticateUser;
logger.setLoggerSystem('fs', false);

async function login(req, res) {
    await generateAuthToken(req, res, req.app.locals.usersCollection);
    loginSession(req, req.app.locals.loginSessionCollection);
};

async function generateAuthToken(req, res, collection) {
    const userName = req.query.username;
    const password = req.query.password;

    let user = await collection.findOne({ user_name: userName });
    if (!user) {
        logger.warn('User not found : ' + userName);
        return res.status(401).json({
            error: 'User not found!'
        });
    }
    let validPassword = bcryption.comparePassword(password, user.hashed_password);
    if (validPassword) {
        if (secretKey && secretKey.SECRET) {
            const token = jwt.sign(
                { userId: user._id },
                secretKey.SECRET,
                { expiresIn: '24h' });
            incrementLoginCount(collection, user._id);
            res.status(200).json({
                userId: user._id,
                category: user.category_code,
                token: token
            });
        } else {
            logger.log('AUTH KEY not found. Contact administrator!');
            return res.status(401).json({
                error: 'AUTH KEY not found. Contact administrator!'
            });
        }
    } else {
        logger.log('Incorrect Password for user ' + userName + ':' + password);
        return res.status(401).json({
            error: 'Incorrect Password'
        });
    }
}

async function authenticateUser(req, res, collection) {
    try {
        const token = req.headers.authorization;
        if (secretKey && secretKey.SECRET) {
            const decodedToken = await jwt.verify(token, secretKey.SECRET);
            if (decodedToken) {
                const userId = decodedToken.userId;
                try {
                    let user_list = await collection.find({ "_id": ObjectId(userId) }).toArray();
                    if (user_list[0]._id != userId) {
                        logger.warn('Token with Invald User ID! ' + userId);
                        return res.status(401).json({
                            error: 'Invald User ID!'
                        });
                    } else {
                        return true;
                    }
                }
                catch (err) {
                    logger.warn('Token with Invald User ID! ' + userId);
                    return res.status(401).json({
                        error: 'Invald User ID!'
                    });
                }
            } else {
                logger.warn('Invalid Token');
                return res.status(401).json({
                    error: 'Invalid Token!'
                });
            }
        } else {
            logger.error('AUTH KEY not found');
            return res.status(401).json({
                error: 'AUTH KEY not found. Contact administrator!'
            });
        }
    } catch (err) {
        logger.warn('No authorization provided or Invalid Token');
        return res.status(401).json({
            error: 'No authorization provided or Invalid Token!'
        });
    }
};

async function incrementLoginCount(collection, userId) {
    try {
        await collection.updateOne({ "_id": userId }, { $inc: { "login_count": 1 } });
    } catch (err) {
        logger.warn('Error in incrementing login count for ' + userId);
    }
}

async function loginSession(req, loginSession) {
    try {
        let ip = req.connection.remoteAddress.split(`:`).pop();
        loginSession.insertOne(
            {
                user_name: req.query.username,
                ip: ip,
                login_time: new Date()
            });
    } catch (err) {
        logger.warn('User Login Err ' + req.query.username);
    }
}