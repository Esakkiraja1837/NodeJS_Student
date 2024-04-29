const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
// custom modules
const config = process.env;
const logger = require('../config/logger');
const { errors, utils, constants } = require('../utils');
const { User, Status, Role, Location } = require('../models');

/**
 * To generate the JWT token on successful user login
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const tokenGenerator = async (userEmail) => {
  const token = await jwt.sign({
    key: userEmail
  }, config.JWT_AUTH_KEY, {
    expiresIn: config.SESSION_TTL
  });
  return token;
};

const AuthServices = {
  authenticate: async (loginData) => {
    try {
      const currentUser = await User.findOne({
        paranoid: false,
        hasJoin: true,
        where: {
          email: loginData.email
        },
        include: [{
          model: Status,
          as: 'status',
          attributes: [['uuid', 'id'], 'name']
        }, {
          model: Role,
          as: 'role',
          attributes: [['uuid', 'id'], 'name']
        }, {
          model: Location,
          as: 'location',
          attributes: [['uuid', 'id'], 'name']
        }]
      });
      const userStatus = currentUser?.dataValues?.status?.dataValues;
      if (utils.isEmpty(currentUser)) {
        return { errors: { message: errors.USER_NOT_FOUND }, code: constants.status.NOT_FOUND };
      }
      if (userStatus.name === constants.INACTIVE) {
        return { errors: { message: errors.INACTIVE_USER }, code: constants.status.BAD_REQUEST };
      }
      const isValid = await AuthServices.validatePassword(loginData.password, currentUser.password);
      if (!isValid) {
        return { errors: { message: errors.INVALID_CREDENTIALS }, code: constants.status.UNAUTHORIZED };
      }
      const authToken = await tokenGenerator(loginData.email);
      return {
        data: {
          token: authToken,
          user: {
            email: currentUser.dataValues.email,
            id: currentUser.dataValues.uuid,
            phoneNo: currentUser.dataValues.phoneNo,
            firstName: currentUser.dataValues.firstName,
            lastName: currentUser.dataValues.lastName,
            status: userStatus,
            role: currentUser.dataValues.role,
            location: currentUser.dataValues.location
          } || {},
          message: constants.messages.SUCCESSFUL_AUTHENTICATION
        }
      };
    } catch (error) {
      logger.error(errors.ERROR_IN_AUTH_VALIDATION, error);
      return { code: constants.SERVER_ERROR, errors: { message: errors.ERROR_IN_AUTH_VALIDATION } };
    }
  },
  invalidateSession: async () => {
    // TODO
  },
  encryptPassword: async (password) => {
    let encryptedPassword = password || '';
    if (!utils.isEmpty(password)) {
      const encryptionIteration = parseInt(constants.status.PWD_ENCRYPTION_ITERATION, 10) || 10;
      const passwordHash = await bcrypt.hash(password, encryptionIteration);
      encryptedPassword = passwordHash;
    }
    return encryptedPassword;
  },
  validatePassword: async (userPassword, passwordHash) => {
    return await bcrypt.compare(userPassword, passwordHash);
  },
  generateAuthCode: () => {
    try {
      return crypto.randomBytes(16).toString('hex');
    } catch (error) {
      logger.error(errors.ERROR_IN_AUTH_CODE_CREATION, error);
      return { code: constants.SERVER_ERROR, errors: { message: errors.ERROR_IN_AUTH_CODE_CREATION } };
    }
  }
};

module.exports = AuthServices;
