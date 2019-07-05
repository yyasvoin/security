'use strict';

/**
 *
 */
module.exports = function authenticationMiddleware(req, res, next) {
  if (!req.session.username) {
    res
      .status(401)
      .render('status/forbidden');
  } else {
    next();
  }
};
