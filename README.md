
# N*-arwal app ©️ 
<div style="float: left; padding: 10px;">
<img src="1output_trimmed_enhanced.gif"  height="420"/>
<img src="2output_trimmed_enhanced.gif" height="420"/>
<img src="3output_trimmed_enhanced.gif" height="420"/>
<img src="4output_trimmed_enhanced.gif" height="420"/>
</div>



## Introduction

This is the [App Trello project board]( https://trello.com/b/2JDTaP9X/app-work) if you'd like to help build... or want to see something anything in the backlog or make a request for something new to be built.

## Brief project description
Once upon a time, in a world dominated by big corporations and social media giants, a group of passionate individuals embarked on a mission to create an app platform that would revolutionize the way people connect, share, and govern their own online communities. This is the story of an open-source social networking platform that put the power back into the hands of the users.

In a society where personal data was constantly bought and sold, this platform emerged as a beacon of transparency and user empowerment. Its purpose was clear: to provide a space where people could come together, free from the shackles of data exploitation, and engage in meaningful connections without compromising their privacy.

Unlike traditional social media platforms, where profit often took precedence over user well-being, this platform operates on a different principle. It’s a place "for the people by the people."

To enhance the user experience, the platform employs cutting-edge machine learning algorithms that labels each video post with metadata, rendering traditional hashtags obsolete. This approach empowers users to effortlessly search through millions of video posts, enabling them to find exactly what they were looking for with ease.

Recognizing that advertising is an integral part of online platforms, the creators of this app platform sought to redefine the relationship between ads and users. Inspired by the successful model pioneered by Spotify, users are given the option to subscribe and remove ads from their experience, allowing them to enjoy uninterrupted content.

And so, this open-source social networking platform could become a symbol of hope and a catalyst for change. It could be a reminder that, even in the face of overwhelming corporate dominance, individuals could come together and build a better future, one where transparency, self-sovereignty, and community-driven governance can prevaile.

As this story continues to unfold, the hope is more users flock to this platform, inspired by its values and its unwavering commitment to their rights. It becomes a place where authentic connections are forged, ideas are shared, and the power of the collective shapes the course of the digital landscape.

In the end, this app platform becomes not just a platform, but a movement—a movement that empowers individuals to reclaim their digital identities and create a world where their voices are heard, their data is respected, and their communities thrive. 

- [Installation & Setup](#installation--setup)
- [Firebase.js](#firebasejs)
- [HomeScreen.js](#homescreenjs)
- [ActionBar.js](#actionbarjs) (comments, user avatar, likes)
- [Comments.js](#commentsjs)
- [MakePostScreen.js](#commentsjs) (video recording/upload post)
- [UserListScreen.js](#userlistscreenjs) (user and content serach)
- [LoginScreen.js](#loginscreenjs)
- [RegisterScreen.js](#registerscreenjs)
- [Serverless ML functions/index.js](#serverless-ml-functionsindexjs)
- [Advertisement admin `web-admin/Ads.js`](#advertisement-admin-web-adminadsjs)
- [Manual content mediation `web-admin/Items.js`](#manual-content-mediation-web-adminitemsjs)


## Installation & Setup
Instructions on how to clone and run the project

Mobile-
- Clone this repository to your local machine using git clone.
- Install the dependencies by running `npm install`.
- Start the application using `expo start`.
- Build for iOS `expo prebuild --platform ios`
- Make the `main.jsbundle` that xcode needs  `react-native bundle --entry-file='index.js' --bundle-output='./ios/main.jsbundle' --dev=false --platform='ios' --assets-dest='./ios'`
- Open the `xcworkspace` file and sign with your Apple creds
- Add In `in app purchases`
- Build and Run on Device connected with USB
- Need to get docs for Android (_this in a react native app so should be easy_)

Web Admin
- Clone this repository to your local machine using git clone.
- Install the dependencies by running `npm install`
- Start the application using `npm start`

Firebase serverless
- Clone this repository to your local machine using git clone.
- Install the dependencies by running `npm install`
- Deploy the serverless function `firebase deploy --only functions`

## Project Structure:
Overview of the directory and files:

### `firebase.js`
The plan is to move this to someting more open, like supabase, IPFS later, but for now firebase seemed like a good start due to how easy it is to use and get spun it.

```js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };
```




### [`HomeScreen.js`](https://github.com/p5150j/Narwal/blob/main/mobile/screens/HomeScreen.js)
The HomeScreen component is the main screen users interact with when using the app. It retrieves and displays the posts from the Firestore database. It includes video playback for both posts and ads and handles their logic. It also provides the ability to switch between two feeds: "Curated" and "Discover".

##### Here are the key elements of the HomeScreen component:

`State Variables`

This component contains several state variables for storing posts, ads, viewable items, and other data. These are managed using the useState and useRef hooks.

- `posts`: stores all the posts retrieved from Firestore.
- `ads`: stores all ads retrieved from Firestore.
- `viewableItems`: keeps track of the currently visible items on the screen.
- `isAdPlaying`: tracks whether an ad video is currently playing.
`selectedPost`: stores the ID of the currently selected post.

`Functions`

- `fetchFollowedUsers`: fetches the users followed by the current user.
- `fetchFeedVideos`: fetches the posts of the users followed by the current user.
- `handleFeedSwitch`: switches between the "Curated" and "Discover" feeds.
`setupPurchases`: initializes the in-app purchases SDK.
- `triggerHapticFeedback`: triggers a light haptic feedback when a new item comes into view.
- `prepareDataWithAds`: interleaves ads within the post data.
- `handleAdEnd`: handles the end of an ad playback.

`useEffect`

`useEffect` hooks are used for side effects. The first one is for fetching followed users and initializing the `in-app purchases` SDK. The second is for setting up Firestore listeners for retrieving posts and ads. The third is for preparing data with ads whenever posts or ads change. The last one resets the ad playing status when the current ad index changes. Currently ads are configurable and take a number (_eg: play an add every 12 content scrolls_). 

`PostVideo Component`

This sub-component manages the playback of videos for posts and ads. It uses the react-native-video package for video playback. It controls when the video plays or pauses based on whether it's in view and whether it's an ad or post video.

`renderItem` Function

This function is responsible for rendering each item in the FlatList. It determines whether the item is a post or ad and renders the appropriate content.

`onViewableItemsChanged` Function

This function is triggered when the viewable items in the FlatList change. It sets the viewableItems state variable and starts ad playback if an ad comes into view.

`Modal Component`

A modal is used for displaying comments for the currently selected post.

### [`ActionBar.js`](https://github.com/p5150j/Narwal/blob/main/mobile/components/ActionBar.js)

This ActionBar component is a functional component written in React that uses hooks to manage state and effects. It allows users to interact with posts, providing functionality to like, comment, and view the author's profile. Firebase Firestore is used for data management.


The db instance of the Firebase application is imported from the `../firebase module`.

`Component Props`

This component receives a number of props:

`onCommentPress`, `onLikePress`, `onAvatarPress`: Functions to execute when a user interacts with respective components.

- `avatarUrl`: URL to display the avatar image.
- `postId`: Unique identifier for the post.
- `userId`: Unique identifier for the current user.
- `navigation`: Navigation object from react-navigation.
- `authorId`: Unique identifier for the author of the post.

`State Variables`

Several pieces of state are managed using the useState hook:

- `commentsCount`: The number of comments on the post.
- `likesCount`: The number of likes on the post.
- `isLiked`: Whether the current user has liked the post.

`Fetching User Like Status`

The fetchUserLikeStatus function checks if the current user has liked the post, using a query on a subcollection of likes under the post document. This sets the `isLiked` state accordingly.

`Fetching Comments Count`

This is done in `fetchCommentsCount` which sets up a `snapshot` listener on the comments `subcollection` of a post document in Firestore. Any time the comments collection updates, the `commentsCount` state is updated.

`Fetching Likes Count`

Similarly, the `fetchLikesCount` function sets up a snapshot listener on the `likes` `subcollection` of a post document. Any time the likes collection updates, the likesCount state is updated.

`Liking a Post`

The `handleLikePress` function toggles whether a user likes a post. It checks if a like document already exists for the current user. If it does, it deletes the document and decrements the likesCount field in the post document. If it does not exist, it creates a new like document and increments the `likesCount` field in the post document.

`Navigating to the Author's Profile`

The `handleAvatarClick` function allows for navigation to the author's profile when the avatar image is clicked.

`Component Render`

The component returns a View component containing `TouchableOpacity` components. Each of these wraps a clickable part of the action bar - the avatar, like button, and comment button. They each have their own `onPress` functions, and the like and comment buttons also display the current count of likes and comments.


### [`Comments.js`](https://github.com/p5150j/Narwal/blob/main/mobile/components/Comments.js)


This is a React Native component for handling comments on a post. Let's break down what this component does.

- State Variables: The component maintains state variables for `comments` (an array of comments associated with the post), input (the current input of the comment text field), and `currentUserData` (information about the currently authenticated user).

- Retrieving Current User Data: When the component is mounted, it retrieves the currently authenticated user's data (such as their handle and profile image URL) from Firestore. This data is then stored in the `currentUserData` state variable.

- Retrieving Comments: The component listens to real-time updates to the comments collection associated with the provided `postId`. Whenever a new comment is added, modified, or removed, the `onSnapshot` function fires, retrieves the current list of comments, and updates the `comments` state variable accordingly.

- Adding a Comment: The `sendComment` function is used to add a new comment to the Firestore comments collection for the current post. It takes the text from the `input` state variable and adds a new comment with the current user's handle and profile image URL, along with a server timestamp to record when the comment was created.

- Rendering the Comments: The `renderItem` function defines how each comment is rendered in the `FlatList` component. Each comment shows the user's profile image (if available), the user's handle, and the text of the comment.

- User Interface: The user interface of the component consists of a list of comments and a text input field for adding a new comment. The `TouchableWithoutFeedback` and `KeyboardAvoidingView` components are used to dismiss the keyboard when the user taps outside the text input field and to prevent the keyboard from covering the input field when it appears, respectively.



This component uses Firebase for data persistence and real-time updates, which allows the comments to update in real time for all users whenever a new comment is added or an existing comment is modified or removed.


### [`MakePostScreen.js`](https://github.com/p5150j/Narwal/blob/main/mobile/screens/MakePostScreen.js)

This is a React Native code file for a component named MakePostScreen. The code uses Firebase for backend services and several libraries for different functionalities. Below is a high-level breakdown of what this component does:

- State Variables and References: It sets up several state variables to control different aspects of the component such as whether it's `loading, name, description` of the post, whether a video is being uploaded, and the `camera type` (front or back).

- `useEffect` Hook: There's a useEffect hook used for starting a repeating animation if isLoading is true.

- Video Selection: The `pickVideo` function allows users to select a video from their device library.

- Video Recording: The handleRecordButtonPress and handleStopButtonPress functions control the start and stop recording functionalities. `handleRecordButtonPress` starts the recording, and `handleStopButtonPress` stops it.

- Post Creation: The `handlePostButtonPress` function controls what happens when the user tries to post their video. It validates the presence of a video, `name, and description`, uploads the video to Firebase Storage, and then creates a post in the Firestore database with the video's `download URL`, the name, and the description. It also resets state variables to their initial state and navigates back to the home screen after successful post creation.

- Video Upload: The `uploadVideo` function uploads the recorded video to Firebase Storage and returns the download URL.

- Firestore Document Creation: The `createPost` function creates a new document in the `'posts' `collection in Firestore. It also creates a `'likes'` sub-collection for the new post.

- Video Preview and Form Overlay: If a video preview is available, the app displays video preview controls. If `showFormOverlay` is `true`, a form is displayed over the video preview, allowing the user to add a name and description for their post.

- Rendering: The render function (return statement) is a combination of camera view, video preview, and post creation form based on the state variables.


In summary, this is a video sharing screen where users can record or select a video, provide a name and description, and then upload the video to Firebase Storage. The metadata (video URL, name, description) is stored in Firestore as a post. Users can switch between front and back cameras and see a preview of the video before uploading. It also provides visual feedback about the progress of the upload and includes haptic feedback when recording starts.

### [`UserListScreen.js`](https://github.com/p5150j/Narwal/blob/main/mobile/screens/UserListScreen.js)

This code defines a UserListScreen component for a React Native application that utilizes Firebase as its backend. The screen fetches and displays users and posts from a Firestore database, and provides functionality for searching these users and posts.

Here's a breakdown of the code:

`State Variables:`

The component uses several state variables:

- `users`: Contains the list of all users fetched from the Firestore database.
- `searchText`: Stores the user's search input.
- `filteredUsers`: Stores the list of users whose handle includes the search text.
- `filteredPosts`: Stores the list of posts whose name, description, or labels includes the search text.
- `posts`: Contains the list of all posts fetched from the Firestore database.

Firestore: Initializes Firestore using getFirestore(). It then uses Firestore's collection, query, orderBy, and onSnapshot functions to retrieve and monitor changes in both 'users' and 'posts' collections in the Firestore database.

`useEffect Hooks:` Three useEffect hooks are defined in this component.

- `The first one fetches users from Firestore and stores them in the users state variable.
- The second one fetches posts from Firestore and stores them in the posts state variable.
- The third one is triggered when the `searchText`, `users`, or `posts` state variables change. It filters the users and posts based on the search text and stores the result in `filteredUsers` and `filteredPosts`.

`Rendering Functions`

Several rendering functions are defined.

- `renderDivider`: Renders a divider if search text is not empty and there are filtered posts.
- `renderItem`: Depending on the type of the item, it either renders a user or a post.
- `renderUser`: Renders a user item with an image and handle.
- `renderPost`: Renders a post item with a video and its name.

`Return Statement:`

The component returns a view that contains a close button, a heading, a search input field, and a FlatList that renders filtered users and posts. The data passed to the FlatList is a combination of filtered users and posts. The filtered users and posts are combined into one array with the addition of a 'type' field to each item to distinguish between users and posts.



### [`LoginScreen.js`](https://github.com/p5150j/Narwal/blob/main/mobile/screens/LoginScreen.js)


This is the code for a LoginScreen component in a React Native application. It makes use of several key concepts such as state management, side-effects via useEffect, Firebase Authentication, React Navigation and animation.

Here's a breakdown:

- State Variables: The code initializes several state variables for managing the email, password, and any error message that might come up during the login process. It also creates a state for handling animation using `new Animated.Value`.

- React Navigation: The `useNavigation` hook provides navigation functionality. It is used to navigate to different screens ("ForgotPassword" and "Register") and to go back to the previous screen.

- Animation: The code sets up a continuous zoom animation that alternates between scaling the background image up by 20% and scaling it back down to normal size. The `useEffect` hook is used to start the animation loop when the component mounts.

- Login Function: In `handleLogin`, it uses Firebase's `signInWithEmailAndPassword` method to log the user in with their email and password. If the login is successful, it logs a message to the console. If either the email or password is missing, it sets an error message in the state.

- User Interface: The `return` statement of the component defines the JSX of the screen which includes an image background that gets animated, two TextInput components for the email and password, and several buttons for logging in, navigating to the Forgot Password screen, and navigating to the Register screen.


That's the overview of this LoginScreen component! It includes some fundamental React Native concepts, which makes it a pretty common type of screen you'll see in many mobile applications.


### [`RegisterScreen.js`](https://github.com/p5150j/Narwal/blob/main/mobile/screens/RegisterScreen.js)

This is a RegisterScreen component for a React Native application. It's well structured and follows the best practices for managing state and handling user interactions in a React component.

Here's what it does:

- It uses hooks such as `useState` and `useEffect` from React to manage state and handle side effects, respectively.

- The useState hooks manage the user inputs (`email, password, handle, name`) and error messages.

- There's a `useEffect` hook that starts a zoom animation on the background when the component mounts. The animation continuously zooms in and out.

- The component provides a form for the user to input their `email, password, handle, and name.` It validates the inputs before using Firebase's Authentication service to register the user.

- After successful registration, it creates a new document in the Firestore `"users" collection `with the `user's ID`. It also stores the `email, name, handle, and a default profile image URL` in the new user document.

- It uses the `navigation` prop to navigate back and forth between screens.

- It also handles and displays error messages appropriately in case of registration failures.


### [`Serverless ML functions/index.js`](https://github.com/p5150j/Narwal/blob/main/functions/index.js)

This script sets up several Firebase Cloud Functions for moderating content within a Firebase Firestore database for an application. The functions use the Google Cloud Language, Perspective API, and Video Intelligence API for content moderation.

Let's break down the significant parts:

- `Environment Variables and Module Imports`: The script first sets up the necessary environment variables and imports the required modules. It specifies the Firebase Firestore database URL, storage bucket, and project ID. It also imports several modules, including Firebase functions and admin SDK, Google Cloud Language API, Perspective API, and Google Cloud Video Intelligence API.

- Firebase Admin Initialization: It then initializes the Firebase admin SDK with the service account credentials for the specified Firebase project.

- `Likelihoods Array`: It sets up an array called `likelihoods` for classification of explicit content detection results from the Video Intelligence API.

- Function `moderatePostComments`: This function is triggered when a new comment is created under a post in Firestore. It fetches the comment text and checks it for toxicity using the Perspective API. If the toxicity score exceeds a defined threshold, it deletes the comment from Firestore.



- Function `moderatePost`: This function is triggered when a new post is created in Firestore. It has a higher timeout due to the potential long-running video analysis task. The function performs a number of tasks:
  * Analyzes the post name and description for toxicity using the Perspective API. If the toxicity score exceeds a defined threshold, it marks the post as inappropriate.
  * If the post has a video URL, it invokes the Google Cloud Video Intelligence API to analyze the video for explicit content. The result is compared against a threshold to mark the video as inappropriate or appropriate.
  * If either the post content or the video content is marked as inappropriate, it deletes the post from Firestore.

- Function `analyzeVideo`: This is a helper function that handles the task of video analysis using the Video Intelligence API. It decodes the video URL, starts the video analysis operation, and processes the results for explicit content and label annotations.

- Function `processLabelAnnotations`: This is another helper function that processes the label annotations obtained from video analysis. It updates the post document in Firestore with the processed labels.

Overall, this script implements a content moderation system that automatically scans and moderates user posts and comments in real-time. It uses Google's machine learning APIs for text and video content analysis.

### [Advertisement admin `web-admin/Ads.js`](https://github.com/p5150j/Narwal/blob/main/web-admin/the-admin/src/Ads.js)

This is a React component named Ads, which uses Firebase Firestore and Firebase Storage to store, retrieve, update, and delete advertisements. The script also includes Firebase Hooks like useState and useEffect.

Here's a detailed explanation:

- The state variables:

   * items is an array storing the list of ads fetched from Firestore.
   * name and description store the title and description of an advertisement respectively.
    * image and video are for storing the files to be uploaded as the ad's image and video respectively.
    * loading is a boolean to show the loading state of the component.


- useEffect runs once after the initial render of the component. It fetches the existing ads from Firestore and stores them in items.

- handleSubmit is the function that runs when the ad form is submitted. It prevents the default form submission behavior, sets loading to true, and then tries to create a new document in Firestore with the provided name and description. If an image or a video is provided, it uploads them to Firebase Storage and updates the Firestore document with the URLs. It then resets the form fields and loading state.

- handleDelete deletes a document with the provided id from Firestore.

- handleImageUpload and handleVideoUpload handle file input changes. When the selected file changes, they store the new file in the corresponding state variable.

- The return statement of the component renders a form for submitting new ads and a list of existing ads. Each ad displays its image, video, name, and description. There's also a button for deleting each ad.

- If loading is true, the component shows a loading message. If loading is false, it either shows the form and the list of ads (if any exist), or just the form (if no ads exist).

### [Manual content mediation `web-admin/Items.js`](https://github.com/p5150j/Narwal/blob/main/web-admin/the-admin/src/Items.js)

This is a React component named Items that uses Firebase Firestore for data storage and Firebase Storage for file storage (images and videos). It allows users to add, view, and delete posts. The component uses several hooks for managing state and side effects.

Let's dissect the functionality:

- State Variables: The component maintains several state variables using the useState hook. items holds the list of posts, name and description represent the title and description of a new post, image and video hold the files to be uploaded, and loading indicates whether an asynchronous operation is in progress.

- Fetching Posts: The useEffect hook is used to fetch the posts from Firestore when the component is mounted. This operation is asynchronous and returns a promise. The function fetchItems retrieves the posts from the posts collection in Firestore, then updates the items state with the retrieved data.

- Add a Post: The handleSubmit function is called when a new post is being added. This function performs several steps:

  * It first creates a new document in the posts collection with the name and description states.
  * If an image has been selected, it uploads this image to Firebase Storage under the images directory, where the filename is the ID of the document just created. It then updates the document in Firestore with the URL of the uploaded image.
  * If a video has been selected, it follows a similar process: uploads the video to Firebase Storage under the videos directory and updates the document with the URL of the uploaded video.
  * In case of any error during these operations, it logs the error message. After the operations have completed, whether successfully or not, it resets the form state and the loading state.

- Delete a Post: The handleDelete function deletes a post when its corresponding "Delete" button is clicked. It removes the document from Firestore and sets loading to false once the operation is complete.

- Image/Video Upload: The handleImageUpload and handleVideoUpload functions update the image and video states respectively when a user selects a file.

Rendering: The component renders a form for adding a new post and a list of existing posts. When loading is true, it displays a "Loading..." message. Each post displays an image or video (if available), the title, the description, and a "Delete" button.



## Usage
- How to use the project, tips, and examples

## Contributing
- Guidelines for contributions

## Credits
- Acknowledge work of contributors, references, and third-party assets, if any

## License
- Information about the license

## Contact
- Contact information






<!-- 
#### App stores
Google play:
-  https://play.google.com/console/u/0/developers/8408745671475428939/app-list?onboardingflow=signup
- https://support.google.com/googleplay/android-developer/answer/9859152?hl=en


Apple: 
- https://appstoreconnect.apple.com/apps/6447605777/testflight/ios


https://arus.freshdesk.com/support/home
https://arus.freshdesk.com/a/dashboard/default -->







