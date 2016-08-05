# Lucidworks View on Windows

 After downloading `Lucidworks-View-Installer.exe` and running it **as an administrator**, go to services, find the Lucidworks View service, right click and select start.

 Navigate to localhost:3000 on your preferred browser.

 To stop the service go to services, right click the Lucidworks View service and select stop

 To uninstall the service, run the `.\uninstall-service.cmd` **as an administrator**.

## Basic Configuration

The first time you run the View service, `FUSION_CONFIG.sample.js` is copied to `FUSION_CONFIG.js`.  Modify this file to configure View's basic options.  Documentation about the configuration keys is included in the file.

At a minimum, you _must_ configure the `collection` key to match the name of your Fusion collection.

In a production environment, you must also configure `host` and `port` to point to the UI service of your Fusion deployment.  The default is `localhost:8764` for development purposes.

When the app is running with `.\view.cmd`, it reloads the configuration every time you save `FUSION_CONFIG.js`.  You can modify the configuration and watch the app change in real time in your browser.

## Basic Customization

The title and logo for your interface are configured in FUSION_CONFIG.js as `search_app_title` and `logo_location`.

CSS options are configured in the files in `client\assets\scss`.

Templates for various UI components are located in `client\assets\components`.

Search results from different document types can use different templates.  The `client\assets\components\document` directory contains templates for some common document types, plus default templates for all others.  Data types correspond to Connectors in Fusion.  See [Customizing Documents](docs/Customizing_Documents.md) for details about working with these.
