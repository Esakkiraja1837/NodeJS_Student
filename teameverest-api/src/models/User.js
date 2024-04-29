'use strict';
const {
  Model
} = require('sequelize');
const { errors, constants } = require('../utils');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      User.belongsTo(models.Role, { as: 'role', foreignKey: { name: 'roleId' } });
      User.belongsTo(models.Status, { as: 'status', foreignKey: { name: 'statusId' } });
      User.belongsTo(models.Location, { as: 'location', foreignKey: { name: 'locationId' } });
    }
  }
  User.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: constants.MIN_MAX_NAME_LENGTH,
          msg: errors.FIRST_NAME_MUST_BE_BETWEEN_3_AND_32_CHARACTERS
        }
      }
    },
    lastName: {
      type: DataTypes.STRING
    },
    email: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING
    },
    password: DataTypes.STRING,
    phoneNo: {
      type: DataTypes.STRING,
      validate: {
        is: {
          args: /^[0-9]+$/,
          msg: errors.PHONE_NUMBER_MUST_CONTAIN_ONLY_NUMERIC_CHARACTERS
        },
        len: {
          args: [5, 10],
          msg: errors.PHONE_NUMBER_MUST_BE_BETWEEN_10_CHARACTERS
        }
      }
    },
    lastLogin: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        key: 'id',
        model: 'Role'
      }
    },
    locationId: {
      type: DataTypes.INTEGER,
      references: {
        key: 'id',
        model: 'Location'
      }
    },
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
    modelName: 'User',
    tableName: 'te_user'
  });
  return User;
};
