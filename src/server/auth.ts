import express, { Router } from 'express'

const validUsers: any[] = [
  { id: '1', name: 'Julie', roles: ['admin'], password: 'wishlist' },
  { id: '2', name: 'Jessica', roles: ['admin'], password: 'wishlist' },
  { id: '3', name: 'Rob', roles: ['admin'], password: 'dempsey' }
]

export const auth = Router()

auth.use(express.json({ limit: '10mb' }))

auth.post('/api/signIn', (req, res) => {
  const user = validUsers.find(
    (user) => user.name.toLowerCase() === req.body.username.toLowerCase()
  )
  if (user && user.password === req.body.password) {
    req.session!['user'] = user
    res.json(user)
  } else {
    res.status(404).json('Invalid user or password')
  }
})

auth.post('/api/signOut', (req, res) => {
  req.session!['user'] = null
  res.json('signed out')
})

auth.get('/api/currentUser', (req, res) => res.json(req.session!['user']))
