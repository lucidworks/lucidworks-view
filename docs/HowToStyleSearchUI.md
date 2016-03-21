# How To Style the UI


Since Lucidworks View is built using Foundation for Apps, it should work with the same browsers:

>http://foundation.zurb.com/apps/docs/#!/compatibility

However, we have not tested or designed our default interface for all of them.

## Basic Styling

* Set the logo and title

  Edit [`FUSION_CONFIG.js`](../FUSION_CONFIG.sample.js) and modify `search_app_title` and `logo_location`.

* Configure the stylesheet

  Edit [`_settings.scss`](../client/assets/scss/_settings.scss) to customize stylesheet settings such as colors and markup.  You can also turn off the styling of any SaSS component in this file.

  This file also contains settings for View-specific customizations such as the look and feel of the search box type-ahead.

## Advanced Styling

View uses Foundation for Apps, a SaSS framework and AngularJs library for creating UIs. It provides layout components and an easy way to utilize state routing.  It is also mobile-compatible and enables touch gestures for tablets or phones.

The Foundation for Apps docs are here:

>http://foundation.zurb.com/apps/docs
