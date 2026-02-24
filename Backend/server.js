const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const app = express()
app.use(cors())
app.use(express.json())

const JWT_SECRET = 'mysecretkey123'


const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({ users: [], tasks: [] }).write()


app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' })

    const exists = db.get('users').find({ email }).value()
    if (exists) return res.status(400).json({ message: 'Email already exists' })

    const hashed = await bcrypt.hash(password, 10)
    const user = { id: uuidv4(), name, email, password: hashed }
    db.get('users').push(user).write()

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user.id, name, email } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = db.get('users').find({ email }).value()
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token' })
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}


app.get('/api/user/profile', protect, (req, res) => {
  const user = db.get('users').find({ id: req.userId }).value()
  const { password, ...userData } = user
  res.json(userData)
})

app.put('/api/user/profile', protect, (req, res) => {
  const { name, email } = req.body
  db.get('users').find({ id: req.userId }).assign({ name, email }).write()
  const user = db.get('users').find({ id: req.userId }).value()
  const { password, ...userData } = user
  res.json(userData)
})


app.get('/api/tasks', protect, (req, res) => {
  const tasks = db.get('tasks').filter({ userId: req.userId }).value()
  res.json(tasks)
})

app.post('/api/tasks', protect, (req, res) => {
  const { title, description, status } = req.body
  if (!title) return res.status(400).json({ message: 'Title required' })
  const task = {
    _id: uuidv4(),
    userId: req.userId,
    title,
    description: description || '',
    status: status || 'pending',
    createdAt: new Date().toISOString()
  }
  db.get('tasks').push(task).write()
  res.json(task)
})

app.put('/api/tasks/:id', protect, (req, res) => {
  db.get('tasks').find({ _id: req.params.id, userId: req.userId }).assign(req.body).write()
  const task = db.get('tasks').find({ _id: req.params.id }).value()
  res.json(task)
})

app.delete('/api/tasks/:id', protect, (req, res) => {
  db.get('tasks').remove({ _id: req.params.id, userId: req.userId }).write()
  res.json({ message: 'Task deleted' })
})

app.listen(5000, () => console.log('Server running on port 5000 🚀'))