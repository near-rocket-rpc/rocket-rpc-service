const { Model, DataTypes } = require("sequelize");
const { sequelize } = require('./sequelize');

class Checkpoint extends Model {
  /**
   * 
   * @param {string} name 
   * @returns {number | null}
   */
  static async getCheckpoint (name) {
    const checkpoint = await Checkpoint.findOne({
      where: {
        name
      }
    });

    return checkpoint ? checkpoint.checkpoint : null;
  }

  static async saveCheckpoint (name, cp) {
    await Checkpoint.upsert({
      name,
      checkpoint: cp
    });
  }
}

Checkpoint.init({
  name: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  checkpoint: {
    type: DataTypes.BIGINT,
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
