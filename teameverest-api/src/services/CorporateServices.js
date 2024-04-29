const { Op } = require('sequelize');

const { Status, Corporate, Classroom } = require('../models');
const logger = require('../config/logger');
const { errors, constants, utils } = require('../utils');
const ClassroomServices = require('./ClassroomServices');
const LocationServices = require('./LocationServices');
const responseFields = ['id', 'name', 'email', 'contactNo', 'capacity'];

const corporateAssociationTable = [
  { model: Classroom, as: 'classroom', attributes: [['uuid', 'id'], 'name', 'capacity'] },
  { model: Status, as: 'status', attributes: [['uuid', 'id'], 'name'] }
];

const CorporateService = {
  /**
 * Create a new Corporate with associated Classrooms.
 *
 * @param {Object} data - Corporate and Classroom data.
 * @returns {Object} - Result object containing created Corporate and Classrooms.
 */
  create: async (data) => {
    try {
      if (utils.isEmpty(data?.name)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.NAME_EMPTY }
        };
      }
      if (!utils.isEmpty(data.locationId)) {
        const location = await LocationServices.findById(data.locationId);
        if (location.data) {
          data.locationId = location?.data?.id;
        }
      }
      const corporate = await Corporate.create(data);

      if (!utils.isEmpty(corporate?.dataValues?.id)) {
        const classroomsData = data.classroom.map(classroomInfo => ({
          name: classroomInfo.name,
          capacity: classroomInfo.capacity,
          corporateId: corporate?.dataValues?.id
        }));

        const createdClassrooms = await ClassroomServices.create(classroomsData);
        corporate.dataValues.classrooms = createdClassrooms;
        return {
          data: corporate,
          message: constants.messages.CORPORATE_CREATED
        };
      }
      return {
        data: corporate,
        message: constants.messages.CORPORATE_CREATED
      };
    } catch (error) {
      logger.error(errors.ERROR_IN_CORPORATE_CREATION, error);
      return utils.handleErrors(error, errors.ERROR_IN_CORPORATE_CREATION);
    }
  },

  /**
   * Search for Corporate by name with associated Classrooms.
   *
   * @param {string} data - The name to search for within Corporate records.
   * @returns {Object} - Result object containing Corporate and associated Classrooms.
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
      const results = await Corporate.findAll({
        where: {
          name: { [Op.like]: `%${data}%` }
        },
        include: [
          {
            model: Classroom,
            as: 'classroom',
            attributes: ['name', 'capacity']
          }
        ]
      });
      return { data: results };
    } catch (error) {
      logger.error(errors.ERROR_IN_FETCHING_CORPORATE, error);
      return {
        code: constants.status.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_FETCHING_CORPORATE, error }
      };
    }
  },

  /**
   * Find a Corporate by ID with optional custom fields and associated Classrooms.
   *
   * @param {string} corporateId - The ID or UUID of the Corporate to find.
   * @param {boolean} isCustomFields - Whether to include custom fields in the result.
   * @returns {Object} - Result object containing the found Corporate and associated Classrooms.
   */
  findById: async (corporateId, isCustomFields) => {
    try {
      if (utils.isEmpty(corporateId)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.ID_EMPTY }
        };
      }
      const corporate = await Corporate.findOne({
        where: {
          [Op.or]: [
            { id: corporateId },
            { uuid: corporateId }
          ]
        },
        attributes: isCustomFields ? responseFields : null,
        include: [
          {
            model: Classroom,
            as: 'classroom',
            attributes: ['name', 'capacity']
          }
        ]
      });

      if (utils.isEmpty(corporate)) {
        return {
          code: constants.status.NOT_FOUND,
          errors: { message: errors.CORPORATE_NOT_FOUND }
        };
      }
      return { data: corporate };
    } catch (error) {
      logger.error(errors.ERROR_IN_FETCHING_CORPORATE, error);
      return {
        code: constants.status.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_FETCHING_CORPORATE }
      };
    }
  },

  /**
   * Fetch a list of Corporate records with optional filtering and pagination.
   *
   * @param {Object} query - Query parameters for filtering and pagination.
   * @param {string[]} query.responseFields - Fields to include in the response.
   * @param {Object[]} query.corporateAssociationTable - Association details for eager loading.
   * @returns {Object} - Result object containing the fetched Corporate records.
   */
  fetchAll: async (query) => {
    try {
      return utils.fetchRecords(Corporate, query, responseFields, corporateAssociationTable);
    } catch (error) {
      logger.error(errors.ERROR_IN_FETCHING_CORPORATE_LIST, error);
      return {
        code: constants.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_FETCHING_CORPORATE_LIST, error }
      };
    }
  },

  /**
   * Update a Corporate.
   *
   * @param {number} corporateId - The ID of the Corporate to update.
   * @param {Object} data - The updated data for the Corporate and associated Classrooms.
   * @returns {Object} - Result object indicating the success or failure of the update.
   */
  update: async (corporateId, data) => {
    try {
      const editList = data.classroom.filter(item => !utils.isEmpty(item.id)).map(value => value);
      const createList = data.classroom.filter(item => utils.isEmpty(item.id)).map(value => value);

      if (!utils.isEmpty(editList)) {
        await Promise.all(editList.map(async classroomInfo => {
          await Classroom.update({
            name: classroomInfo.name,
            capacity: classroomInfo.capacity
          }, {
            where: { id: classroomInfo.id }
          });
        }));
      }
      if (!utils.isEmpty(createList)) {
        const classroomsData = createList.map(classroomInfo => ({
          name: classroomInfo.name,
          capacity: classroomInfo.capacity,
          corporateId: corporateId
        }));

        await ClassroomServices.create(classroomsData);
      }

      if (utils.isEmpty(corporateId)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.ID_EMPTY }
        };
      }

      if (!utils.isEmpty(data.locationId)) {
        const location = await LocationServices.findById(data.locationId);
        if (location.data) {
          data.locationId = location?.data?.id;
        }
      }

      const result = await CorporateService.findById(corporateId, false);
      const corporate = result.data;

      if (utils.isEmpty(corporate)) {
        return result;
      }
      await corporate.update(data);
      logger.info(constants.messages.CORPORATE_UPDATED);
      return { data: { message: constants.messages.CORPORATE_UPDATED } };
    } catch (error) {
      logger.error(errors.ERROR_IN_UPDATE_CORPORATE, error);
      return utils.handleErrors(error, errors.ERROR_IN_UPDATE_CORPORATE);
    }
  },

  /**
   * Delete a Corporate and associated records.
   *
   * @param {number} corporateId - The ID of the Corporate to delete.
   * @returns {Object} - Result object indicating success or failure.
   */
  delete: async (corporateId) => {
    try {
      if (utils.isEmpty(corporateId)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.ID_EMPTY }
        };
      }
      const result = await CorporateService.findById(corporateId, false);
      const corporate = result.data;

      if (utils.isEmpty(corporate)) {
        return result;
      }

      await Corporate.destroy({ where: { id: corporate.id } });
      logger.info(constants.messages.CORPORATE_DELETED);
      return { data: { message: constants.messages.CORPORATE_DELETED } };
    } catch (error) {
      logger.error(errors.ERROR_IN_DELETE_CORPORATE, error);
      return {
        code: constants.status.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_DELETE_CORPORATE, error }
      };
    }
  }

};

module.exports = CorporateService;
