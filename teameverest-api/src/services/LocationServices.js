const { Op } = require('sequelize');

const { Location } = require('../models');
const logger = require('../config/logger');
const { errors, constants, utils } = require('../utils');
const responseFields = [['uuid', 'id'], 'name', 'state'];

const LocationServices = {
  /**
   * Create a new location
   *
   * Checks if a location with a similar name already exists.
   * @param {Object} data - Data for creating a new location.
   * @returns {Object} Object with the created location data and a success message.
   * @throws {Object} Object with error details if an error occurs during location creation.
  */
  create: async (data) => {
    try {
      if (utils.isEmpty(data?.name)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.NAME_EMPTY }
        };
      }
      const existingLocations = await Location.findOne({
        where: {
          name: { [Op.like]: `%${data.name}%` }
        }
      });

      if (existingLocations) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.NAME_ALREADY_EXISTS }
        };
      }
      const location = await Location.create(data);
      return {
        data: location,
        message: constants.messages.LOCATION_CREATED
      };
    } catch (error) {
      logger.error(errors.ERROR_IN_LOCATION_CREATION, error);
      return utils.handleErrors(error, errors.ERROR_IN_LOCATION_CREATION);
    }
  },

  /**
   * Search locations by name.
   *
   * @param {string} data - The partial name to search for locations.
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
      const results = await Location.findAll({
        where: {
          name: { [Op.like]: `%${data}%` }
        },
        attributes: responseFields
      });
      return { data: results };
    } catch (error) {
      logger.error(errors.ERROR_IN_FETCHING_LOCATION, error);
      return {
        code: constants.status.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_FETCHING_LOCATION }
      };
    }
  },

  /**
   * Find a location by ID.
   *
   * @param {string|number} locationId - The ID or UUID of the location to find.
   * @param {int} locationId - The ID of the location to find.
   * @returns {Object} - An object containing the location data or an error response.
   */
  findById: async (locationId, isCustomFields) => {
    try {
      if (utils.isEmpty(locationId)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.ID_EMPTY }
        };
      }

      const query = {};

      if (utils.isValidUUID(locationId)) {
        query.uuid = locationId;
      } else {
        query.id = locationId;
      }

      const location = await Location.findOne({
        where: query,
        raw: !!isCustomFields,
        attributes: isCustomFields ? responseFields : null
      });
      if (utils.isEmpty(location)) {
        return {
          code: constants.status.NOT_FOUND,
          errors: { message: errors.LOCATION_NOT_FOUND }
        };
      }
      return { data: location };
    } catch (error) {
      logger.error(errors.ERROR_IN_FETCHING_LOCATION, error);
      return {
        code: constants.status.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_FETCHING_LOCATION }
      };
    }
  },

  /**
   * Fetch all locations with a status not equal to STATUS_DELETE.
   *
   * @returns {Object} - An object containing the data or error information.
   */
  fetchAll: async (query) => {
    try {
      return utils.fetchRecords(Location, query, responseFields);
    } catch (error) {
      logger.error(errors.ERROR_IN_FETCHING_LOCATION_LIST, error);
      return {
        code: constants.status.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_FETCHING_LOCATION_LIST }
      };
    }
  },

  /**
   * Update a location by ID.
   *
   * Check if a location with similar name already exists
   *
   * @param {int} locationId - The ID of the location to update.
   * @param {object} data - The data to update the location with.
   * @returns {object} - The result of the update operation.
   */
  update: async (locationId, data) => {
    try {
      if (utils.isEmpty(locationId)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.ID_EMPTY }
        };
      }
      const existingLocations = await Location.findOne({
        where: {
          name: { [Op.like]: `%${data.name}%` }
        }
      });

      if (existingLocations) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.NAME_ALREADY_EXISTS }
        };
      }
      const result = await LocationServices.findById(locationId, false);
      const location = result.data;

      if (utils.isEmpty(location)) {
        return result;
      }
      await location.update(data);
      logger.info(constants.messages.LOCATION_UPDATED);
      return { data: { message: constants.messages.LOCATION_UPDATED } };
    } catch (error) {
      logger.error(errors.ERROR_IN_UPDATE_LOCATION, error);
      return utils.handleErrors(error, errors.ERROR_IN_UPDATE_LOCATION);
    }
  },

  /**
   * Deletes a location based on the provided locationId.
   *
   * @param {number} locationId - The ID of the location to be deleted.
   * @returns {object} - An object containing a success message or an error response.
   */
  delete: async (locationId) => {
    try {
      if (utils.isEmpty(locationId)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.ID_EMPTY }
        };
      }
      const result = await LocationServices.findById(locationId, false);
      const location = result.data;

      if (utils.isEmpty(location)) {
        return result;
      }
      await location.update({ status: constants.status.STATUS_DELETE });
      logger.info(constants.messages.LOCATION_DELETED);
      return { data: { message: constants.messages.LOCATION_DELETED } };
    } catch (error) {
      logger.error(errors.ERROR_IN_DELETE_LOCATION, error);
      return {
        code: constants.status.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_DELETE_LOCATION }
      };
    }
  }
};

module.exports = LocationServices;
