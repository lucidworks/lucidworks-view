# How to deploy View as a webapp in Jetty

  1. View first needs to be built either by running `./view.sh start` in a downloaded package or by running `npm start` in the cloned repository. This will compile the SaSS and assemble your Angular app and it will be located in `app/build`.

  2. Copy `app/build` into the webapps folder in Jetty `webapps/<foldername>`.

  3. Add `<base href="/<foldername>/"></base>` to the `<head></head>` section in `webapps/<foldername>/index.html`.

  4. View is now accessible at `http://<jetty IP>:<jetty port>/<foldername>`!

  Once you have logged into View, you will be redirected to `http://<jetty IP>:<jetty port>/<foldername>/search?query=<configured default query>`. Please note that refreshing the app will return a **404**, unless the routing has been configured in Jetty.
