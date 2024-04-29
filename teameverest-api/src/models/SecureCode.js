'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SecureCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  SecureCode.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    activationCode: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    paranoid: true,
    modelName: 'SecureCode',
    tableName: 'te_securecode'
  });
  return SecureCode;
};
