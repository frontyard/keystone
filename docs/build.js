/**
 * This script builds the KeystoneJS Docs website to a directory.
 * 
 * It is currently limited to processing the jade templates into
 * html pages, with headmatter for Github Pages.
 * 
 * To build the complete site, also be sure to copy the public
 * assets into the target directory (defaults to ./_dist).
 * 
 * The process will be enhanced in the future to build the less
 * stylesheets and copy other static assets into the target, and
 * to build directly into the gh-pages branch (if specified).
 * 
 * e.g.
 * 		node build /Users/Jed/Development/packages/keystone-docs
 */

var fs = require('fs-extra'),
	path = require('path'),
	_ = require('underscore'),
	jade = require('jade'),
	content = require('./content');

// Command line arguments

var args = {
	dest: process.argv[2] || './_dist'
};

// Build docs

var locals = _.extend({
	pretty: true,
	languages: content.languages,
	version: require('../package.json').version
});

console.log('\nBuilding KeystoneJS docs...\n');

content.routes.forEach(function(route) {
	
	var options = _.extend(route, locals);
	options.prefix = (options.language === 'en') ? '/' : '/' + options.language + '/';
	_.extend(options, content.languages[options.language]);
	
	var html = jade.renderFile('./content/' + options.language + '/pages/' + route.template + '.jade', options);
	var filename = route.path.substr(1).replace(/\//g, '_') || 'index';
	var filepath = args.dest + '/' + filename + '.html';
	
	if (filename != 'index') {
		html = '---\npermalink: ' + route.path + '\/\n---\n' + html;
	}
	
	console.log('Writing ' + filename + '.html');
	fs.outputFileSync(filepath, html);
	
});

console.log('\nKeystoneJS docs built to ' + path.resolve(args.dest) + '\n');
process.exit();
