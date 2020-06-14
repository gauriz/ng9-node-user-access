const bcryption = require('../utilityJS/bcrypt-password');
const authenticate = require('./login.controller');
const secretKey = require('../secretKey.json');
const jwt = require('jsonwebtoken');

module.exports.listUsers = async function (req, res, collection, categoriesCollection) {
    let authenticated = await authenticate.authenticateUser(req, res, collection);
    if (authenticated === true) {
        let user_list = await collection.find().toArray();
        let categories = await categoriesCollection.find().toArray();
        res.status(200).json({
            users: listUsers(user_list, categories)
        });
    }
}

function listUsers(users, categories) {
    const displayKeys = ['user_name', 'first_name', 'last_name', 'category_code', 'login_count'];
    let retList = [];
    users.forEach(user => {
        let ret = {
            userName: user[displayKeys[0]],
            firstName: user[displayKeys[1]],
            lastName: user[displayKeys[2]],
            category: categories.filter(cat => {
                return cat.code === user[displayKeys[3]]
            })[0].category,
            loginCount: user[displayKeys[4]],
        }
        retList.push(ret);
    });
    return retList;
}
