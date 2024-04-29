const { User, Role, Location, Status } = require('../models');
const logger = require('../config/logger');
const AuthServices = require('./AuthServices');
const RoleServices = require('./RoleServices');
const EmailServices = require('./EmailServices');
const LocationServices = require('./LocationServices');
const { errors, utils, constants } = require('../utils');
const SecureCodeServices = require('./SecureCodeServices');
const StatusServices = require('./StatusServices');
const responseFields = [['uuid', 'id'], 'firstName', 'lastName', 'phoneNo', 'email'];
const userAssociationTables = [{
  model: Role, as: 'role', attributes: [['uuid', 'id'], 'name']
}, {
  model: Status, as: 'status', attributes: [['uuid', 'id'], 'name']
}, {
  model: Location, as: 'location', attributes: [['uuid', 'id'], 'name', 'address', 'pincode']
}];

const UserServices = {
  /***
   * To retrieve all users
   */
  findAll: async (query) => {
    try {
      return utils.fetchRecords(User, query, responseFields, userAssociationTables);
    } catch (error) {
      logger.error(errors.ERROR_IN_FETCHING_USER_LIST, error);
      return { code: constants.SERVER_ERROR, message: errors.ERROR_IN_FETCHING_USER_LIST };
    }
  },

  /**
   * To retrieve user by primary key value
   * @returns {}
   */
  findById: async (userId, isCustomFields) => {
    try {
      if (utils.isEmpty(userId)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: { message: errors.ID_EMPTY }
        };
      }

      const query = {};
      if (utils.isValidUUID(userId)) {
        query.uuid = userId;
      } else {
        query.id = userId;
      }
      const user = await User.findOne({
        where: query,
        raw: !!isCustomFields,
        include: userAssociationTables,
        attributes: isCustomFields ? responseFields : null
      });
      if (utils.isEmpty(user)) {
        return {
          code: constants.status.NOT_FOUND,
          errors: { message: errors.USER_NOT_FOUND }
        };
      }
      return { data: user };
    } catch (error) {
      logger.error(errors.ERROR_IN_FETCHING_USER_DETAIL);
      return {
        code: constants.status.SERVER_ERROR,
        errors: { message: errors.ERROR_IN_FETCHING_USER_DETAIL }
      };
    }
  },

  /**
   * To retrieve user by primary key value
   * @returns {}
   */
  findByEmail: async (email) => {
    try {
      const user = await User.findOne({
        attributes: responseFields,
        where: { email },
        raw: true
      });
      return { data: user };
    } catch (error) {
      logger.error(errors.ERROR_IN_FETCHING_USER_BY_EMAIL, error);
      return { code: constants.SERVER_ERROR, errors: { message: errors.ERROR_IN_FETCHING_USER_BY_EMAIL } };
    }
  },

  /**
   * Setup password for registered user
   */
  setupPassword: async (data) => {
    try {
      if (utils.isEmpty(data.authCode)) {
        return {
          code: constants.status.BAD_REQUEST,
          message: errors.ACTIVATION_CODE_EMPTY
        };
      }
      if (utils.isEmpty(data.password)) {
        return {
          code: constants.status.BAD_REQUEST,
          message: errors.PASSWORD_EMPTY
        };
      }
      const secureCodeRes = await SecureCodeServices.fetchCode(data.authCode);
      if (secureCodeRes.code) {
        return secureCodeRes;
      }
      const userRes = await UserServices.findById(secureCodeRes.data.user, true);
      if (userRes.code) {
        return userRes;
      }
      await User.update({
        password: await AuthServices.encryptPassword(data.password),
        status: constants.status.STATUS_ACTIVE
      }, {
        where: { uuid: userRes.data.id }
      });
      await SecureCodeServices.delete(secureCodeRes.data.id);
      return { message: constants.messages.PASSWORD_UPDATED };
    } catch (error) {
      logger.error(errors.ERROR_IN_PASSWORD_SETUP, error);
      return { code: constants.SERVER_ERROR, errors: { message: errors.ERROR_IN_PASSWORD_SETUP } };
    }
  },

  /**
   * Sends the password reset link
   * @param {*} data
   * @returns
   */
  sendPasswordResetLink: async (data) => {
    try {
      if (utils.isEmpty(data.email)) {
        return {
          errors: {
            message: errors.EMAIL_EMPTY
          },
          code: constants.status.BAD_REQUEST
        };
      }
      let existingUserRes = await UserServices.findByEmail(data.email);
      if (existingUserRes.code) {
        return existingUserRes;
      } else if (utils.isEmpty(existingUserRes.data)) {
        logger.error(errors.USER_NOT_FOUND);
        return {
          code: constants.status.BAD_REQUEST,
          errors: {
            message: errors.USER_NOT_FOUND
          }
        };
      }
      let activationCode = null;
      existingUserRes = existingUserRes.data;
      const secureCodeResult = await SecureCodeServices.fetchCode(existingUserRes.id, true);
      if (secureCodeResult.code) {
        return secureCodeResult;
      }
      let isCodeAlreadyExist = false;
      if (!utils.isEmpty(secureCodeResult?.data?.activationCode)) {
        activationCode = secureCodeResult.data.activationCode;
        isCodeAlreadyExist = true;
      } else {
        activationCode = await AuthServices.generateAuthCode();
      }
      if (!activationCode?.code && !isCodeAlreadyExist) {
        await SecureCodeServices.create({
          activationCode,
          user: existingUserRes.id
        });
      }
      const result = await EmailServices.sendMail({
        ...existingUserRes,
        activationCode,
        templateName: 'forgot_password'
      });
      if (result?.code) {
        return result;
      }
      logger.info(constants.messages.PASSWORD_RESET_LINK_SENT);
      return { message: constants.messages.PASSWORD_RESET_LINK_SENT };
    } catch (error) {
      logger.error(errors.ERROR_IN_PASSWORD_SETUP, error);
      return { code: constants.SERVER_ERROR, errors: { message: errors.ERROR_IN_PASSWORD_SETUP } };
    }
  },
  /**
   * To create new user
   * @param {*} userData
   * @returns
   */
  create: async (userData) => {
    try {
      const existingUser = await UserServices.findByEmail(userData.email);
      if (!utils.isEmpty(existingUser?.data)) {
        return {
          code: constants.status.BAD_REQUEST,
          errors: {
            message: errors.EMAIL_ALREADY_EXIST
          }
        };
      }
      if (!utils.isEmpty(userData?.password)) {
        userData.password = await AuthServices.encryptPassword(userData.password);
      }
      if (userData.locationId) {
        const locationResult = await LocationServices.findById(userData.locationId);
        if (locationResult.code) {
          return locationResult;
        }
        userData.locationId = locationResult.data.id;
      }
      if (userData.roleId) {
        const roleResult = await RoleServices.findById(userData.roleId);
        if (roleResult.code) {
          return roleResult;
        }
        userData.roleId = roleResult.data.id;
      }
      const inActiveStatus = await StatusServices.fetchByName(constants.INACTIVE);
      if (inActiveStatus.code) {
        return inActiveStatus;
      }
      userData.statusId = inActiveStatus.data.id;
      let user = await User.create(userData);
      user = user.dataValues;
      logger.info(constants.messages.USER_CREATED);
      const activationCode = await AuthServices.generateAuthCode();
      if (!activationCode?.code) {
        await SecureCodeServices.create({
          userId: user.id,
          activationCode
        });
      }
      const result = await EmailServices.sendMail({
        ...user,
        activationCode,
        templateName: 'setup_password'
      });
      if (result?.code) {
        return result;
      }
      logger.info(constants.messages.USER_ACTIVATION_EMAIL_SENT);
      delete user.id;
      user.id = user.uuid;
      delete user.uuid;
      delete user.password;
      delete user.lastlogin;
      delete user.activationCode;
      return { data: user, message: constants.messages.USER_CREATED };
    } catch (error) {
      logger.error(errors.ERROR_IN_USER_CREATE, error);
      return utils.handleErrors(error, errors.ERROR_IN_USER_CREATE);
    }
  }
};

module.exports = UserServices;
