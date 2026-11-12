import { verifyToken } from '../utils/jwt.js';
import db from '../config/db.js';

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    const { rows } = await db.query(
      'SELECT id, name, email, department, community, hostel, avatar, re_points, level, joined_date, rating, verified_student FROM users WHERE id = $1',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'User belonging to this token no longer exists.' });
    }

    const user = rows[0];
    req.user = {
      ...user,
      rePoints: user.re_points,
      joinedDate: user.joined_date,
      verifiedStudent: Boolean(user.verified_student)
    };

    next();
  } catch (err) {
    return res.status(500).json({ message: 'Authentication error', error: err.message });
  }
}

export async function optionalAuthenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (decoded && decoded.id) {
      const { rows } = await db.query(
        'SELECT id, name, email, department, community, hostel, avatar, re_points, level, joined_date, rating, verified_student FROM users WHERE id = $1',
        [decoded.id]
      );
      if (rows.length > 0) {
        const user = rows[0];
        req.user = {
          ...user,
          rePoints: user.re_points,
          joinedDate: user.joined_date,
          verifiedStudent: Boolean(user.verified_student)
        };
      }
    }
  } catch (err) {
    // Ignore in optional
  }
  next();
}

