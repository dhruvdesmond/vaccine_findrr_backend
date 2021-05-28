// const Sequelize = require('sequelize');

// ////////////////////// offline SQl
// const sequelize = new Sequelize(process.env.DB_Name, process.env.DB_USER,process.env.DB_PASS, {
//     host: 'localhost',
//     dialect: 'mysql'
// });
// sequelize
//     .authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });
//     // sequelize.sync({
//     //     force: true
//     // });
//     sequelize.sync();


// module.exports = sequelize;