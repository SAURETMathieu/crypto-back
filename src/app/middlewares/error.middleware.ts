import { ErrorRequestHandler, NextFunction, Response } from "express";
import logger from "../logger/index.logger";
// import { sendEmail } from './nodemailer.js';

const errorHandler: ErrorRequestHandler = (
  err,
  _,
  response: Response,
  next: NextFunction
) => {
  try {
    if (!err) {
      return response.status(404).json({ error: "Not found"});
    }
    const statusError = err.httpStatus || 500;

    if (err.httpStatus === 500) {
      logger.error("Error 500", err);
      const destinataire = process.env.MAIL as string;
      const sujet = "Erreur 500 sur le site";
      const contenu = `Le site rencontre des problèmes.
    Détails de l'erreur :\n\n${err.stack}`;

      // const envoiReussi = await sendEmail(destinataire, sujet, contenu);

      // if (!envoiReussi) {
      //   console.error('Erreur lors de l\'envoi de l\'e-mail.');
      // }
    }

    const messageSplited = err.message.split(': ');
    const errorMessage = messageSplited[messageSplited.length - 1];
    return response.status(statusError).json({ error: errorMessage });
  } catch (err: any) {
    logger.error("Error in error handling middleware", err);
    return response.status(500).json("Erreur lors de la gestion de l'erreur.");
  }
};

export default errorHandler;
