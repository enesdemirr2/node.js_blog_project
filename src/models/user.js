'use strict';
const { Model, DataTypes } = require('sequelize');

const sequelize = require('../../config/database');

  class User extends Model {}
  User.init({
    full_name: DataTypes.STRING,
    user_name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'user'
  });


module.exports = User;