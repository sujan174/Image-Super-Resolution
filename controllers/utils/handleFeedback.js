const userModel = require('../../models/user');

// Save user feedback (like/dislike) for an upscaled image in their history
async function handleFeedback(req, res) {
  try {
    const {
      upscaledImageFilename,
      likedResult,
    } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).send('Authentication error.');
    }

    // Update the specific image entry in user's image history array
    const result = await userModel.updateOne(
      {
        _id: req.user.id,
        'imageHistory.upscaledPath': upscaledImageFilename,
      },
      {
        $set: { 'imageHistory.$.likedResult': likedResult === 'yes' },
      },
    );

    if (result.nModified === 0) {
      return res.status(404).send('Could not find the image in your history to update.');
    }

    return res.status(200).send('Feedback saved.');
  } catch (error) {
    console.error('Error handling feedback:', error);
    return res.status(500).send('Could not save your feedback.');
  }
}

module.exports = handleFeedback;
