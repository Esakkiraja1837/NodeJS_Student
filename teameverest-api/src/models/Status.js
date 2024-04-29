'use strict';
const { errors, constants } = require('../utils');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  Status.init({
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
    isActive: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    paranoid: true,
    modelName: 'Status',
    tableName: 'te_status'
  });
  return Status;
};
