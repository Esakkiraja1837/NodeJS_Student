'use strict';
const crypto = require('crypto');

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
    await queryInterface.bulkInsert('te_role', [{
      name: 'Super Admin',
      uuid: crypto.randomUUID(),
      statusId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Admin',
      statusId: 2,
      uuid: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Volunteer',
      uuid: crypto.randomUUID(),
      statusId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Student',
      uuid: crypto.randomUUID(),
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
