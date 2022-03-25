const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

class User extends Model {
  static associate(models) {
    // define association here
  }
}
User.init({
  user_name: DataTypes.STRING,
  full_name: DataTypes.STRING,
  password: DataTypes.STRING,
  email: DataTypes.STRING,
}, {
  // Other model options 
  sequelize, // pass the connection instance
  modelName: 'User' // choose the model name
});


module.exports = User