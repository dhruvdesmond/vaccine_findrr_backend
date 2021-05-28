  
const {Sequelize, DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('user', {
		// The following specification of the 'id' attribute could be omitted
		// since it is the default.
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true
		},
		password: {
			type: Sequelize.STRING
		},
		createdAt: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: Sequelize.NOW
		},
		updatedAt: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: Sequelize.NOW
		},
		is_deleted:{
			type: Sequelize.BOOLEAN,
			defaultValue: false
		}
	});
};