// const { models } = require('./sequelize');
const nodemailer = require("nodemailer");
const { Op } = require('sequelize')
const moment = require('moment')
const axios = require('axios');
const sequelize = require('./sequelize');
const { models } = require('./sequelize');

require('dotenv').config()
const express = require('express')
var cors = require('cors')
require('dotenv').config()
// const axios = require('axios');

const app = express()
const multer = require('multer');
const upload = multer();
// app.set('view engine', 'ejs');
// path = require("path");
app.use(express.urlencoded());
// const moment = require('moment')
// var cron = require('node-cron');

app.use(express.json());
app.use(cors())
// const nodemailer = require("nodemailer");

const PORT = process.env.PORT;
// const sequelize = require('./sequelize');
// const { Op } = require('sequelize')


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



// const sequelize = require('./sequelize');
const initialize_nodemailer = () => {
	
}
initialize_nodemailer()
const sendMailFunc = async (email,district_name) => {
    var transporter = await nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: "vaccinefindrrdemo1@gmail.com",
			pass: "v_f_d_@135_demo"
		}
	});
	console.log("sendMailFunc")
	console.log(email,district_name)
	let mailOptions = {
		from: "vaccinefindrrdemo1@gmail.com",
		to: email,
		subject: 'Vaccine available',
		text: 'Hi /n Vaccine is now available at distirct code ->  '+ district_name,
	};
	await transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}


const getAllDistrictsWithSubscribe = async () => {
	const districts = await models.notifier.findAll({
		where: {
			updatedAt: {
				[Op.gte]: moment().subtract(1, 'days').toDate()
			},
			is_subscribed: true

		}
	})
		.then((notifications) => {

			const districts = {}
			notifications.map((notification) => {
				if (!(notification.district_id in districts)) {
					districts[notification.district_id] = {email:notification.email,district_name:notification.district_name}
					
				}
			})
			
			console.log("display all districts ----------------------")

			console.log(districts)
			return districts
		})
		.catch(err => {
			console.log("errorr -->>> ", err)
			return err
		})
	return districts
}

const start_cron_job = async () => {
	console.log("=======  start_cron_job =======")
	const district_ids = await getAllDistrictsWithSubscribe()
	console.log("start -----------------------")
	console.log(district_ids)

	for (const property in district_ids) {
		const val = await isVaccineAvail(property)
		if(val == true){
			sendMailFunc(district_ids[property]['email'],district_ids[property]['district_name'])

		}
	}

}

const isVaccineAvail = async (district_id) => {
	let today = new Date();
	const dd = String(today.getDate()).padStart(2, '0');
	const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	const yyyy = today.getFullYear();
	today = dd + '-' + mm + '-' + yyyy;
	let url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=" + district_id + "&date=" + today
	console.log("url",url)
	const vaccineAvail = await axios.get(url)
		.then(response => {
			let total_vaccine = 0
			const arr = response['data']['sessions']
			arr.forEach((center) =>{
				total_vaccine += center['available_capacity_dose1']
			})
			if(total_vaccine > 0){
				return true
			}
			return false
		})
		.catch(error => {
			console.log(error);
			return false
		});
	return vaccineAvail
}


start_cron_job()