var _404 = require('controllers/404.js');
var home = require('controllers/home.js');
var about = require('controllers/about.js');
var privacy = require('controllers/privacy.js');
var tos = require('controllers/tos.js');

var tags = require('controllers/tag/tags.js');
var editTag = require('controllers/tag/edit.js');

var guides = require('controllers/guide/guides.js');
var viewGuide = require('controllers/guide/view.js');
var editGuide = require('controllers/guide/edit.js');
var userGuides = require('controllers/guide/user.js');
var recentGuides = require('controllers/guide/recent.js');

var search = require('controllers/search/search.js');

var activate = require('controllers/user/activate.js');

module.exports = {
    '/404': _404,
    '/': home,
    '/about': about,
    '/privacy': privacy,
    '/tos': tos,

    '/tags/:id': tags,
    '/tag/new/:parent': editTag,
    '/tag/edit/:id': editTag,

    '/guides/:catg': guides,
    '/guides/:catg/:tags': guides,
    '/guide/new/:catg': editGuide,
    '/guide/edit/:id': editGuide,
    '/guide/:catg/:id': viewGuide,
    '/guide/:id': viewGuide,
    '/user/guides': userGuides,
    '/user/guides/:id': userGuides,
    
    '/recent/guides': recentGuides,

    '/search': search,

    '/activate/:token': activate
};