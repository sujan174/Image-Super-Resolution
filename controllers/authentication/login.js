const userModel = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function handleLogin(req, res) {
  try {
    const password = req.body.password;
    const email = req.body.email.toLowerCase();
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).render('login', {
        error: 'Invalid email or password.',
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).render('login', {
        error: 'Invalid email or password.',
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );

    return res
      .status(200)
      .cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
      .redirect('/upload');
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).render('login', {
      error: 'Something went wrong. Please try again.',
    });
  }
}

module.exports = handleLogin;
