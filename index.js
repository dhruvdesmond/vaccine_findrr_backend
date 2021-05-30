const express = require('express')
var cors = require('cors')
require('dotenv').config()
const axios = require('axios');

const app = express()
const multer = require('multer');
const upload = multer();
app.set('view engine', 'ejs');
path = require("path");
app.use(express.urlencoded());
const moment = require('moment')
var cron = require('node-cron');
var validator = require("email-validator");
 
app.use(express.json());
app.use(cors())
const nodemailer = require("nodemailer");

const PORT = process.env.PORT;
const sequelize = require('./sequelize');
const { models } = require('./sequelize');
const { Op } = require('sequelize')

async function assertDatabaseConnectionOk() {
	console.log(`Checking database connection...`);
	try {
		await sequelize.authenticate();
		await sequelize.sync();
		// await sequelize.sync({force: true});
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


app.get('/', async (req, res) => {

	res.send("Home Page")
})



app.post('/', (req, res) => {

	console.log("post")
})

app.get("/users", (req, res) => {
	models.user.findAll()
		.then((users) => {
			console.log("Returning users list !!")
			return res.json(users)
		})
		.catch(err => {
			return res.json({ error: err })
		})
});
app.get("/notifications", (req, res) => {
	models.notifier.findAll()
		.then((notifications) => {
			console.log("Returning notifications list !!")
			return res.json(notifications)
		})
		.catch(err => {
			return res.json({ error: err })
		})
});


app.post("/notifications", upload.none(), async (req, res) => {
	const curr_email = req.body.email
	const curr_district_id = req.body.district_id
	const curr_district_name = req.body.district_name
	models.notifier.findOne({
		where: {
			email: curr_email,
			district_id: curr_district_id
		}
	})
		.then(notifier => {
			if (notifier) {
				return res.status(400).json({ error: "Notifaction already exists" })
			}
			if(validator.validate(curr_email)){
				models.notifier.create({
					email: curr_email,
					district_id: curr_district_id,
					district_name: curr_district_name
				})
					.then(notifier => {
						return res.status(200).json({ "message": "notification created!!" })
					})
					.catch(err => {
						return res.status(400).json({ error: err })
					})
			}
			else{
				return res.status(400).json({ error: "wrong email" })
			}

			
		})
		.catch(err => {
			return res.status(400).json({ error: err })
		})
});
app.post("/notifications/unsubscribe", upload.none(), async (req, res) => {
	const curr_id = req.body.id
	// const curr_district_id = req.body.district_id
	models.notifier.findOne({
		where: {
			id: curr_id
		}
	})
		.then(notifier => {
			const new_val = !(notifier.is_subscribed)
			notifier.is_subscribed = new_val
			notifier.save()
			return res.json({ msg: "Success" })
		})
		.catch(err => {
			return res.status(400).json({ error: err })
		})
});
// const findDistrictInDb = () => {
// 	models.notifier.findAll()
// }






// cron.schedule('* */6 * * *', () => {
// 	console.log('running a task every two minutes');
	
//   });

