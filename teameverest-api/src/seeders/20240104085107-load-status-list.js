'use strict';
const crypto = require('crypto');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
    */
    await queryInterface.bulkInsert('te_status', [{
      name: 'Inactive',
      uuid: crypto.randomUUID(),
      isActive: true,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Active',
      uuid: crypto.randomUUID(),
      isActive: true,
      isDeleted: false,
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
