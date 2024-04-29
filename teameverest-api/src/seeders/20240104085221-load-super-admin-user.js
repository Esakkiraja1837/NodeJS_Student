'use strict';
const path = require('path');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { constants } = require('./../utils');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const env = process.env;
const superAdmin = env.SUPER_ADMIN ? JSON.parse(env.SUPER_ADMIN) : {};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('te_user', [{
      firstName: superAdmin.firstName,
      lastName: superAdmin.lastName,
      uuid: crypto.randomUUID(),
      email: superAdmin.email,
      password: await bcrypt.hash(superAdmin.password, parseInt(constants.status.PWD_ENCRYPTION_ITERATION, 10)),
      phoneNo: superAdmin.phoneNo || '',
      roleId: 1,
      statusId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
