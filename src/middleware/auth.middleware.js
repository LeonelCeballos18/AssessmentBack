import jwt from 'jsonwebtoken';

export function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function isAdmin(req, res, next) {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ message: 'Admin only' });
  next();
}
