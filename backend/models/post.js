const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const Post = sequelize.define('Post', {
  POST_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  POST_TITLE: {
    type: DataTypes.STRING,
    allowNull: false
  },
  POST_CONTENT: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  POST_USER_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'USER_ID'
    }
  },
  POST_CREATED_AT: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  POST_UPDATED_AT: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
    disabled: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  
}, {
  tableName: 'POSTS',
  timestamps: true,
  createdAt: 'POST_CREATED_AT',
  updatedAt: 'POST_UPDATED_AT'
});

Post.belongsTo(User, { foreignKey: 'POST_USER_ID' });
User.hasMany(Post, { foreignKey: 'POST_USER_ID' });

module.exports = Post;