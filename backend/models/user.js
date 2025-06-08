const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  USER_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  USER_USERNAME: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  USER_EMAIL: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  USER_PASSWORD: {
    type: DataTypes.STRING,
    allowNull: false
  },
  USER_CREATED_AT: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  USER_UPDATED_AT: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  disabled: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'USERS', // FIXED: Match actual table name in lowercase
  timestamps: true,
  createdAt: 'USER_CREATED_AT',
  updatedAt: 'USER_UPDATED_AT'
});

module.exports = User;
