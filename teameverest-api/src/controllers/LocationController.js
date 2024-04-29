const LocationServices = require('../services/LocationServices');
const { constants, errors, utils } = require('../utils');

/**
 * @swagger
 * tags:
 *   name: Location
 *   description: API for managing Location
 */
module.exports = {
  /**
   * @swagger
   * /locations:
   *   post:
   *     summary: Create a new location
   *     tags: [Location]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               state:
   *                 type: string
   *               status:
   *                 type: integer
   *     responses:
   *       '200':
   *         description: Successful response with an array of location
   */
  createLocation: async (req, res) => {
    try {
      const result = await LocationServices.create(req.body);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_LOCATION_CREATION, error } });
    }
  },

  /**
   * @swagger
   * /locations/search:
   *   get:
   *     summary: Get all location by name
   *     tags: [Location]
   *     parameters:
   *       - in: query
   *         name: name
   *         schema:
   *           type: string
   *         description: The name to search for location
   *     responses:
   *       '200':
   *         description: Successful response with an array of location
   *       '404':
   *         description: Location not found
   */
  searchLocations: async (req, res) => {
    try {
      const result = await LocationServices.search(req?.query?.name);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_FETCHING_LOCATION, error } });
    }
  },

  /**
   * @swagger
   * path:
   * /locations/{id}:
   *    get:
   *      summary: Get location by ID
   *      tags: [Location]
   *      parameters:
   *        - in: path
   *          name: id
   *          schema:
   *            type: string
   *          description: The ID of the location to fetch (optional)
   *      responses:
   *        '200':
   *          description: Successful response with an array of locations or a specific location
   *        '404':
   *           description: Location not found
   */
  findById: async (req, res) => {
    try {
      const result = await LocationServices.findById(req?.params?.id, true);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_FETCHING_LOCATION, error } });
    }
  },

  /**
   * @swagger
   * /locations:
   *   get:
   *     summary: Get all locations
   *     tags: [ 'Location' ]
   *     parameters:
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
   *     responses:
   *       '200':
   *         description: Successful response with an array of locations
   */
  fetchAll: async (req, res) => {
    try {
      const result = await LocationServices.fetchAll(req.query);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_FETCHING_LOCATION_LIST } });
    }
  },

  /**
   * @swagger
   * path:
   * /locations/{id}:
   *   put:
   *     summary: Update a location by ID
   *     tags: [Location]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the location
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               state:
   *                 type: string
   *               status:
   *                 type: integer
   *     responses:
   *       '200':
   *         description: Successful response with the updated location
   *       '404':
   *         description: Location not found
   */
  updateLocation: async (req, res) => {
    try {
      const result = await LocationServices.update(req?.params?.id, req.body);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_UPDATE_LOCATION } });
    }
  },

  /**
   * @swagger
   *   /locations/{id}:
   *     delete:
   *       summary: Delete a location by ID
   *       tags: [Location]
   *       parameters:
   *         - in: path
   *           name: id
   *           required: true
   *           description: ID of the location
   *       responses:
   *         '200':
   *           description: Successful response with the deleted location
   *         '404':
   *           description: Location not found
   */
  deleteLocation: async (req, res) => {
    try {
      const result = await LocationServices.delete(req?.params?.id);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_DELETE_LOCATION } });
    }
  }
};
