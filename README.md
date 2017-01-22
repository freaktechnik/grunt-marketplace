# grunt-marketplace

[![Greenkeeper badge](https://badges.greenkeeper.io/freaktechnik/grunt-marketplace.svg)](https://greenkeeper.io/)
> Grunt plugin to validate and publish webapps to the Firefox OS Marketplace.

Currently WIP (mainly because the underlying module doesn't support packaged apps yet).

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-marketplace --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-marketplace');
```

## The "webapp" task

### Overview
In your project's Gruntfile, add a section named `marketplace` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  marketplaceCreds: grunt.file.readJSON('credentials.json'),
  marketplace: {
    options: {
      consumerKey: '<%= marketplaceCreds.key %>',
      consumerSecret: '<%= marketplaceCreds.secret %>',
      environment: 'production'
    },
    web: [
      'manifest.webapp'
    ]
  },
});
```

### Options

#### options.consumerKey
Type: `String`
Default value: none

Your marketplace API key. To avoid writing the key and secret directly into your code, consider loading them from a json file, like in the code above. If you don't have API keys yet, go to the [Firefox Marketplace API Page](https://marketplace.firefox.com/developers/api) and generate a key and secret for a command line application.

#### options.consumerSecret
Type: `String`
Default value: none

Your marketplace API secret for the key. To avoid writing the key and secret directly into your code, consider loading them from a json file, like in the code above. If you don't have API keys yet, go to the [Firefox Marketplace API Page](https://marketplace.firefox.com/developers/api) and generate a key and secret for a command line application.

#### options.environment
Type: `String`
Default value: `'production'`

Which instance of the Firefox Marketplace to use. `'production'` is the normal one, hosted at http://marketplace.firefox.com, while `'development'` is for the [Beta Firefox Market Place](https://marketplace-dev.allizom.org/).

#### options.target
Type: `String`
Default value: Name of the grunt target if it's a valid target name, else `'web'`

What kind of app to push to the marketplace. Can be `'web'` for a hosted app with a `manifest.webapp` or `'packaged'` for a packaged app.

