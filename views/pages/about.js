var m = require('mithril');
var layout = require('../layout/sidebar.js');

module.exports = function(vm) {
    return layout(m('.page', [
        m('h1', 'About TLDR.gg'),
        m('p', ['The core of the Internet has always revolved around the quick distribution of information. ',
                'With TLDR.gg, we want to push that concept even further by creating a content platform that pushes ',
                'writers to give readers exactly what they need in as few characters a possible.']),
        m('p', ['At the heart of TLDR.gg are four web and gaming industry veterans that value the time and effort ',
                'people currently endure to find the information they need through the clutter of web pages. We hope ',
                'to provide a service and tool that helps everyone, from gamers to gardeners, learn the skills they ',
                'need to succeed at their goals.'])
    ]));
};