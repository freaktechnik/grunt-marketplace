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

        this.requiresConfig("key");
        this.requiresConfig("secret");

        if (this.files.length < 1) {
          grunt.verbose.warn('No packages to publish given.');
        }

        var options = this.options({
            environement: 'production'
        });

        var client = new MarketplaceClient(options.key, options.secret, options.environement);

        async.each(this.filesSrc, function(filepath, callback) {
            // Warn on and remove invalid source files (if nonull was set).
            if (!grunt.file.exists(filepath)) {
              grunt.log.warn('Source file "' + filepath + '" not found.');
              callback("A file was not found");
            }
            else if(!filepath.match(/\.zip$/)) {
                grunt.log.warn('File "' + filepath + '" is not a webapp package');
                callback("A package wasn't a zip file");
            }
            else {
                return client.validatePackage(filepath).then(client.publish, function(error) {
                    grunt.log.warn(error);
                    callback(error);
                }).then(function(appId) {
                    grunt.log.writeln('Successfully published the application '+appId);
                    callback();
                }, function(error) {
                    grunt.log.warn(error);
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
