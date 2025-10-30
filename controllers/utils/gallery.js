// Developed by Sujan H

const userModel = require('../../models/user');

// Display user's gallery of previously upscaled images in reverse chronological order
async function handleGallery(req, res) {
  try {
    const user = await userModel.findById(req.user.id).lean();

    if (!user) {
      return res.redirect('/user/login');
    }

    res.render('gallery', {
      user,
      images: user.imageHistory ? user.imageHistory.reverse() : [],
      error: null,
    });
  } catch (error) {
    console.error('Error fetching gallery data:', error);
    res.render('gallery', {
      user: { name: 'Guest' },
      images: [],
      error: 'Could not load your gallery.',
    });
  }
}

module.exports = handleGallery;
