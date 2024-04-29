const { Status } = require('../models');
const logger = require('../config/logger');
const { errors, constants, utils } = require('../utils');

const StatusServices = {
/**
 * Create a new status.
 *
 * @param {Object} data - Data for creating a new status.
 * @returns {Object} Object with the created status data and a success message.
 * @throws {Object} Object with error details if an error occurs during status creation.
 */
  create: async (data) => {
    try {
      if (utils.isEmpty(data?.name)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.NAME_EMPTY }
        };
      }
      const createdStatus = await Status.create(data);
      return {
        data: createdStatus,
        message: constants.messages.STATUS_CREATED
      };
    } catch (error) {
      logger.error(errors.ERROR_IN_STATUS_CREATION, error);
      return utils.handleErrors(error, errors.ERROR_IN_STATUS_CREATION);
    }
  },

  /**
   * Fetches the status by given name
   * @param {*} statusName
   * @returns status object
   */
  fetchByName: async (statusName) => {
    try {
      if (utils.isEmpty(statusName)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.NAME_EMPTY }
        };
      }
      const result = await Status.findOne({
        name: statusName,
        isActive: constants.TRUE,
        isDeleted: constants.FALSE
      });
      if (utils.isEmpty(result)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.RECORD_NOT_FOUND }
        };
      }
      return { data: result };
    } catch (error) {
      logger.error(errors.ERROR_IN_STATUS_CREATION, error);
      return utils.handleErrors(error, errors.ERROR_IN_STATUS_CREATION);
    }
  },

  /**
   * Get status details.
   *
   * @returns {Object} Object with status details.
   * @throws {Error} If an error occurs while fetching status.
   */
  fetchAll: async () => {
    try {
      const status = await Status.findAll();
      return { data: status };
    } catch (error) {
      logger.error(errors.ERROR_IN_FETCHING_STATUS_LIST, error);
      return {
        code: constants.status.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_FETCHING_STATUS_LIST, error }
      };
    }
  }
};

module.exports = StatusServices;
