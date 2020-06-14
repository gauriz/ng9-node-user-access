const loginController = require('./controllers/login.controller');
const userController = require('./controllers/user.controller');
const express = require('express');
var MongoClient = require('mongodb').MongoClient;
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

MongoClient.connect('mongodb://localhost:27017/', { useUnifiedTopology: true })
    .then(client => {
        const db = client.db('user-access');
        const usersCollection = db.collection('users');
        app.locals.usersCollection = usersCollection;
        const categoriesCollection = db.collection('categories');
        app.locals.categoriesCollection = categoriesCollection;
    });


// app.get('/', (req, res) => {
//     let result = authenticate(req, res);
// }
// );

app.get('/login', async (req, res) => {
    const collection = req.app.locals.usersCollection;
    await loginController.generateAuthToken(req, res, collection);
}
);

app.get('/users', async (req, res) => {
    const collection = req.app.locals.usersCollection;
    const categoriesCollection = req.app.locals.categoriesCollection;
    await userController.listUsers(req, res, collection, categoriesCollection);
}
);

app.post('/add-user', async (req, res) => {
    const collection = req.app.locals.usersCollection;
    await userController.addUser(req, res, collection);
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));