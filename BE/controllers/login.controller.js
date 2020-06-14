const bcryption = require('../utilityJS/bcrypt-password');
const secretKey = require('../secretKey.json');
const jwt = require('jsonwebtoken');

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
            res.status(200).json({
                userId: user._id,
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

module.exports.authenticateUser = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (secretKey && secretKey.SECRET) {
            const decodedToken = jwt.verify(token, secretKey.SECRET);
            const userId = decodedToken.userId;
            if (req.body.userId && req.body.userId !== userId) {
                throw 'Invalid user ID';
            } else {
                next();
            }
        } else {
            return res.status(401).json({
                error: 'AUTH KEY not found. Contact administrator!'
            });
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};
