const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');
const Post = require('./post');

const Comment = sequelize.define('Comment', {
  COMMENT_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  COMMENT_CONTENT: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  COMMENT_USER_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'USER_ID'
    }
  },
  COMMENT_POST_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Post,
      key: 'POST_ID'
    }
  },
  COMMENT_CREATED_AT: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  COMMENT_UPDATED_AT: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  disabled: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
}, {
  tableName: 'COMMENTS',
  timestamps: true,
  createdAt: 'COMMENT_CREATED_AT',
  updatedAt: 'COMMENT_UPDATED_AT'
});

Comment.belongsTo(User, { foreignKey: 'COMMENT_USER_ID' });
Comment.belongsTo(Post, { foreignKey: 'COMMENT_POST_ID' });
User.hasMany(Comment, { foreignKey: 'COMMENT_USER_ID' });
Post.hasMany(Comment, { foreignKey: 'COMMENT_POST_ID' });

module.exports = Comment;