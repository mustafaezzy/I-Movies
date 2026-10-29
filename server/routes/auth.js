const r = require('express').Router(), bcrypt = require('bcryptjs'), jwt = require('jsonwebtoken');
const { User } = require('../models');
const sign = u => ({ token: jwt.sign({ id: u._id }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' }), name: u.name });
r.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
  if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already registered' });
  res.json(sign(await User.create({ name, email, password: await bcrypt.hash(password, 10) })));
});
r.post('/login', async (req, res) => {
  const u = await User.findOne({ email: req.body.email });
  if (!u || !(await bcrypt.compare(req.body.password || '', u.password))) return res.status(400).json({ message: 'Invalid credentials' });
  res.json(sign(u));
});
module.exports = r;
