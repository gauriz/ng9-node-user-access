const bcryption = require('../utilityJS/bcrypt-password');
const secretKey = require('../secretKey.json');
const jwt = require('jsonwebtoken');
var ObjectId = require('mongodb').ObjectId;

module.exports.generateAuthToken = async function (req, res, collection) {
    const userName = req.query.username;
    const password = req.query.password;

    let user = await collection.findOne({ user_name: userName });
    if (!user) {
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
            return res.status(401).json({
                error: 'AUTH KEY not found. Contact administrator!'
            });
        }
    } else {
        return res.status(401).json({
            error: 'Incorrect Password'
        });
    }
}

module.exports.authenticateUser = async (req, res, collection) => {
    try {
        const token = req.headers.authorization;
        if (secretKey && secretKey.SECRET) {
            const decodedToken = await jwt.verify(token, secretKey.SECRET);
            if (decodedToken) {
                const userId = decodedToken.userId;
                if (new Date >= new Date(decodedToken.exp * 1000)) {
                    return res.status(401).json({
                        error: 'Token Expired',
                    });
                }
                console.log(userId);
                let user_list = await collection.find({ "_id": ObjectId(userId) }).toArray();
                if (user_list[0]._id != userId) {
                    return res.status(401).json({
                        error: 'Invald User ID!'
                    });
                } else {
                    return true;
                }
            } else {
                res.status(401).json({
                    error: 'Invalid Authorizaton Token!'
                });
            }

        } else {
            return res.status(401).json({
                error: 'AUTH KEY not found. Contact administrator!'
            });
        }
    } catch (err) {
        return res.status(401).json({
            error: 'Invalid Token!'
        });
    }
};

async function incrementLoginCount(collection, userId) {
    try {
        await collection.updateOne({ "_id": userId }, { $inc: { "login_count": 1 } });
    } catch (err) {
        console.log('Error in incrementing login count');
    }
}