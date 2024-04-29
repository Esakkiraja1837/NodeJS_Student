const { Op } = require('sequelize');

const { Role } = require('../models');
const logger = require('../config/logger');
const { errors, constants, utils } = require('../utils');
const responseFields = [['uuid', 'id'], 'name'];

const RoleServices = {
  /**
   * Create a new role using RoleService.
   *
   * Checks if a location with a similar name already exists.
   * @param {Object} roleData - The role data to be used for creating a new role.
   * @returns {Object} An object containing the created role data and a success message.
   * @throws {Object} An object with error details if an error occurs during role creation.
   */
  create: async (roleData) => {
    try {
      if (utils.isEmpty(roleData?.name)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.NAME_EMPTY }
        };
      }
      const existingLocations = await Role.findOne({
        where: {
          name: { [Op.like]: `%${roleData.name}%` }
        }
      });

      if (existingLocations) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.NAME_ALREADY_EXISTS }
        };
      }
      const createdRole = await Role.create(roleData);
      return {
        data: createdRole,
        message: constants.messages.SUCCESSFUL_ROLE_CREATED
      };
    } catch (error) {
      logger.error(errors.ERROR_IN_ROLE_CREATION, error);
      return utils.handleErrors(error, errors.ERROR_IN_ROLE_CREATION);
    }
  },

  /**
   * Get role details excluding roles with status equal to 2.
   *
   * @returns  role details.
   * @throws {Error} If an error occurs while fetching roles.
   */
  getRoles: async () => {
    try {
      const roles = await Role.findAll({
        attributes: responseFields
      });
      return { data: roles };
    } catch (error) {
      logger.error(errors.ERROR_IN_FETCHING_ROLE_LIST, error);
      return {
        code: constants.status.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_FETCHING_ROLE_LIST, error }
      };
    }
  },

  /**
   * Find a role by ID.
   *
   * @param {int} roleId - The ID of the role to find.
   * @returns {Object} - An object containing the role data or an error response.
   */
  findById: async (roleId, isCustomFields) => {
    try {
      if (utils.isEmpty(roleId)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.ID_EMPTY }
        };
      }
      const query = {};

      if (utils.isValidUUID(roleId)) {
        query.uuid = roleId;
      } else {
        query.id = roleId;
      }

      const role = await Role.findOne({
        where: query,
        attributes: isCustomFields ? responseFields : null
      });
      if (utils.isEmpty(role)) {
        return {
          code: constants.status.NOT_FOUND,
          errors: { message: errors.ROLE_NOT_FOUND }
        };
      }
      return { data: role };
    } catch (error) {
      logger.error(errors.ERROR_IN_FETCHING_ROLE, error);
      return {
        code: constants.status.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_FETCHING_ROLE }
      };
    }
  },

  /**
   * Search for roles based on the provided role name.
   *
   * @param {string} name - The name to search for.
   * @returns {Object} The list of roles matching the provided name.
   * @throws {Object} If an error occurs during the search process.
   */
  search: async (name) => {
    try {
      if (utils.isEmpty(name)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: {
            message: errors.NAME_EMPTY
          }
        };
      }
      const role = await Role.findAll({
        where: {
          name: { [Op.like]: `%${name}%` }
        },
        attributes: responseFields
      });
      return { data: role };
    } catch (error) {
      logger.error(errors.ERROR_IN_FETCHING_ROLE, error);
      return {
        code: constants.status.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_FETCHING_ROLE, error }
      };
    }
  },

  /**
   * Delete a role by updating its status to 2.
   *
   * @param {Object} req - The HTTP request object.
   * @returns {Object} The response indicating the success or failure of the delete operation.
   * @throws {Error} If an error occurs during the soft delete process.
   */
  delete: async (roleId) => {
    try {
      if (utils.isEmpty(roleId)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.ID_EMPTY }
        };
      }
      const result = await RoleServices.findById(roleId, false);
      const role = result.data;

      if (utils.isEmpty(role)) {
        return result;
      }
      await role.update({ status: constants.status.STATUS_DELETE });
      logger.info(constants.messages.SUCCESSFUL_ROLE_DELETED);
      return { data: { message: constants.messages.SUCCESSFUL_ROLE_DELETED } };
    } catch (error) {
      logger.error(errors.ERROR_IN_DELETE_ROLE, error);
      return {
        code: constants.status.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_DELETE_ROLE, error }
      };
    }
  }

};

module.exports = RoleServices;
