'use strict';
const {
  Model
} = require('sequelize');
const { errors } = require('../utils');

module.exports = (sequelize, DataTypes) => {
  class Corporate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Corporate.belongsTo(models.Status, {
        as: 'status',
        foreignKey: { name: 'statusId' }
      });
      Corporate.hasOne(models.Location, {
        as: 'location',
        foreignKey: { name: 'locationId' }
      });
      Corporate.hasMany(models.Classroom, {
        as: 'classroom',
        foreignKey: { name: 'corporateId' }
      });
    }
  }
  Corporate.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    email: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING
    },
    contactNo: {
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
    street: DataTypes.STRING,
    landmark: DataTypes.STRING,
    city: DataTypes.STRING,
    pincode: DataTypes.INTEGER,
    capacity: DataTypes.INTEGER,
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
    modelName: 'Corporate',
    tableName: 'te_corporate'
  });
  return Corporate;
};
