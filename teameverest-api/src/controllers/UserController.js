const { constants, utils, errors } = require('../utils');
const UserServices = require('../services/UserServices');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */
module.exports = {
  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Get all users
   *     tags: [Users]
   *     parameters:
   *        - in: query
   *          name: paginate
   *          required: false
   *          description: Boolean value to toggle pagination
   *        - in: query
   *          name: pageNo
   *          required: false
   *          description: To specify the page number
   *        - in: query
   *          name: pageLimit
   *          required: false
   *          description: To specify the page limit
   *        - in: query
   *          name: sortBy
   *          required: false
   *          description: To specify sort by column
   *        - in: query
   *          name: sortOrder
   *          required: false
   *          description: To specify sort order
   *        - in: query
   *          name: search
   *          required: false
   *          description: To search the records
   *     responses:
   *       '200':
   *         description: Successful response with an array of users
   */
  getUsers: async (req, res) => {
    try {
      const result = await UserServices.findAll(req.query);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_FETCHING_USER_LIST } });
    }
  },

  /**
   * @swagger
   *   /users/{id}:
   *     get:
   *       summary: Get a user by ID
   *       tags: [Users]
   *       parameters:
   *         - in: path
   *           name: id
   *           required: true
   *           description: ID of the user
   *       responses:
   *         '200':
   *           description: Successful response with the user
   *         '404':
   *           description: User not found
   */
  findById: async (req, res) => {
    try {
      const result = await UserServices.findById(req.params?.userId);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_RETRIEVING_USER } });
    }
  },

  /**
   * @swagger
   *   /users:
   *     post:
   *       summary: Create a new user
   *       tags: [Users]
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 firstname:
   *                   type: string
   *                 lastname:
   *                   type: string
   *                 email:
   *                   type: string
   *                 phoneno:
   *                   type: string
   *                 address:
   *                   type: string
   *       responses:
   *         '201':
   *           description: Successful response with the created user
   */
  createUser: async (req, res) => {
    try {
      const result = await UserServices.create(req.body);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_USER_CREATE } });
    }
  },

  /**
   * @swagger
   *   /users/{id}:
   *     put:
   *       summary: Update a user by ID
   *       tags: [Users]
   *       parameters:
   *         - in: path
   *           name: id
   *           required: true
   *           description: ID of the user
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 firstname:
   *                   type: string
   *                 lastname:
   *                   type: string
   *                 email:
   *                   type: string
   *       responses:
   *         '200':
   *           description: Successful response with the updated user
   *         '404':
   *           description: User not found
   */
  updateUser: async (req, res) => {
    try {
      const result = await UserServices.update(req.params.id, req.body);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_UPDATING_USER_DETAIL } });
    }
  },

  /**
   * @swagger
   *   /users/{id}:
   *     delete:
   *       summary: Delete a user by ID
   *       tags: [Users]
   *       parameters:
   *         - in: path
   *           name: id
   *           required: true
   *           description: ID of the user
   *       responses:
   *         '200':
   *           description: Successful response with the deleted user
   *         '404':
   *           description: User not found
   */
  deleteUser: async (req, res) => {
    try {
      const result = await UserServices.delete(req.params);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_DELETING_USER_DETAIL } });
    }
  }
};
