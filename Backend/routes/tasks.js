const express = require('express')
const router = express.Router()
const Task = require('../models/Task')
const protect = require('../middleware/auth')

router.get('/', protect, async (req, res) => {
  const tasks = await Task.find({ user: req.userId })
  res.json(tasks)
})

router.post('/', protect, async (req, res) => {
  const task = await Task.create({ ...req.body, user: req.userId })
  res.json(task)
})

router.put('/:id', protect, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(task)
})

router.delete('/:id', protect, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id)
  res.json({ message: 'Task deleted' })
})

module.exports = router