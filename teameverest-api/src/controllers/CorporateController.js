const CorporateServices = require('../services/CorporateServices');
const { constants, errors, utils } = require('../utils');

/**
 *  @swagger
 *  tags:
 *    name: Corporate
 *    description: API for managing Corporate
 */

module.exports = {
/**
 * @swagger
 * /corporate:
 *   post:
 *     summary: Create a new corporate
 *     tags: [Corporate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               contactNo:
 *                 type: string
 *               email:
 *                 type: string
 *               street:
 *                 type: string
 *               landmark:
 *                 type: string
 *               city:
 *                 type: string
 *               pincode:
 *                 type: integer
 *               locationId:
 *                 type: integer
 *               capacity:
 *                 type: integer
 *               status:
 *                 type: integer
 *               classroom:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     capacity:
 *                       type: integer
 *                     accessoryId:
 *                       type: string
 *     responses:
 *       '200':
 *         description: Successful response with an array of corporate
 */

  createCorporate: async (req, res) => {
    try {
      const result = await CorporateServices.create(req.body);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_CORPORATE_CREATION } });
    }
  },

  /**
   * @swagger
   * /corporate/search:
   *    get:
   *      summary: Get all corporate by name
   *      tags: [Corporate]
   *      parameters:
   *        - in: query
   *          name: name
   *          schema:
   *            type: string
   *          description: The name to search for corporate
   *      responses:
   *        '200':
   *          description: Successful response with an array of corporate
   *        '404':
   *          description: corporate not found
   */
  searchCorporate: async (req, res) => {
    try {
      const result = await CorporateServices.search(req?.query?.name);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_FETCHING_CORPORATE, error } });
    }
  },

  /**
  * @swagger
  * path:
  * /corporate/{id}:
  *    get:
  *      summary: Get corporate by ID
  *      tags: [Corporate]
  *      parameters:
  *        - in: path
  *          name: id
  *          schema:
  *            type: string
  *          description: The ID of the corporate to fetch
  *      responses:
  *        '200':
  *          description: Successful response with the requested corporate
  *        '404':
  *         description: Corporate not found
  */
  findById: async (req, res) => {
    try {
      const result = await CorporateServices.findById(req?.params?.id, true);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_FETCHING_CORPORATE, error } });
    }
  },

  /**
   * @swagger
   * path:
   * /corporate:
   *    get:
   *      summary: Get all corporate
   *      tags: [Corporate]
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
   *           description: Successful response with an array of corporate
   */
  fetchAll: async (req, res) => {
    try {
      const result = await CorporateServices.fetchAll(req.query);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_FETCHING_CORPORATE_LIST, error } });
    }
  },

  /**
* @swagger
* /corporate/{id}:
*   put:
*     summary: Update a corporate by ID
*     tags: [Corporate]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: ID of the corporate
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*               contactNo:
*                 type: string
*               email:
*                 type: string
*               street:
*                 type: string
*               landmark:
*                 type: string
*               city:
*                 type: string
*               pincode:
*                 type: integer
*               locationId:
*                 type: integer
*               capacity:
*                 type: integer
*               status:
*                 type: integer
*     responses:
*       '200':
*         description: Successful response with the updated corporate
*       '404':
*         description: Corporate not found
*/
  updateCorporate: async (req, res) => {
    try {
      const result = await CorporateServices.update(req?.params?.id, req.body);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_UPDATE_CORPORATE, error } });
    }
  },

  /**
 * @swagger
 *   /corporate/{id}:
 *     delete:
 *       summary: Delete a corporate by ID
 *       tags: [Corporate]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID of the corporate
 *       responses:
 *         '200':
 *           description: Successful response with the deleted corporate
 *         '404':
 *           description: Corporate not found
 */
  deleteCorporate: async (req, res) => {
    try {
      const result = await CorporateServices.delete(req?.params?.id);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_DELETE_CORPORATE, error } });
    }
  }
};
