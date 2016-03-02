var _404 = require('./controllers/404.js');
var home = require('./controllers/home.js');

var tags = require('./controllers/tag/tags.js');
var editTag = require('./controllers/tag/edit.js');

var guides = require('./controllers/guide/guides.js');
var viewGuide = require('./controllers/guide/view.js');
var editGuide = require('./controllers/guide/edit.js');

var activate = require('./controllers/user/activate.js');

module.exports = {
    '/404': _404,
    '/': home,

    '/tags/:id': tags,
    '/tag/new/:parent': editTag,
    '/tag/edit/:id': editTag,

    '/guides/:catg': guides,
    '/guides/:catg/:tags': guides,
    '/guide/edit': editGuide,
    '/guide/edit/:id': editGuide,
    '/guide/:id': viewGuide,

    '/activate/:token': activate
};