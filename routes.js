var _404 = require('./controllers/404.js');
var home = require('./controllers/home.js');
var tags = require('./controllers/tag/tags.js');
var guides = require('./controllers/guide/guides.js');
var viewGuide = require('./controllers/guide/view.js');
var editGuide = require('./controllers/guide/edit.js');

module.exports = {
    '/404': _404,
    '/': home,
    '/tags/:id': tags,
    '/guides/:catg': guides,
    '/guides/:catg/:tags': guides,
    '/guide/:id': viewGuide,
    '/guide/edit': editGuide,
    '/guide/edit/:id': editGuide
};