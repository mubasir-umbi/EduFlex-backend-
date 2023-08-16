// import jwt from 'jsonwebtoken';
// import asyncHandler from 'express-async-handler';
// import User from '../models/userModel.js';

// const adminProtect = asyncHandler(async (req, res, next) => {
//   let token;

//   token = req.cookies.jwt;

//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.userId).select('-password');
//        console.log(req.user, 'req userrrrrrrrrrrrrrrrrrr');
//       if (req.user.isAdmin) {
//         next();
//       } else {
//         res.status(403);
//         throw new Error('Not authorized, user is not an admin');
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(401);
//       throw new Error('Not authorized, token failed');
//     }
//   } else {
//     res.status(401);
//     throw new Error('Not authorized, no token');
//   }
// });

// export { adminProtect };
