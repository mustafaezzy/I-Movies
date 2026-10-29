const r = require('express').Router();
const { Movie, Booking } = require('../models');
r.get('/', async (req, res) => res.json(await Movie.find()));
r.get('/:id', async (req, res) => res.json(await Movie.findById(req.params.id)));
r.get('/:id/shows/:showId/seats', async (req, res) => {
  const b = await Booking.find({ movie: req.params.id, showId: req.params.showId, status: 'confirmed' });
  res.json({ booked: b.flatMap(x => x.seats) });
});
module.exports = r;
