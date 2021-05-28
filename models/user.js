
// const Role = require('./role');
// const Sequelize = require('sequelize');
// const sequelize = require('./sequelize')

// const User = sequelize.define('user', {
//     // attributes
//     id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     name: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     email: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         unique: true
//     },
//     password: {
//         type: Sequelize.STRING
//     },
//     createdAt: {
//         type: Sequelize.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.NOW
//     },
//     updatedAt: {
//         type: Sequelize.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.NOW
//     },
//     is_deleted:{
//         type: Sequelize.BOOLEAN,
//         defaultValue: false
//     }
// });
// User.hasOne(Role,{ as: "role" })

// module.exports = User;

