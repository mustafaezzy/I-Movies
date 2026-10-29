import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { api } from './api.js';

function Nav() {
  const nav = useNavigate(), name = localStorage.getItem('name');
  const out = () => { localStorage.clear(); nav('/'); location.reload(); };
  return (
    <nav className="navbar navbar-dark bg-dark px-3 mb-4">
      <Link to="/" className="navbar-brand fw-bold">🎬 iMovies</Link>
      <div className="d-flex gap-2 align-items-center text-white">
        {name ? <><Link className="btn btn-sm btn-outline-light" to="/bookings">My Bookings</Link>
          <span>Hi, {name}</span><button className="btn btn-sm btn-danger" onClick={out}>Logout</button></>
          : <><Link className="btn btn-sm btn-outline-light" to="/login">Login</Link>
            <Link className="btn btn-sm btn-primary" to="/register">Register</Link></>}
      </div>
    </nav>
  );
}

function Home() {
  const [movies, setMovies] = useState([]), [q, setQ] = useState('');
  useEffect(() => { api('/movies').then(setMovies); }, []);
  const list = movies.filter(m => (m.title + m.genre).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="container">
      <input className="form-control mb-4" placeholder="Search by title or genre..." value={q} onChange={e => setQ(e.target.value)} />
      <div className="row g-4">
        {list.map(m => (
          <div className="col-6 col-md-4 col-lg-3" key={m._id}>
            <div className="card h-100 shadow-sm">
              <img src={m.poster} className="card-img-top" alt={m.title} />
              <div className="card-body">
                <h5>{m.title}</h5>
                <span className="badge bg-secondary">{m.genre}</span> <small>{m.duration} min</small>
                <Link to={`/movie/${m._id}`} className="btn btn-primary w-100 mt-3">Book Tickets</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const rows = ['A', 'B', 'C', 'D', 'E'], cols = [1, 2, 3, 4, 5, 6, 7, 8];

function Movie() {
  const { id } = useParams(), nav = useNavigate();
  const [movie, setMovie] = useState(null), [show, setShow] = useState(null);
  const [booked, setBooked] = useState([]), [sel, setSel] = useState([]), [msg, setMsg] = useState('');
  useEffect(() => { api('/movies/' + id).then(setMovie); }, [id]);
  useEffect(() => {
    if (!show) return;
    const load = () => api(`/movies/${id}/shows/${show._id}/seats`).then(d => setBooked(d.booked));
    load(); const t = setInterval(load, 4000); // real-time availability
    return () => clearInterval(t);
  }, [show, id]);
  const toggle = s => setSel(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const book = async () => {
    try { await api('/bookings', 'POST', { movieId: id, showId: show._id, seats: sel }); nav('/bookings'); }
    catch (e) { setMsg(e.message); }
  };
  if (!movie) return null;
  return (
    <div className="container">
      <h2>{movie.title}</h2><p className="text-muted">{movie.description}</p>
      <h5>Select showtime</h5>
      <div className="mb-4">{movie.shows.map(s => (
        <button key={s._id} className={`btn me-2 ${show?._id === s._id ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => { setShow(s); setSel([]); }}>{new Date(s.time).toLocaleString()} · ₹{s.price}</button>))}</div>
      {show && <>
        <div className="bg-secondary text-white text-center py-1 mb-3 rounded">SCREEN</div>
        {rows.map(r => <div key={r} className="d-flex justify-content-center gap-2 mb-2">
          {cols.map(c => { const s = r + c, taken = booked.includes(s);
            return <button key={s} disabled={taken} onClick={() => toggle(s)} style={{ width: 44 }}
              className={`btn btn-sm ${taken ? 'btn-secondary' : sel.includes(s) ? 'btn-success' : 'btn-outline-dark'}`}>{s}</button>; })}
        </div>)}
        <p className="text-center mt-3"><small>Grey = booked · Green = your selection</small></p>
        {msg && <div className="alert alert-danger">{msg}</div>}
        <div className="text-center">
          <strong>{sel.length} seat(s) · ₹{sel.length * show.price}</strong>{' '}
          <button className="btn btn-success ms-3" disabled={!sel.length} onClick={book}>Confirm Booking</button>
        </div>
      </>}
    </div>
  );
}

function Auth({ mode }) {
  const nav = useNavigate(), [f, setF] = useState({ name: '', email: '', password: '' }), [err, setErr] = useState('');
  const submit = async e => {
    e.preventDefault();
    try { const d = await api('/auth/' + mode, 'POST', f);
      localStorage.setItem('token', d.token); localStorage.setItem('name', d.name); nav('/'); location.reload();
    } catch (x) { setErr(x.message); }
  };
  const set = k => e => setF({ ...f, [k]: e.target.value });
  return (
    <form className="container" style={{ maxWidth: 400 }} onSubmit={submit}>
      <h3 className="mb-3 text-capitalize">{mode}</h3>
      {err && <div className="alert alert-danger">{err}</div>}
      {mode === 'register' && <input className="form-control mb-3" placeholder="Name" onChange={set('name')} required />}
      <input className="form-control mb-3" type="email" placeholder="Email" onChange={set('email')} required />
      <input className="form-control mb-3" type="password" placeholder="Password" onChange={set('password')} required />
      <button className="btn btn-primary w-100">{mode}</button>
    </form>
  );
}

function Bookings() {
  const [list, setList] = useState([]), nav = useNavigate();
  const load = () => api('/bookings/mine').then(setList).catch(() => nav('/login'));
  useEffect(() => { load(); }, []);
  const cancel = async id => { await api('/bookings/' + id, 'DELETE'); load(); };
  return (
    <div className="container">
      <h3>My Bookings</h3>
      {list.map(b => (
        <div key={b._id} className="card mb-3"><div className="card-body d-flex justify-content-between align-items-center">
          <div><h5>{b.movie?.title}</h5>
            <div>Seats: {b.seats.join(', ')} · ₹{b.total}</div>
            <span className={`badge ${b.status === 'confirmed' ? 'bg-success' : 'bg-secondary'}`}>{b.status}</span></div>
          {b.status === 'confirmed' && <button className="btn btn-outline-danger" onClick={() => cancel(b._id)}>Cancel</button>}
        </div></div>))}
      {!list.length && <p className="text-muted">No bookings yet.</p>}
    </div>
  );
}

export default function App() {
  return <><Nav /><Routes>
    <Route path="/" element={<Home />} /><Route path="/movie/:id" element={<Movie />} />
    <Route path="/login" element={<Auth mode="login" />} /><Route path="/register" element={<Auth mode="register" />} />
    <Route path="/bookings" element={<Bookings />} />
  </Routes></>;
}
