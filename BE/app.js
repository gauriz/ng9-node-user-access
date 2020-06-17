const routes = require('./routes/user.route');
const Connection = require('./connection/mongoDB.connection');
const express = require('express');
const bodyParser = require("body-parser");
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); 

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Controll-Allow-Origin', '*');
    res.setHeader('Access-controll-allow-Methods', 'GET,POST,PUT,DELETE,PATCH');
    res.setHeader('Access-Controll-Allow-Headers', 'Content-Type');
    next();
});
Connection.connectToMongo(app);

app.use('/', routes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));