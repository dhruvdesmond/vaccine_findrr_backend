const express = require('express')
var cors = require('cors')
require('dotenv').config()

// var bodyParser = require('body-parser')
const app = express()
app.set('view engine', 'ejs');
path = require("path");
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cors())

const PORT = process.env.PORT;
const sequelize = require('./sequelize');

async function assertDatabaseConnectionOk() {
	console.log(`Checking database connection...`);
	try {
		await sequelize.authenticate();
        await sequelize.sync();
		console.log('Database connection OK!');
	} catch (error) {
		console.log('Unable to connect to the database:');
		console.log(error.message);
		process.exit(1);
	}
}
async function init() {
	await assertDatabaseConnectionOk();

	console.log(`Starting Sequelize + Express example on port ${PORT}...`);

	app.listen(PORT, () => {
		console.log(`Express server started on port ${PORT}. Try some routes, such as '/api/users'.`);
	});
}
init();

// var roleRoutes = require("./controller/role_controller");


 
app.get('/', (req, res) => {
    res.send("Home Page")
})



app.post('/', (req, res) => {
    console.log("post")
})

// app.use(userRoutes);
// app.use(roleRoutes);


