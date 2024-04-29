const { Op } = require('sequelize');

const { Classroom, Status } = require('../models');
const logger = require('../config/logger');
const { errors, constants, utils } = require('../utils');
const responseFields = [['uuid', 'id'], 'name'];
const classroomAssociationTables = [{
  model: Status, as: 'status', attributes: [['uuid', 'id'], 'name']
}];

const ClassroomServices = {
  /**
   * To create a new classroom
   *
   * @param {Object} data - The data to be used for creating a new classroom.
 *   @property {string} [data.corporateId] - The ID or UUID of the location where the classroom is located.
   * @returns {Object} An object containing the created classroom data and a success message.
   * @throws {Object} An object with error details if an error occurs during classroom creation.
   */
  create: async (classroomsData) => {
    try {
      const classroom = await Promise.all(classroomsData.map(async (classroomInfo) => {
        if (utils.isEmpty(classroomInfo?.name)) {
          return {
            code: constants.status.BAD_REQUEST,
            errors: { message: errors.NAME_EMPTY }
          };
        }

        const classroom = await Classroom.create(classroomInfo);
        return classroom;
      }));
      return {
        data: classroom,
        message: constants.messages.CLASSROOM_CREATED
      };
    } catch (error) {
      logger.error(errors.ERROR_IN_CLASSROOM_CREATION, error);
      return utils.handleErrors(error, errors.ERROR_IN_CLASSROOM_CREATION);
    }
  },

  /**
   * Search for classroom based on the provided classroom name.
   *
   * @param {string} data - The name to search for.
   * @returns {Object} The list of classroom matching the provided name.
   * @throws {Object} If an error occurs during the search process.
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
      const results = await Classroom.findAll({
        where: {
          name: { [Op.like]: `%${data}%` },
          status: { [Op.ne]: constants.status.STATUS_DELETE }
        }
      });
      return { data: results };
    } catch (error) {
      logger.error(errors.ERROR_IN_FETCHING_CLASSROOM, error);
      return {
        code: constants.status.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_FETCHING_CLASSROOM, error }
      };
    }
  },

  /**
   * Find a classroom by ID.
   *
   * @param {int} classroomId - The ID of the classroom to find.
   * @returns {Object} - An object containing the classroom data or an error response.
   */
  findById: async (classroomId, isCustomFields) => {
    try {
      if (utils.isEmpty(classroomId)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.ID_EMPTY }
        };
      }
      const classroom = await Classroom.findOne({
        where: {
          [Op.and]: [{
            [Op.or]: [
              { id: classroomId },
              { uuid: classroomId }
            ]
          }]
        },
        attributes: isCustomFields ? responseFields : null
      });

      if (utils.isEmpty(classroom)) {
        return {
          code: constants.status.NOT_FOUND,
          errors: { message: errors.CLASSROOM_NOT_FOUND }
        };
      }
      return { data: classroom };
    } catch (error) {
      logger.error(errors.ERROR_IN_FETCHING_CLASSROOM, error);
      return {
        code: constants.status.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_FETCHING_CLASSROOM }
      };
    }
  },

  /**
   * Fetch all classroom details excluding classrooms with a status equal to 2.
   *
   * @returns  classroom details.
   * @throws {Error} If an error occurs while fetching classrooms.
   */
  fetchAll: async (query) => {
    try {
      return utils.fetchRecords(Classroom, query, responseFields, classroomAssociationTables);
    } catch (error) {
      logger.error(errors.ERROR_IN_FETCHING_CLASSROOM, error);
      return {
        code: constants.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_FETCHING_CLASSROOM, error }
      };
    }
  },

  /**
   * Update a classroom by ID.
   *
   * @param {string} classroomId - The ID of the classroom to be updated.
   * @param {Object} data - The updated data for the classroom.
   * @returns {Object} The response indicating the success or failure of the update operation.
   * @throws {Error} If an error occurs during the update process.
   */
  update: async (classroomId, data) => {
    try {
      if (utils.isEmpty(classroomId)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.ID_EMPTY }
        };
      }

      if (!utils.isEmpty(data.corporateId)) {
        const corporate = {};
        if (corporate.data) {
          data.corporateId = corporate?.data?.id;
        }
      }
      const result = await ClassroomServices.findById(classroomId, false);
      const classroom = result.data;

      if (utils.isEmpty(classroom)) {
        return result;
      }
      await classroom.update(data);
      logger.info(constants.messages.CLASSROOM_UPDATED);
      return { data: { message: constants.messages.CLASSROOM_UPDATED } };
    } catch (error) {
      logger.error(errors.ERROR_IN_CLASSROOM_UPDATE, error);
      return utils.handleErrors(error, errors.ERROR_IN_CLASSROOM_UPDATE);
    }
  },

  /**
   * Delete a classroom by updating its status to 2 (soft delete process).
   *
   * @param {string} classroomId - The ID of the Classroom to be deleted.
   * @returns {Object} The response indicating the success or failure of the delete operation.
   * @throws {Error} If an error occurs during the soft delete process.
   */
  delete: async (classroomId) => {
    try {
      if (utils.isEmpty(classroomId)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.ID_EMPTY }
        };
      }
      const result = await ClassroomServices.findById(classroomId, false);
      const classroom = result.data;

      if (utils.isEmpty(classroom)) {
        return result;
      }
      await classroom.update({ status: constants.status.STATUS_DELETE });
      logger.info(constants.messages.CLASSROOM_DELETED);
      return { data: { message: constants.messages.CLASSROOM_DELETED } };
    } catch (error) {
      logger.error(errors.ERROR_IN_CLASSROOM_DELETE, error);
      return {
        code: constants.status.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_CLASSROOM_DELETE, error }
      };
    }
  }
};

module.exports = ClassroomServices;
