const authenticate = require('./login.controller');
const bcryption = require('../utilityJS/bcrypt-password');

module.exports.listUsers = listUserEP;
module.exports.addUser = addUser;
module.exports.userLogs = userLogs;

async function listUserEP(req, res, collection, categoriesCollection) {
    let authenticated = await authenticate.authenticateUser(req, res, collection);
    if (authenticated === true) {
        let user_list = await collection.find().toArray();
        let categories = await categoriesCollection.find().toArray();
        res.status(200).json({
            users: listUsers(user_list, categories)
        });
    }
}

async function addUser(req, res, collection) {
    const body = req.body;
    let password = await bcryption.cryptPassword(body.password);
    try {
        let result = await collection.insertOne(
            {
                user_name: body.userName,
                first_name: body.firstName,
                last_name: body.lastName,
                gender: body.gender,
                country_code: body.countryCode,
                phone_number: body.phoneNumber,
                experience_years: body.expYears,
                image_path: body.imagePath,
                email_id: body.email,
                category_code: body.category,
                supervisor: {
                    id: body.supervisorId,
                    name: body.supervisorName
                },
                login_count: 0,
                hashed_password: password
            });
        if (result && result.ops && Array.isArray(result.ops)) {
            res.setHeader('Content-Type', 'application/json');
            res.send({ response: 'User created sucessfully', userId: result.ops[0]._id })
        }
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.send({ error: err })
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
            categoryCode: user[displayKeys[3]],
            category: categories.filter(cat => {
                return cat.code === user[displayKeys[3]]
            })[0].category,
            loginCount: user[displayKeys[4]],
        }
        retList.push(ret);
    });
    return retList;
}

async function userLogs(req, res, loginSession) {
    let searchParam = {};
    let sort = {};

    if (req.query) {
        if ('userName' in req.query) {
            searchParam['user_name'] = { '$regex': req.query.userName, '$options': 'i' };
        }
        if ('ip' in req.query) {
            searchParam['ip'] = { '$regex': req.query.ip, '$options': 'i' };
        }
        if ('sortDir' in req.query && 'sortKey' in req.query) {
            sort[req.query.sortKey] = req.query.sortDir === 'asc' ? 1 : -1;
        }
    }
    let logs = await loginSession.find(searchParam).sort(sort).toArray();
    res.status(200).json({
        users: logs
    });
}
