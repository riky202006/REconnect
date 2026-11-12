import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/index.js';

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

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User belonging to this token no longer exists.' });
    }

    req.user = {
      id: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      department: user.department,
      community: user.community,
      hostel: user.hostel,
      avatar: user.avatar,
      rePoints: user.rePoints,
      re_points: user.rePoints,
      level: user.level,
      joinedDate: user.joinedDate,
      joined_date: user.joinedDate,
      rating: user.rating,
      verifiedStudent: Boolean(user.verifiedStudent),
      verified_student: Boolean(user.verifiedStudent)
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
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          department: user.department,
          community: user.community,
          hostel: user.hostel,
          avatar: user.avatar,
          rePoints: user.rePoints,
          re_points: user.rePoints,
          level: user.level,
          joinedDate: user.joinedDate,
          joined_date: user.joinedDate,
          rating: user.rating,
          verifiedStudent: Boolean(user.verifiedStudent),
          verified_student: Boolean(user.verifiedStudent)
        };
      }
    }
  } catch {
    // Ignore in optional authentication
  }
  next();
}
