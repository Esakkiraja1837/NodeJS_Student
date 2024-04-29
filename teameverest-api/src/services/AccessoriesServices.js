const { Op } = require('sequelize');

const { Accessory } = require('../models');
const logger = require('../config/logger');
const { errors, constants, utils } = require('../utils');
const responseFields = [['uuid', 'id'], 'name'];

const AccessoriesServices = {
  /**
  * Creates a new accessory.
  *
  * @param {Object} data - The data object containing information for the new accessory.
  *
  * @returns {Object} .data - The created accessory object.
  * @returns {string} .message - A success message indicating that the accessory has been created.
  */
  create: async (data) => {
    try {
      if (utils.isEmpty(data?.name)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.NAME_EMPTY }
        };
      }
      const accessory = await Accessory.create(data);

      return {
        data: accessory,
        message: constants.messages.ACCESSORY_CREATED
      };
    } catch (error) {
      logger.error(errors.ERROR_IN_ACCESSORY_CREATION, error);
      return utils.handleErrors(error, errors.ERROR_IN_ACCESSORY_CREATION);
    }
  },

  /**
   * Search accessories by name.
   *
   * @param {string} data - The partial name to search for accessories.
   * @returns {Object} - Object containing the result data or an error response.
   */
  search: async (data) => {
    try {
      if (utils.isEmpty(data)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: {
            message: errors.NAME_EMPTY
          }
        };
      }
      const results = await Accessory.findAll({
        where: {
          name: { [Op.like]: `%${data}%` }
        },
        attributes: responseFields
      });
      return { data: results };
    } catch (error) {
      logger.error(errors.ERROR_IN_FETCHING_ACCESSORY, error);
      return {
        code: constants.status.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_FETCHING_ACCESSORY }
      };
    }
  },

  /**
   * Find a accessory by ID.
   *
   * @param {int} accessoryId - The ID of the accessory to find.
   * @returns {Object} - An object containing the accessory data or an error response.
   */
  findById: async (accessoryId, isCustomFields) => {
    try {
      if (utils.isEmpty(accessoryId)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.ID_EMPTY }
        };
      }
      const accessory = await Accessory.findOne({
        where: {
          [Op.or]: [
            { id: accessoryId },
            { uuid: accessoryId }
          ]
        },
        attributes: isCustomFields ? responseFields : null
      });
      if (utils.isEmpty(accessory)) {
        return {
          code: constants.status.NOT_FOUND,
          errors: { message: errors.ACCESSORY_NOT_FOUND }
        };
      }
      return { data: accessory };
    } catch (error) {
      logger.error(errors.ERROR_IN_FETCHING_ACCESSORY, error);
      return {
        code: constants.status.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_FETCHING_ACCESSORY }
      };
    }
  },

  /**
   * Fetch all accessories with a status not equal to STATUS_DELETE.
   *
   * @returns {Object} - An object containing the data or error information.
   */
  fetchAll: async (query) => {
    try {
      return utils.fetchRecords(Accessory, query, responseFields);
    } catch (error) {
      logger.error(errors.ERROR_IN_FETCHING_ACCESSORIES_LIST, error);
      return {
        code: constants.status.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_FETCHING_ACCESSORIES_LIST }
      };
    }
  },

  /**
   * Update a accessory by ID.
   *
   * @param {int} accessoryId - The ID of the accessory to update.
   * @param {object} data - The data to update the accessory with.
   * @returns {object} - The result of the update operation.
   */
  update: async (accessoryId, data) => {
    try {
      if (utils.isEmpty(accessoryId)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.ID_EMPTY }
        };
      }
      const result = await AccessoriesServices.findById(accessoryId, false);
      const accessory = result.data;

      if (utils.isEmpty(accessory)) {
        return result;
      }
      await accessory.update(data);
      logger.info(constants.messages.ACCESSORY_UPDATED);
      return { data: { message: constants.messages.ACCESSORY_UPDATED } };
    } catch (error) {
      logger.error(errors.ERROR_IN_UPDATE_ACCESSORY, error);
      return utils.handleErrors(error, errors.ERROR_IN_UPDATE_ACCESSORY);
    }
  },

  /**
   * Deletes a accessory based on the provided accessoryId.
   *
   * @param {number} accessoryId - The ID of the accessory to be deleted.
   * @returns {object} - An object containing a success message or an error response.
   */
  delete: async (accessoryId) => {
    try {
      if (utils.isEmpty(accessoryId)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.ID_EMPTY }
        };
      }
      const result = await AccessoriesServices.findById(accessoryId, false);
      const accessory = result.data;

      if (utils.isEmpty(accessory)) {
        return result;
      }
      await accessory.update({ status: constants.status.STATUS_DELETE });
      logger.info(constants.messages.ACCESSORY_DELETED);
      return { data: { message: constants.messages.ACCESSORY_DELETED } };
    } catch (error) {
      logger.error(errors.ERROR_IN_DELETE_ACCESSORY, error);
      return {
        code: constants.status.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_DELETE_ACCESSORY }
      };
    }
  }
};
module.exports = AccessoriesServices;
