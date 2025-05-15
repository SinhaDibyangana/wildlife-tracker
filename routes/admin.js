const express = require('express');
const passport = require('passport');
const AlertLog = require('../models/AlertLog');
const router = express.Router();

// Middleware to protect admin dashboard
function isAdmin(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/admin/login');
}

// Login page
router.get('/login', (req, res) => {
  res.render('admin-login', { title: 'Admin Login' });
});

// Login POST
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login'
  })
);

// Dashboard (protected)
router.get('/dashboard', isAdmin, async (req, res) => {
  const logs = await AlertLog.find().sort({ createdAt: -1 });
  res.render('admin-dashboard', { title: 'Dashboard', logs });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/admin/login'));
});

module.exports = router;
