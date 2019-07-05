'use strict';

const argon2 = require('argon2');
const db = require('../../db');


/**
 * Initial page rendering
 */
function getLoginRoute(req, res) {
  res.render('login', {
    pageId: 'login',
    title: 'Login',
    username: req.session.username,
    formError: null,
    formValues: { username: null, password: null },
  });
}


/**
 * Form submission
 */
async function postLoginRoute(req, res, next) {
  try {
    const hash = await db.getUserPasswordHash(req.body.username);
    if (await argon2.verify(hash, req.body.password)) {
      req.session.username = req.body.username;
      res.redirect('/');
    } else {
      res
        .status(401)
        .render('login', {
          pageId: 'login',
          title: 'Login',
          username: req.session.username,
          formError: 'Authentication failed.',
          formValues: {
            username: req.body.username || null,
            password: req.body.password || null,
          },
        });
    }
  } catch (error) {
    next(error);
  }
}


module.exports = {
  get: getLoginRoute,
  post: postLoginRoute,
};
