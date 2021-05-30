
const { Sequelize } = require('sequelize');
// const { applyExtraSetup } = require('./extra-setup');

// In a real app, you should keep the database connection URL as an environment variable.
// But for this example, we will just use a local SQLite database.
// const sequelize = new Sequelize(process.env.DB_CONNECTION_URL);
// const sequelize = new Sequelize({
// 	dialect: 'sqlite',
// 	storage: 'sqlite-example-database/example-db.sqlite',
// 	logQueryParameters: true,
// 	benchmark: true
// });
console.log(process.env.DB_USER)
const sequelize = new Sequelize("heroku_6eec06251a21929", "bbc3b6a25c43d7","498bc20f", {
    host: 'us-cdbr-east-04.cleardb.com',
    dialect: 'mysql',
	logQueryParameters: true,
	benchmark: true
});

const modelDefiners = [
	require('./models/user.js'),
	require('./models/notifier'),

	// require('./models/user_role_mappings'),

	// Add more models here...
	// require('./models/item'),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

// We execute any extra setup after the models are defined, such as adding associations.
// applyExtraSetup(sequelize);

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;