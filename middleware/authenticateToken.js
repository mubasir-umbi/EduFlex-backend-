import jwt from 'jsonwebtoken'
import User from '../models/userModel.js';

async function authenticateToken(req, res, next) {

  // let token;

  // if(req.headers.authorization && req.headers.authorization.startWith("Bearer")){
  //   try {
  //     token = req.headers.authorization.split(" ")[1]

  //     const decoded = jwt.verify(token, process.env.JWT_SECRET)

  //     req.user = await User.findById(decoded.id).select("-password")

  //     next()
  //   } catch (error) {
  //     res.status(401)
  //     throw new Error('Not authorized, token failed')
  //   }
  // }
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
console.log('am from auththhhhhhhhhhhhhhhhhhhhhhhhhhhh');
  if (!token) {
    return res.status(401).json({ error: 'Authentication token not provided.' });
  }

   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.user = user;

    console.log('req.userrrrrrrrrrrrrrrrr', req.user);

    next();
  });
}

export {authenticateToken};
