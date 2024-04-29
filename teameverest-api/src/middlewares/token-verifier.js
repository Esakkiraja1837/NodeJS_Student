const jwt = require('jsonwebtoken');
const config = process.env;
const { constants, errors } = require('../utils');
const excludedPaths = ['/login', '/forgot-password'];

/**
 * To verify the JWT token from request headers
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const verifyToken = async (req, res, next) => {
  // verify a token symmetric - synchronous
  const token = req.headers.authorization.split(' ')[1];
  if (token) {
    await jwt.verify(token, config.JWT_AUTH_KEY, (err, decoded) => {
      if (err) {
        res.status(constants.status.FORBIDDEN).json({ message: `Authentication failed - ${err.message}` });
      } else {
        next();
      }
    });
  } else {
    res.status(constants.status.FORBIDDEN).json({ message: errors.INVALID_AUTHENTICATION_HEADER });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const validateToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    const path = req.path;
    if (path.startsWith('/api-docs') || excludedPaths.indexOf(path) !== -1) {
      next();
    } else {
      res.status(403).json({ message: errors.AUTHENTICATION_HEADER_REQUIRED });
    }
  } else {
    verifyToken(req, res, next);
  }
};

module.exports = { validateToken, verifyToken };
