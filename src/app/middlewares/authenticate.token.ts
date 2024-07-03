import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/api.error";
import prisma from "../helpers/pg.prisma";
import verifyGoogleToken from "../helpers/verifyGoogleToken";

export default async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    const err = new ApiError(
      "Veuillez vous connecter pour accéder à ce contenu",
      { httpStatus: 401 }
    );
    return next(err);
  }

  const googleAccountVerified: any = await verifyGoogleToken(token);

  if (googleAccountVerified.error) {
    const errorApi = new ApiError("Le token est invalide", { httpStatus: 403 });
    return next(errorApi);
  }

  const currentTimestampInSeconds = Math.floor(Date.now() / 1000);

  if (googleAccountVerified.exp < currentTimestampInSeconds) {
    const errorApi = new ApiError("La session a expiré", { httpStatus: 403 });
    return next(errorApi);
  }

  const userExist = await prisma.user.findFirst({
    where: { email: googleAccountVerified.email },
  });

  if (!userExist) {
    const errorApi = new ApiError("User not found", { httpStatus: 404 });
    return next(errorApi);
  }

  req.user = userExist;
  return next();
}
