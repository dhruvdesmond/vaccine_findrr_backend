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
			email: curr_email
		}
	})
		.then(notifier => {
			if (notifier) {
				return res.status(400).json({ error: "Email already exists" })
			}
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
const findDistrictInDb = () => {
	models.notifier.findAll()
}


const initialize_nodemailer = () => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.E_NAME,
			pass: process.env.E_PASS
		}
	});
}
initialize_nodemailer()
const sendMailFunc = async (email,district_name) => {
	console.log("sendMailFunc")
	console.log(email,district_name)
	let mailOptions = {
		from: process.env.E_NAME,
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
// start_cron_job()
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



cron.schedule('* */6 * * *', () => {
	console.log('running a task every two minutes');
	start_cron_job()
  });

