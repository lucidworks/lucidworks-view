# CHANGELOG

## 1.3.0 - Pickachu's Invisible Tiara
**New Feature**
* Added a windows packaged build, you can now run view on windows
* Improved performance
* You can now specify if you want view to start on a specific port
* Introducing dev mode, which allows you to use unminified build objects

## 1.2.0 - Cersei's Iron Tiara - June 30, 2016
**New Features**
* Now support range facet type
* Add multi select faceting, meaning you can facet on multiple items within a single query
* Add 'clear all' button to facet lists, clearing all selected facets
* Improved signals now pass in more information including position, language, and platform
* Enhanced signals service, adding additional functionality
* Improved field display in templates by setting set max-length

**Bug fixes**
* Fix typeahead of a query profile or pipeline
* Fixed field values: HTML entities are now properly truncated

## 1.1.0 - Tsarina Alexandra Tiara - May 4, 2016
**New Features**
* Highlighting support for fields when configured in Fusion
* Grouped results are now displayed when configured in the Fusion pipeline
* Add support for self signed certs with https on connections between Fusion and View
* Add ability to use View with https enabled. (You can even use your own cert!)
* Add context and instructions when starting via view.sh command
* Improved signals to work with more complex inputs

**Bug fixes**
* Fixed npm start command:   NPM start command now tracks changes to HTML files. Now you can change your HTML and templates with reckless abandon
* Fixed landing pages: Landing are now unique

## 1.0.0 - Initial release (Paper Tiara) - April 6, 2016

The first release of Lucidworks View

Contains out of the box support for:

Landing pages
- Fusion Field facets
- Document display templates
  - Slack, Twitter, JIRA, web, local file, default
- Color and logo customization
- Authentication
- Signals
- Typeahead
- Sorting
