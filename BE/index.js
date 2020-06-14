const loginController = require('./controllers/login.controller');
const bcryption = require('./utilityJS/bcrypt-password');
const express = require('express');
var MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;

MongoClient.connect('mongodb://localhost:27017/', { useUnifiedTopology: true })
    .then(client => {
        const db = client.db('user-access');
        const usersCollection = db.collection('users');
        app.locals.usersCollection = usersCollection;
    });


app.get('/', (req, res) => {
    let result = authenticate(req, res);
}
);

app.get('/login', async (req, res) => {
    const collection = req.app.locals.usersCollection;
    await loginController.generateAuthToken(req, res, collection);
}
);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));