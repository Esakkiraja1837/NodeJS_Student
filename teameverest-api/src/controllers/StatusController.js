const StatusServices = require('../services/StatusServices');
const { constants, errors, utils } = require('../utils');

/**
 *  @swagger
 *  tags:
 *    name: Status
 *    description: API for managing Status
 */
module.exports = {
  /**
 * @swagger
 * /status:
 *   post:
 *     summary: Create a new status
 *     tags: [Status]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful response with an array of status
 */
  createStatus: async (req, res) => {
    try {
      const result = await StatusServices.create(req.body);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_STATUS_CREATION, error } });
    }
  },

  /**
   * @swagger
   * path:
   * /status:
   *    get:
   *      summary: Get all status
   *      tags: [Status]
   *      responses:
   *        '200':
   *           description: Successful response with an array of status
   *        '404':
   *           description: Status not found
   */
  fetchAll: async (req, res) => {
    try {
      const result = await StatusServices.fetchAll();
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_FETCHING_STATUS_LIST, error } });
    }
  }
};
