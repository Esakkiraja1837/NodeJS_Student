const ClassroomServices = require('../services/ClassroomServices');
const { constants, errors, utils } = require('../utils');

/**
 *  @swagger
 *  tags:
 *    name: Classroom
 *    description: API for managing Classroom
 */
module.exports = {
  /**
   * @swagger
   * /classrooms:
   *   post:
   *     summary: Create a new classroom
   *     tags: [Classroom]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               corporateId:
   *                 type: string
   *               capacity:
   *                 type: integer
   *               accessoryId:
   *                 type: string
   *               status:
   *                 type: integer
   *     responses:
   *       '200':
   *         description: Successful response with an array of classrooms
   */

  createClassroom: async (req, res) => {
    try {
      const result = await ClassroomServices.create(req.body);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_CLASSROOM_CREATION, error } });
    }
  },

  /**
   * @swagger
   * /classrooms/search:
   *    get:
   *      summary: Get all classrooms by name
   *      tags: [Classroom]
   *      parameters:
   *        - in: query
   *          name: name
   *          schema:
   *            type: string
   *          description: The name to search for classrooms
   *      responses:
   *        '200':
   *          description: Successful response with an array of classrooms
   *        '404':
   *          description: Classroom not found
   */

  searchClassrooms: async (req, res) => {
    try {
      const result = await ClassroomServices.search(req?.query?.name);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_FETCHING_CLASSROOM, error } });
    }
  },

  /**
 * @swagger
 * path:
 * /classrooms/{id}:
 *    get:
 *      summary: Get classroom by ID
 *      tags: [Classroom]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          description: The ID of the classroom to fetch
 *      responses:
 *        '200':
 *          description: Successful response with the requested classroom
 *        '404':
   *         description: Classroom not found
 */
  findById: async (req, res) => {
    try {
      const result = await ClassroomServices.findById(req?.params?.id, true);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_FETCHING_CLASSROOM, error } });
    }
  },

  /**
   * @swagger
   * path:
   * /classrooms:
   *    get:
   *      summary: Get all classrooms
   *      tags: [Classroom]
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
   *           description: Successful response with an array of classrooms
   */
  fetchAll: async (req, res) => {
    try {
      const result = await ClassroomServices.fetchAll(req.query);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_FETCHING_CLASSROOM_LIST, error } });
    }
  },

  /**
 * @swagger
 * /classrooms/{id}:
 *   put:
 *     summary: Update a classroom by ID
 *     tags: [Classroom]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the classroom
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               corporateId:
 *                 type: string
 *               accessoryId:
 *                 type: string
 *               status:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Successful response with the updated Classroom
 *       '404':
 *         description: Classroom not found
 */
  updateClassroom: async (req, res) => {
    try {
      const result = await ClassroomServices.update(req?.params?.id, req.body);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_CLASSROOM_UPDATE, error } });
    }
  },

  /**
   * @swagger
   *   /classrooms/{id}:
   *     delete:
   *       summary: Delete a classroom by ID
   *       tags: [Classroom]
   *       parameters:
   *         - in: path
   *           name: id
   *           required: true
   *           description: ID of the classroom
   *       responses:
   *         '200':
   *           description: Successful response with the deleted Classroom
   *         '404':
   *           description: Classroom not found
   */
  deleteClassroom: async (req, res) => {
    try {
      const result = await ClassroomServices.delete(req?.params?.id);
      return utils.formatResponse(res, result);
    } catch (error) {
      return res
        .status(constants.status.SERVER_ERROR)
        .json({ errors: { message: errors.ERROR_IN_CLASSROOM_DELETE, error } });
    }
  }

};
