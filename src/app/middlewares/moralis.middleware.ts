import { NextFunction, Request, Response } from "express";
import Moralis from "moralis";

const moralisMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!Moralis.Core.isStarted) {
      await Moralis.start({
        apiKey: process.env.MORALIS_KEY,
      });
      console.log("Moralis has been initialized.");
    }
    next();
  } catch (e) {
    console.error("Error initializing Moralis:", e);
    res.status(500).send("Internal Server Error");
  }
};

export default moralisMiddleware;
