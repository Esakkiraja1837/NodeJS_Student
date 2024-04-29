'use strict';
const {
  Model
} = require('sequelize');
const { errors, constants } = require('../utils');

module.exports = (sequelize, DataTypes) => {
  class Classroom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Classroom.belongsTo(models.Status, {
        as: 'status',
        foreignKey: { name: 'statusId' }
      });
      Classroom.belongsTo(models.Accessory, {
        as: 'accessory',
        foreignKey: { name: 'accessoryId' }
      });
      Classroom.belongsTo(models.Corporate, {
        as: 'corporate',
        foreignKey: { name: 'corporateId' }
      });
    }
  }
  Classroom.init({
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
    corporateId: {
      type: DataTypes.INTEGER,
      references: {
        key: 'id',
        model: 'Corporate'
      }
    },
    accessoryId: {
      type: DataTypes.INTEGER,
      references: {
        key: 'id',
        model: 'Accessory'
      }
    },
    capacity: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    statusId: {
      type: DataTypes.INTEGER,
      references: {
        key: 'id',
        model: 'Status'
      }
    }
  }, {
    sequelize,
    paranoid: true,
    modelName: 'Classroom',
    tableName: 'te_classroom'
  });
  return Classroom;
};
