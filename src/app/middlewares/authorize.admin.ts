// import { NextFunction } from 'express';
// import ApiError from '../errors/api.error.js';

// // Middleware to verify if the user is an admin
// function authorizeAdmin(request: Request, response: Response, next: NextFunction) {
//   // Check if the user is authenticated and if their information is available in the req object
//   const { user } = request;

//   // Check if the user has an admin role
//   if (user && user.role === 'admin') {
//     // User is an admin, proceed to the next middleware
//     return next();
//   }
//   // User is not an admin
//   const errorApi = new ApiError(
//     'Acces interdit, vous n\'êtes pas un administrateur',
//     { httpStatus: 403 },
//   );
//   return next(errorApi); // forbidden access, must be an admin
// }

// export default authorizeAdmin;
