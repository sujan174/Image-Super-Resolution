const userModel = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function handleSignup(req, res) {
  try {
    const { name, password } = req.body;
    const email = req.body.email.toLowerCase();
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.render('signup', {
        error: 'An account with this email already exists.',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );
    return res
      .status(200)
      .cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
      .redirect('/upload');
  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).render('signup', {
      error: 'Something went wrong. Please try again.',
    });
  }
}

module.exports = handleSignup;
