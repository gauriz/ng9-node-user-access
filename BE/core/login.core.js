var ObjectId = require('mongodb').ObjectId;

exports.findLoggedinUser = findLoggedinUser;
exports.incrementLoginCount = incrementLoginCount;
exports.updateLoginSession = updateLoginSession;
exports.getUserList = getUserList;

async function findLoggedinUser(userName, collection) {
    return new Promise(async (resolve, reject) => {
        let user = await collection.findOne({ user_name: userName });
        if (user) {
            resolve(user);
        } else {
            let error = new Error();
            error.name = 'NO_USER_FOUND';
            error.msg = `User with username ` + userName + ` not found`;
            reject(error);
        }
    });
}

async function incrementLoginCount(collection, userId) {
    return await collection.updateOne({ "_id": userId }, { $inc: { "login_count": 1 } });
}

async function updateLoginSession(ip, userName, loginSession) {
    return await loginSession.insertOne(
        {
            user_name: userName,
            ip: ip,
            login_time: new Date()
        });
}

async function getUserList(collection, userId) {
    return await collection.find({ "_id": ObjectId(userId) }).toArray();
}