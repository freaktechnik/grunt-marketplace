/*
 * grunt-marketplace
 * Created by Martin Giger
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var MarketplaceClient = require("node-firefox-marketplace");
var async = require("async");

module.exports = function(grunt) {
    grunt.registerMultiTask("marketplace", "Grunt plugin to validate and publish webapps to the Firefox OS Marketplace", function() {
        var done = this.async();

        if (this.files.length < 1) {
          grunt.verbose.warn('No packages to publish given.');
        }

        var target = 'web';
        if(this.target === 'packaged') {
            target = this.target;
        }

        var options = this.options({
            environment: 'production',
            target: target
        });

        if(!options.consumerKey || !options.consumerSecret) {
            grunt.fail.warn("You must provide a key and secret for the Firefox Marketplace API");
        }

        var client = new MarketplaceClient(options);

        async.each(this.filesSrc, function(filepath, callback) {
            // Warn on and remove invalid source files (if nonull was set).
            if (!grunt.file.exists(filepath)) {
              grunt.log.warn('Source file "' + filepath + '" not found.');
              callback("A file was not found");
            }
            else if(options.target === 'packaged' && !filepath.match(/\.zip$/)) {
                grunt.log.warn('File "' + filepath + '" is not a webapp package');
                callback("A package wasn't a zip file");
            }
            else if(options.target === 'web' && !filepath.match(/\.webapp$/)) {
                grunt.log.warn('File "' + filepath + '" is not a webapp manifest');
                callback("Not porovided with a manifest");
            }
            else {
                var validate = client.validateManifest;
                if(options.target === 'packaged') {
                    validate = client.validatePackage;
                }

                return validate(filepath)
                .then(client.publish)
                .then(function(appId) {
                    grunt.log.ok('Successfully published the application '+appId);
                    return callback();
                }).catch(function(error) {
                    grunt.log.error(error);
                    callback(error);
                });
            }
        }, function(error) {
            if(error) {
                done(false);
            }
            else {
                grunt.log.writeln('All packages have been successfully published');
                done(true);
            }
        });
    });
};
