function handleLogout(req, res) {
  res.clearCookie('token').redirect('/user/login');
}

module.exports = handleLogout;
