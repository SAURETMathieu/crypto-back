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
  if (token == null) {
    const err = new ApiError(
      "Veuillez vous connecter pour accéder à ce contenu",
      { httpStatus: 401 }
    );
    return next(err);
  }

  const googleAccountVerfied: any = await verifyGoogleToken(token);

  if (googleAccountVerfied.error) {
    const errorApi = new ApiError("Le token est invalide", { httpStatus: 403 });
    return next(errorApi);
  }

  const currentTimestampInSeconds = Math.floor(Date.now() / 1000);

  if (googleAccountVerfied.exp < currentTimestampInSeconds) {
    const errorApi = new ApiError("La session a expiré", { httpStatus: 403 });
    return next(errorApi);
  }

  const userExist = await prisma.user.findFirst({
    where: { email: googleAccountVerfied.email },
  });

  if (!userExist) {
    const errorApi = new ApiError("User not found", { httpStatus: 404 });
    return next(errorApi);
  }

  req.user = userExist;
  return next();
}
