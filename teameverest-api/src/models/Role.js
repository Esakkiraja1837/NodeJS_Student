'use strict';
const { errors, constants } = require('../utils');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Role.belongsTo(models.Status, {
        as: 'status',
        foreignKey: { name: 'statusId' }
      });
      // define association here
    }
  }
  Role.init({
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
    statusId: {
      type: DataTypes.INTEGER,
      references: {
        key: 'id',
        model: 'Status'
      }
    },
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    paranoid: true,
    modelName: 'Role',
    tableName: 'te_role'
  });
  return Role;
};
