const { Model, DataTypes } = require("sequelize");
const { sequelize } = require('./sequelize.js');

class TokenBalance extends Model {
}

TokenBalance.init({
  account_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  balance: {
    type: DataTypes.DECIMAL,
  }
}, {
  sequelize,
  tableName: 'token_balances',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = TokenBalance;
