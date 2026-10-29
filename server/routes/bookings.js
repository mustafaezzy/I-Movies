const r = require('express').Router(), auth = require('../auth');
const { Movie, Booking } = require('../models');
r.post('/', auth, async (req, res) => {
  const { movieId, showId, seats } = req.body;
  const movie = await Movie.findById(movieId), show = movie && movie.shows.id(showId);
  if (!show || !seats?.length) return res.status(400).json({ message: 'Invalid booking' });
  const taken = (await Booking.find({ movie: movieId, showId, status: 'confirmed' })).flatMap(b => b.seats);
  const clash = seats.filter(s => taken.includes(s));
  if (clash.length) return res.status(409).json({ message: `Already booked: ${clash.join(', ')}` });
  res.json(await Booking.create({ user: req.userId, movie: movieId, showId, seats, total: seats.length * show.price }));
});
r.get('/mine', auth, async (req, res) => res.json(await Booking.find({ user: req.userId }).populate('movie').sort('-createdAt')));
r.delete('/:id', auth, async (req, res) => {
  const b = await Booking.findOneAndUpdate({ _id: req.params.id, user: req.userId }, { status: 'cancelled' }, { new: true });
  b ? res.json(b) : res.status(404).json({ message: 'Not found' });
});
module.exports = r;
