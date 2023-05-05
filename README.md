## Stuff

## Theme (might change later)
https://www.color-hex.com/color/252526
https://ionic.io/ionicons

## Repo stuff (notes for dev)

Build that shit:
```js
nuke npm-mods
reinstall
expo prebuild --platform ios
 react-native bundle --entry-file='index.js' --bundle-output='./ios/main.jsbundle' --dev=false --platform='ios' --assets-dest='./ios'
```
Xcode build stuff
```js
kill derived cache: 
Finer>Go>/Users/dev/Library/Developer/Xcode/DerivedData/ModuleCache.noindex and nuke the contents

Build prod local verion to check:
Product → Scheme → Edit Scheme. Select the Run tab in the sidebar, then set the Build Configuration dropdown to Release.

Need a section for app store deployment:
here....

Testflight
here...

```


### Links

#### RevenueCat:
- https://app.revenuecat.com/projects/481bb9da/api-keys
- js https://www.youtube.com/watch?v=IbviHzKHDXY
- typescript with better tut on store setup https://www.youtube.com/watch?v=M0RSUNr_0S0


#### App stores:
Google play:
-  https://play.google.com/console/u/0/developers/8408745671475428939/app-list?onboardingflow=signup
- https://support.google.com/googleplay/android-developer/answer/9859152?hl=en


Apple: 
- https://appstoreconnect.apple.com/apps/6447605777/testflight/ios

### Help Desk stuff
https://arus.freshdesk.com/support/home
https://arus.freshdesk.com/a/dashboard/default





### Functions logs:
 https://console.cloud.google.com/logs/query;query=%2528resource.type%3D%22cloud_function%22%20%20%2529%20OR%20%2528resource.type%3D%22cloud_run_revision%22%20%20%2529;timeRange=PT5M;cursorTimestamp=2023-05-01T06:03:57.501961Z?authuser=0&project=myapp-80188