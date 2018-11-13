const config = require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

const port = process.env.port || config.development.port;
const dbDev = config.development.db;

const {getHomePage} = require('./routes/index');

const db = mysql.createConnection(dbDev);

db.connect((err) => {
	if (err) {
		throw err;
	}

	console.log('Connected to database');
});

global.db = db;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder

// routes for the app
app.get('/', getHomePage);

// set the app to listen on the port
app.listen(port, () => {
	console.log(`Server running on port: ${port}`);
});