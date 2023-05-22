process.env.FIREBASE_CONFIG = JSON.stringify({
  databaseURL: "",
  storageBucket: "",
  projectId: "",
});

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const language = require("@google-cloud/language");
const Perspective = require("perspective-api-client");
const videoIntelligence = require("@google-cloud/video-intelligence");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const languageClient = new language.LanguageServiceClient();
const perspective = new Perspective({
  apiKey: "",
});
const videoIntelligenceClient =
  new videoIntelligence.VideoIntelligenceServiceClient();

const likelihoods = [
  "UNKNOWN",
  "VERY_UNLIKELY",
  "UNLIKELY",
  "POSSIBLE",
  "LIKELY",
  "VERY_LIKELY",
];

exports.moderatePostComments = functions.firestore
  .document("posts/{postId}/comments/{commentId}")
  .onCreate(async (snapshot, context) => {
    const comment = snapshot.data();
    console.log("Comment data:", comment);
    const text = comment.text;

    if (!text || text.trim() === "") {
      console.log("Empty comment, skipping moderation.");
      return null;
    }

    console.log("Comment to analyze:", text);

    // Check for inappropriate content using Perspective API
    const perspectiveResult = await perspective.analyze({
      comment: { text: text },
      requestedAttributes: { TOXICITY: {} },
    });

    const toxicity =
      perspectiveResult.attributeScores.TOXICITY.summaryScore.value;

    // Set a threshold to determine if the content is inappropriate
    const toxicityThreshold = 0.7;

    if (toxicity >= toxicityThreshold) {
      console.log("Comment flagged as inappropriate");
      await snapshot.ref.delete();
    } else {
      console.log("Comment flagged as appropriate");
    }
  });

exports.moderatePost = functions
  .runWith({ timeoutSeconds: 540 })
  .firestore.document("posts/{postId}")
  .onCreate(async (snapshot, context) => {
    await new Promise((resolve) => setTimeout(resolve, 40000));

    const post = snapshot.data();
    console.log("Post data:", post);
    const name = post.name;
    const description = post.description;
    const content = `${name} ${description}`;

    if (!content || content.trim() === "") {
      console.log("Empty content, skipping moderation.");
      return null;
    }

    console.log("Content to analyze:", content);

    // Analyze sentiment with Cloud Natural Language API
    const document = {
      content: content,
      type: "PLAIN_TEXT",
    };

    try {
      const [sentimentResult] = await languageClient.analyzeSentiment({
        document: document,
      });
    } catch (error) {
      console.error("Error in Cloud Natural Language API:", error);
    }

    // Check for inappropriate content using Perspective API
    const perspectiveResult = await perspective.analyze({
      comment: { text: content },
      requestedAttributes: { TOXICITY: {} },
    });

    const toxicity =
      perspectiveResult.attributeScores.TOXICITY.summaryScore.value;

    // Set a threshold to determine if the content is inappropriate
    const toxicityThreshold = 0.7;

    if (toxicity >= toxicityThreshold) {
      console.log("Content flagged as inappropriate");
      post.inappropriate = true;
      await snapshot.ref.update({ inappropriate: true });
    } else {
      console.log("Content flagged as appropriate");
      post.inappropriate = false;
      await snapshot.ref.update({ inappropriate: false });
    }

    if (post.videoUrl) {
      console.log("Starting video analysis for post:", context.params.postId);

      try {
        // Get video URL from the post
        const videoUrl = post.videoUrl;

        if (videoUrl) {
          console.log("Video to analyze:", videoUrl);
          // Analyze the video for explicit content
          const explicitContentResults = await analyzeVideo(videoUrl, snapshot);

          // Set a threshold to determine if the content is inappropriate
          const explicitContentThreshold = 3; // Adjust this value as needed
          let maxLikelihood = 0;
          // Iterate through explicit content results and check if any of them exceed the threshold
          for (const result of explicitContentResults) {
            if (result.pornographyLikelihood > maxLikelihood) {
              maxLikelihood = result.pornographyLikelihood;
            }
          }
          const likelihoodString = likelihoods[maxLikelihood];
          // Flag the video content as inappropriate or appropriate
          if (maxLikelihood >= explicitContentThreshold) {
            console.log("Video flagged as inappropriate");
            post.inappropriateVideo = likelihoodString;
            await snapshot.ref.update({ inappropriateVideo: likelihoodString });
          } else {
            console.log("Video flagged as appropriate");
            post.inappropriateVideo = likelihoodString;
            await snapshot.ref.update({ inappropriateVideo: likelihoodString });
          }
        }
      } catch (error) {
        console.error("Error in Video Intelligence API:", error);
      }
    } else {
      console.log("No video URL for post:", context.params.postId);
    }
    // If either text or video content is flagged as inappropriate, delete the post
    if (
      post.inappropriate ||
      post.inappropriateVideo === "LIKELY" ||
      post.inappropriateVideo === "VERY_LIKELY"
    ) {
      console.log("Deleting post due to inappropriate content");
      await snapshot.ref.delete();
    }
  });

async function analyzeVideo(videoUrl, snapshot) {
  const decodedVideoUrl = decodeURIComponent(videoUrl);
  const videoUri = decodedVideoUrl
    .replace(
      "https://firebasestorage.googleapis.com/v0/b/myapp-80188.appspot.com/o/",
      "gs://myapp-80188.appspot.com/"
    )
    .split("?")[0];

  console.log(videoUri);
  const [operation] = await videoIntelligenceClient.annotateVideo({
    inputUri: videoUri,
    features: ["EXPLICIT_CONTENT_DETECTION", "LABEL_DETECTION"],
  });

  console.log("Video analysis operation started:", operation.name);
  const results = await operation.promise();
  console.log("Video analysis operation completed");
  const explicitContentResults =
    results[0].annotationResults[0].explicitAnnotation.frames;
  console.log("Explicit content results:", explicitContentResults);

  const labelAnnotations =
    results[0].annotationResults[0].segmentLabelAnnotations;
  console.log("Label annotations:", labelAnnotations);

  await processLabelAnnotations(labelAnnotations, snapshot);

  return explicitContentResults;
}

async function processLabelAnnotations(labelAnnotations, snapshot) {
  const labels = labelAnnotations.map((annotation) => {
    return {
      description: annotation.entity.description,
      confidence: annotation.segments[0].confidence,
    };
  });
  console.log("Processed labels:", labels);
  await snapshot.ref.update({ labels: labels });
}
