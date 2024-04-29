'use strict';
const {
  Model
} = require('sequelize');
const { errors, constants } = require('../utils');

module.exports = (sequelize, DataTypes) => {
  class Accessory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Accessory.belongsTo(models.Status, {
        as: 'status',
        foreignKey: { name: 'statusId' }
      });
    }
  }
  Accessory.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: constants.MIN_MAX_NAME_LENGTH,
          msg: errors.NAME_MUST_BE_BETWEEN_3_AND_32_CHARACTERS
        }
      }
    },
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    statusId: {
      references: {
        key: 'id',
        model: 'Status'
      },
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    paranoid: true,
    modelName: 'Accessory',
    tableName: 'te_accessory'
  });
  return Accessory;
};
