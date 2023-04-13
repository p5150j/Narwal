### Stuff

Build that shit:
```js
expo prebuild --platform ios
```
 Needed to run this to package.json for the main.jsbundle for xcode
 ```js
 react-native bundle --entry-file='index.js' --bundle-output='./ios/main.jsbundle' --dev=false --platform='ios' --assets-dest='./ios'
```

 Run app from xcode as live reload is on by default and connect your real device 

 Publish build:
 ```js
 make sure to bump verion in
 package.json
 app.json
 and xcode(? not sure about that :thiking: )
 ```


 ## ToDo's

 #### env vars for:
 - firebase configs
 - in app in-app purchases


#### Features still needed: 
- Paywall (all store setups and code needed)
- audio uplaod and player


### Future Features needed:
- landing page with login and signup 
- auth logic and hide content if not logged in
- user profiles
- user posting from mobile 
- follow users and feed logic (you will see them in your feed)
- post comments 
- post likes
- tabs 



###
 Links

#### glassfy:
- https://dashboard.glassfy.io/c464e4865f594d3985c503860d543cd4/test/quick-start
- https://devdactic.com/subscriptions-react-native-glassfy
- https://docs.glassfy.io/docs/app-store-configuration


#### App stores
Google play:
-  https://play.google.com/console/u/0/developers/8408745671475428939/app-list?onboardingflow=signup
- https://support.google.com/googleplay/android-developer/answer/9859152?hl=en


Apple: 
- https://appstoreconnect.apple.com/apps/6447605777/testflight/ios

