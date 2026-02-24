const express = require('express')
const router = express.Router()
const User = require('../models/User')
const protect = require('../middleware/auth')

router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.userId).select('-password')
  res.json(user)
})

router.put('/profile', protect, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true }).select('-password')
  res.json(user)
})

module.exports = router