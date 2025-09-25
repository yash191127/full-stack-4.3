const express = require('express')
const app = express()
const port = 3000

let seats = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, status: 'available', lockTimer: null }))

app.get('/seats', (req, res) => {
  res.json(seats.map(({ lockTimer, ...s }) => s))
})

app.post('/lock/:id', (req, res) => {
  const seat = seats.find(s => s.id == req.params.id)
  if (!seat) return res.status(404).json({ message: 'Seat not found' })
  if (seat.status !== 'available') return res.status(400).json({ message: 'Seat not available' })
  seat.status = 'locked'
  seat.lockTimer = setTimeout(() => { seat.status = 'available'; seat.lockTimer = null }, 60000)
  res.json({ message: 'Seat is locked successfully, confirm within 1 minute' })
})

app.post('/confirm/:id', (req, res) => {
  const seat = seats.find(s => s.id == req.params.id)
  if (!seat) return res.status(404).json({ message: 'Seat not found' })
  if (seat.status !== 'locked') return res.status(400).json({ message: 'Seat is not locked and cannot be booked' })
  clearTimeout(seat.lockTimer)
  seat.lockTimer = null
  seat.status = 'booked'
  res.json({ message: 'Seat is booked successfully' })
})

app.listen(port, () => console.log(`Server running on port ${port}`))
