const { Model, DataTypes } = require("sequelize");
const { sequelize } = require('./sequelize');

class Checkpoint extends Model {
  static async getCheckpoint (name) {
    const checkpoint = await Checkpoint.findOne({
      where: {
        name
      }
    });
  }
}

Checkpoint.init({
  name: {
    type: DataTypes.STRING,
    unique: true,
  },
  checkpoint: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize ,
  tableName: 'checkpoint',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Checkpoint;
