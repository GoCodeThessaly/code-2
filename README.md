goCode 2 - Backbone notes demo app
==================================

This is a simple demo app that demonstrates the use of Backbone.js.
It uses the following libraries:

- sqlite3
- sequel
- sinatra
- sass & compass
- backbone.js
- zurb-foundation

Installation
============

You need a ruby 2.0 installation with bundler. [rvm](http://rvm.io) is recommended.
Clone the git repo and then run:
```
bundle
```
to install the necessary gems.

To start the server simply run:
```
bundle exec rackup -p 4567
```

Then visit http://localhost:4567/

Development
===========

To compile scss to css dynamically run compass from project root:
```
compass watch public
```
