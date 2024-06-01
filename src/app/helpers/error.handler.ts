import { NextFunction, Request, Response } from "express";
import logger from "../logger/index.logger";

interface ErrorWithHttpStatus extends Error {
  httpStatus: number;
}

export default async (
  err: ErrorWithHttpStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!err) {
      next();
    }

    if (err.httpStatus === 500) {
      logger.error("Error 500", err);
      const datas = {
        receiver: process.env.GLOBALCONTACTMAIL as string,
        subject: "Erreur 500 sur le site",
        content: `Le site rencontre des problèmes.
        Détails de l'erreur :\n\n${err.stack}`,
      };
      // const sendSuccess = await mailer(datas);
      // if (!sendSuccess) {
      //   console.error('Erreur lors de l\'envoi de l\'e-mail.');
      // }
    }
    return res.status(err.httpStatus).json({ error: err.message });
  } catch (error) {
    logger.error("Error in error handling middleware", error);
    return res.status(500).json("Erreur lors de la gestion de l'erreur.");
  }
};
