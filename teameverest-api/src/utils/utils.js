const { Op } = require('sequelize');

const constants = require('./constants');
const errors = require('./errors');
const logger = require('../config/logger');

const utils = {
  isEmpty: data => {
    return data === '' || data === null || data === undefined || typeof (data) === 'undefined';
  },
  formatResponse: (responseObj, result) => {
    const statusCode = result.code || constants.status.SUCCESS;
    delete result.code;
    return responseObj.status(statusCode).json(result);
  },
  isValidUUID: (uuid) => {
    return /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i.test(uuid);
  },
  handleErrors: (errors, errorMessage) => {
    let result = null;
    if (errors?.name === 'SequelizeValidationError') {
      const formattedErrors = {};
      errors.errors.forEach(validationError => {
        formattedErrors[validationError?.path] = validationError.message;
      });
      result = {
        code: status.BAD_REQUEST,
        errors: formattedErrors
      };
    } else {
      result = {
        code: status.SERVER_ERROR,
        errors: { message: errorMessage, error: errors }
      };
    }
    return result;
  },

  /**
  * Fetch paginated records based on query parameters.
  *
  * @param {Object} model - Sequelize model for database operations.
  * @param {Object} query - Query parameters for pagination, sorting, and filtering.
  * @param {Array} responseFields - Fields to be included in the response.
  * @returns {Object} - Paginated records along with total count.
  */
  fetchRecords: async (model, query, responseFields, associations) => {
    try {
      if (query?.paginate === constants.TRUE) {
        const pageNo = parseInt(query.pageNo, 10) || constants.DEFAULT_PAGE_NO;
        const limit = parseInt(query.pageLimit, 10) || constants.DEFAULT_PAGE_LIMIT;
        const order = [[query.sortBy || constants.DEFAULT_SORT_FIELD, query.sortOrder || constants.DEFAULT_SORT]];
        const queries = {
          order,
          limit,
          paranoid: true,
          attributes: responseFields,
          offset: (pageNo * limit) - limit
        };
        if (associations) {
          queries.include = associations;
        }
        if (!utils.isEmpty(query.search)) {
          queries.where = {
            email: {
              [Op.like]: `%${query.search}%`
            }
          };
        }
        const results = await model.findAndCountAll(queries);
        return { data: results };
      } else {
        const queries = {
          paranoid: true,
          attributes: responseFields
        };
        if (associations) {
          queries.include = associations;
        }
        const results = await model.findAll(queries);
        return { data: results };
      }
    } catch (error) {
      logger.error(errors.ERROR_IN_FETCHING_RECORDS, error);
      return { code: constants.SERVER_ERROR, message: errors.ERROR_IN_FETCHING_RECORDS };
    }
  }
};

module.exports = utils;
