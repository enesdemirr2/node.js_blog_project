const db_configs = require('./config/config.json')
const Sequelize = require('sequelize')


const conneciton = new Sequelize(
    db_configs.development.database,
    db_configs.development.username,
    db_configs.development.password,
    {
        host: db_configs.development.host,
        dialect: db_configs.development.dialect,
        port: process.env.MYSQL_CONNECTİON_STRİNG,
        logging: false
    }
)

if(conneciton.authenticate(db_configs.development))
console.log('Veri tabanına bağlandı');
else {
    console.log(('Veri tabanı bağlantısı başarısız.'));
}
module.exports = conneciton