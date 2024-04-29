const { SecureCode } = require('../models');
const logger = require('../config/logger');
const { errors, utils, constants } = require('../utils');

const SecureCodeServices = {
  create: async (data) => {
    try {
      if (utils.isEmpty(data.userId)) {
        return {
          code: constants.status.BAD_REQUEST,
          message: errors.USER_EMPTY
        };
      }
      if (utils.isEmpty(data.activationCode)) {
        return {
          code: constants.status.BAD_REQUEST,
          message: errors.ACTIVATION_CODE_EMPTY
        };
      }
      return await SecureCode.create(data);
    } catch (error) {
      logger.error(errors.ERROR_IN_SECURE_CODE_CREATION, error);
      return { code: errors.SERVER_ERROR, errors: { message: errors.ERROR_IN_SECURE_CODE_CREATION } };
    }
  },
  fetchCode: async (param, isUserId) => {
    try {
      const query = {
        [isUserId ? 'userId' : 'activationCode']: param
      };
      const code = await SecureCode.findOne({
        where: query,
        raw: true
      });
      if (utils.isEmpty(code)) {
        return {
          code: constants.status.NOT_FOUND,
          message: errors.NO_PASSCODE_FOUND_FOR_USER
        };
      }
      return { data: code };
    } catch (error) {
      logger.error(errors.ERROR_IN_FETCHING_SECURE_CODE, error);
      return { code: constants.SERVER_ERROR, errors: { message: errors.ERROR_IN_FETCHING_SECURE_CODE } };
    }
  },
  delete: async (param) => {
    try {
      await SecureCode.destroy({ where: { id: param } });
      return { message: constants.messages.SECURE_CODE_DELETED };
    } catch (error) {
      logger.error(errors.ERROR_IN_DELETING_SECURE_CODE, error);
      return { code: constants.SERVER_ERROR, errors: { message: errors.ERROR_IN_DELETING_SECURE_CODE } };
    }
  }
};

module.exports = SecureCodeServices;
