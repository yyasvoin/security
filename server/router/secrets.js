'use strict';

function getSecretsRoutes(req, res) {
  if (!req.session.username) {
    res
      .status(403)
      .render('status/forbidden');
  } else {
    res.render('secrets', {
      pageId: 'secrets',
      title: 'Secrets',
      username: req.session.username,
    });
  }
}


module.exports = { get: getSecretsRoutes };
