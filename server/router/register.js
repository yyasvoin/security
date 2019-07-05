'use strict';

const argon2 = require('argon2');
const db = require('../../db');


/**
 * Initial page rendering
 */
function getRegisterRoute(req, res) {
  res.render('register', {
    pageId: 'register',
    title: 'Register',
    username: req.session.username,
    formValues: { username: null, password: null },
    formErrors: { username: null, password: null },
  });
}


/**
 * Form submission
 */
async function postRegisterRoute(req, res, next) {
  try {
    // First we check if the username provided already exists
    const usernameExists = await db.usernameExists(req.body.username);

    const formErrors = {};
    if (!usernameExists && req.body.username) {
      formErrors.username = null;
    } else {
      formErrors.username = 'Invalid username';
    }

    // If there are any errors do not register the user
    if (formErrors.username) {
      res
        .status(400)
        .render('register', {
          pageId: 'register',
          title: 'Register',
          username: req.session.username,
          formErrors: formErrors,
          formValues: {
            username: req.body.username,
          },
        });
    // Else, the form values are valid
    } else {
      // TODO: Hash the password and call `db.addUser(newUser)`
      // If successful should redirect to `/login`
      const hash = await argon2.hash(req.body.password);
      await db.addUser({
        username: req.body.username,
        password: hash,
      });
      res.redirect('/login');
    }
  } catch (error) {
    next(error);
  }
}


module.exports = {
  get: getRegisterRoute,
  post: postRegisterRoute,
};
