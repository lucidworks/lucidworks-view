# How To Style Your Tiara


Since Tiara is built using Foundation for Apps, it shares the same cross-browser compatibility:

>http://foundation.zurb.com/apps/docs/#!/compatibility

## Basic Styling

* Set the logo and title

  Edit [`FUSION_CONFIG.js`](../FUSION_CONFIG.sample.js) and modify `search_app_title` and `logo_location`.

* Configure the stylesheet

  Edit the [`_settings.scss`](../client/assets/scss/_settings.scss) file to customize stylesheet settings such as colors and markup.  You can also turn off the styling of any SaSS component in this file.

  This file also contains settings for Tiara-specific customizations such as the look and feel of the search box type-ahead.

## Advanced Styling

For styling and general layout, Tiara uses Foundation for Apps, a SaSS framework and AngularJs library for creating UIs. It provides layout components and an easy way to utilize state routing.  It is also mobile-compatible and enables touch gestures for tablets or phones.

The Foundation for Apps docs are here:

>http://foundation.zurb.com/apps/docs
