const { Sequelize }  = require('sequelize');
const config = require('config');

const pgConfig = config.get('postgres')

const sequelize = new Sequelize(`postgres://${pgConfig.username}:${pgConfig.password}@${pgConfig.hostname}:5432/${pgConfig.database}`, {
  logging: config.get('postgres.logging')
})

async function connect () {
  await sequelize.authenticate()
  console.log('DB connected.')
  return sequelize
}

module.exports = {
  sequelize,
  connect,
}
