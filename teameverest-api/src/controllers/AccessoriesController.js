const AccessoriesServices = require('../services/AccessoriesServices');
const { constants, errors, utils } = require('../utils');

/**
 * @swagger
 * tags:
 *   name: Accessories
 *   description: API for managing Accessories
 */
module.exports = {

  /**
   * @swagger
   * /accessories:
   *   post:
   *     summary: Create a new accessories
   *     tags: [Accessories]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               status:
   *                 type: integer
   *     responses:
   *       '200':
   *         description: Successful response with an array of accessories
   */
  createAccessory: async (req, res) => {
    try {
      const result = await AccessoriesServices.create(req.body);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_ACCESSORY_CREATION } });
    }
  },

  /**
   * @swagger
   * /accessories/search:
   *   get:
   *     summary: Get all accessories by name
   *     tags: [Accessories]
   *     parameters:
   *       - in: query
   *         name: name
   *         schema:
   *           type: string
   *         description: The name to search for accessories
   *     responses:
   *       '200':
   *         description: Successful response with an array of accessories
   *       '404':
   *         description: Accessories not found
   */
  searchAccessories: async (req, res) => {
    try {
      const result = await AccessoriesServices.search(req?.query?.name);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_FETCHING_ACCESSORY } });
    }
  },

  /**
   * @swagger
   * paths:
   *   /accessories/{id}:
   *     get:
   *       summary: Get accessories by ID
   *       tags: [Accessories]
   *       parameters:
   *         - in: path
   *           name: id
   *           schema:
   *             type: string
   *           required: true
   *           description: The ID of the accessories to fetch
   *       responses:
   *         '200':
   *           description: Successful response with an array of accessories or a specific accessory
   *         '404':
   *           description: Accessories not found
   */
  findById: async (req, res) => {
    try {
      const result = await AccessoriesServices.findById(req?.params?.id, true);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_FETCHING_ACCESSORY } });
    }
  },

  /**
   * @swagger
   * path:
   * /accessories:
   *    get:
   *      summary: Get all accessories
   *      tags: [Accessories]
   *      parameters:
   *       - in: query
   *         name: paginate
   *         required: false
   *         description: Boolean value to toggle pagination
   *       - in: query
   *         name: pageNo
   *         required: false
   *         description: To specify the page number
   *       - in: query
   *         name: pageLimit
   *         required: false
   *         description: To specify the page limit
   *       - in: query
   *         name: sortBy
   *         required: false
   *         description: To specify sort by column
   *       - in: query
   *         name: sortOrder
   *         required: false
   *         description: To specify sort order
   *       - in: query
   *         name: search
   *         required: false
   *         description: To search the records
   *      responses:
   *        '200':
   *           description: Successful response with an array of accessories
   *        '404':
   *           description: Accessories not found
   */
  fetchAll: async (req, res) => {
    try {
      const result = await AccessoriesServices.fetchAll(req.query);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_FETCHING_ACCESSORIES_LIST } });
    }
  },

  /**
 * @swagger
 * path:
 * /accessories/{id}:
 *   put:
 *     summary: Update a accessories by ID
 *     tags: [Accessories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the accessories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Successful response with the updated accessories
 *       '404':
   *        description: Accessories not found
 */
  updateAccessory: async (req, res) => {
    try {
      const result = await AccessoriesServices.update(req?.params?.id, req.body);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_UPDATE_ACCESSORY } });
    }
  },

  /**
 * @swagger
 *   /accessories/{id}:
 *     delete:
 *       summary: Delete a accessories by ID
 *       tags: [Accessories]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID of the accessories
 *       responses:
 *         '200':
 *           description: Successful response with the deleted accessories
 *         '404':
 *           description: Accessories not found
 */
  deleteAccessory: async (req, res) => {
    try {
      const result = await AccessoriesServices.delete(req?.params?.id);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_DELETE_ACCESSORY } });
    }
  }
};
