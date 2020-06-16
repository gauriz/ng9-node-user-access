const MongoClient = require('mongodb').MongoClient;
class Connection {
    static async connectToMongo(app) {
        MongoClient.connect(this.url, this.options)
            .then(client => {
                const db = client.db('user-access');
                app.locals.usersCollection = db.collection('users');
                app.locals.categoriesCollection = db.collection('categories');
                app.locals.loginSessionCollection = db.collection('login_sessions');
            });
    }
}

Connection.db = null
Connection.url = 'mongodb://localhost:27017/'
Connection.options = {
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

module.exports = Connection;