goCode 2 - Backbone notes demo app
==================================

This is a simple demo app that demonstrates the use of Backbone.js.
It uses the following libraries:

- [sqlite3](http://rubygems.org/gems/sqlite3)
- [sequel](http://rubygems.org/gems/sequel)
- [sinatra](http://rubygems.org/gems/sinatra)
- [sass](http://rubygems.org/gems/sass) & [compass](http://rubygems.org/gems/compass)
- [backbone.js](http://backbonejs.org/)
- [zurb-foundation](http://rubygems.org/gems/zurb-foundation)

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
Then visit [http://localhost:4567/](http://localhost:4567/)

Development
===========

To compile scss to css dynamically run compass from the project root:
```
compass watch public
```
