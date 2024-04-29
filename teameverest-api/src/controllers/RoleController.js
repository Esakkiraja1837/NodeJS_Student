const RoleServices = require('../services/RoleServices');
const { constants, errors, utils } = require('../utils');

/**
 *  @swagger
 *  tags:
 *    name: Roles
 *    description: API for managing Roles
 */
module.exports = {
  /**
   *  /roles:
   *    post:
   *      summary: Create a new role
   *      tags: [Roles]
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *            properties:
   *              name:
   *                type: string
   *              createdAt:
   *                type: date
   *              status:
   *                type: int
   *              uuid:
   *                type: int
   *              updatedAt:
   *                type: date
   *       responses:
   *         '201':
   *           description: Successful response with the created Role
   */
  createRole: async (req, res) => {
    try {
      const result = await RoleServices.create(req.body);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_ROLE_CREATION, error } });
    }
  },

  /**
   * @swagger
   * path:
   * /roles:
   *    get:
   *      summary: Get all Roles
   *      tags: [Roles]
   *      responses:
   *        '200':
   *           description: Successful response with an array of roles
   *        '404':
   *           description: Role not found
   */
  getRoles: async (req, res) => {
    try {
      const result = await RoleServices.getRoles();
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_FETCHING_ROLE_LIST, error } });
    }
  },

  /**
   * @swagger
   * /roles/search:
   *    get:
   *      summary: Get all roles by name
   *      tags: [Roles]
   *      parameters:
   *        - in: query
   *          name: name
   *          schema:
   *            type: string
   *          description: The name to search for roles
   *      responses:
   *        '200':
   *           description: Successful response with an array of roles
   *        '404':
   *           description: Role not found
   */
  searchRole: async (req, res) => {
    try {
      const result = await RoleServices.search(req?.query?.name);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.SERVER_ERROR, error } });
    }
  },

  /**
 * @swagger
 * path:
 * /roles/{id}:
 *    get:
 *      summary: Get role by ID
 *      tags: [Roles]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          description: The ID of the role to fetch
 *      responses:
 *        '200':
 *          description: Successful response with the requested role
 *        '404':
 *           description: Role not found
 */
  findById: async (req, res) => {
    try {
      const result = await RoleServices.findById(req?.params?.id, false);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_FETCHING_ROLE, error } });
    }
  },

  /**
  *   /roles/{id}:
  *     delete:
  *       summary: Delete a role by ID
  *       tags: [Roles]
  *       parameters:
  *         - in: path
  *           name: id
  *           required: true
  *           description: ID of the role
  *       responses:
  *         '200':
  *           description: Successful response with the deleted Role
  *        '404':
  *           description: Role not found
  */
  deleteRole: async (req, res) => {
    try {
      const result = await RoleServices.delete(req?.params?.id);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_DELETE_ROLE, error } });
    }
  }
};
