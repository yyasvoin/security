'use strict';

/**
 * Home page
 */
function getHomeRoute(req, res) {
  res.render('home', {
    pageId: 'home',
    title: 'Home',
    username: req.session.username,
  });
}


module.exports = { get: getHomeRoute };
