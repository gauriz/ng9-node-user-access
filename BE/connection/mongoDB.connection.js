const logger = require('../utilityJS/logger/logger');
const MongoClient = require('mongodb').MongoClient;
class Connection {
    static async connectToMongo(app) {
        console.log(this.url);
        let client = await MongoClient.connect(this.url, this.options)
            .then(client => {
                const db = client.db('user-access');
                app.locals.usersCollection = db.collection('users');
                app.locals.categoriesCollection = db.collection('categories');
                app.locals.loginSessionCollection = db.collection('login_sessions');
            }, error => {
                console.log('MongoDB Connection Error');
                logger.critical('MongoDB Connection Error');
            });
    }
}

Connection.db = null
Connection.url = "mongodb+srv://gauri:gauri@cluster0-qfacz.azure.mongodb.net/user-access?retryWrites=true&w=majority";
Connection.options = {
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

module.exports = Connection;