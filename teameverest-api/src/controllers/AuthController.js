const { constants, utils, errors } = require('../utils');
const AuthServices = require('../services/AuthServices');
const UserServices = require('../services/UserServices');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for managing authentication
 */
module.exports = {
  /**
   * @swagger
   *   /login:
   *     post:
   *       summary: Validates the user given credentials
   *       tags: [Authentication]
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 email:
   *                   type: string
   *                 password:
   *                   type: string
   *       responses:
   *         '201':
   *           description: Successful response with the login session
   */
  login: async (req, res) => {
    try {
      const results = await AuthServices.authenticate(req.body);
      if (results.token) {
        req.header.authorization = `Bearer ${results.token}`;
      }
      return utils.formatResponse(res, results);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ message: errors.ERROR_IN_AUTH_VALIDATION });
    }
  },

  /**
   * @swagger
   *   /setup-password:
   *     post:
   *       summary: Setup user account password
   *       tags: [Authentication]
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 password:
   *                   type: string
   *                 authCode:
   *                   type: string
   *       responses:
   *         '201':
   *           description: Successful response with message
   */
  setupPassword: async (req, res) => {
    try {
      const result = await UserServices.setupPassword(req.body);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_SETUP_USER_PASSWORD } });
    }
  },

  /**
   * @swagger
   *   /forgot-password:
   *     post:
   *       summary: Sends password setup email link
   *       tags: [Authentication]
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 email:
   *                   type: string
   *       responses:
   *         '201':
   *           description: Successful response with message
   */
  forgotPassword: async (req, res) => {
    try {
      const result = await UserServices.sendPasswordResetLink(req.body);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_SETUP_USER_PASSWORD } });
    }
  },

  /**
   * @swagger
   * /logout:
   *   post:
   *     summary: Invalidates the user session
   *     tags: [Authentication]
   *     responses:
   *       '200':
   *         description: Successful response with message
   */
  logout: async (req, res) => {
    try {
      return res.json(await AuthServices.invalidateSession());
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ message: errors.ERROR_IN_AUTH_TOKEN_INVALIDATION });
    }
  }
};
