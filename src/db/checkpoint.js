const { Model, DataTypes } = require("sequelize");
const { sequelize } = require('./sequelize');

class ChargeCheckpoint extends Model {
}

ChargeCheckpoint.init({
  last_charged_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize ,
  tableName: 'charge_checkpoint',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ChargeCheckpoint;
