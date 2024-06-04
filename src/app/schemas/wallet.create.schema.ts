import { z } from "zod";
import { exchanges, blockchains } from "../enum/enum";

export const centralizedWalletCreateSchema = z.object({
  name: z
    .string({
      required_error: "Wallet's name is required.",
    })
    .max(30, "Wallet must be at most 30 characters.")
    .min(3, "Wallet must be at least 3 characters."),

  exchange: z
    .enum(exchanges, {
      required_error: "Exchange is required.",
    })
    .refine((val) => val !== undefined, {
      message: "Exchange is required.",
    }),

  key: z
    .string({
      required_error: "API key is required.",
    })
    .max(30, "API key must be at most 30 characters.")
    .min(3, "API key must be at least 3 characters.")
});

export type CentralizedWallet = z.infer<typeof centralizedWalletCreateSchema>;

export const decentralizedWalletCreateSchema = z.object({
  name: z
    .string({
      required_error: "Wallet's name is required.",
    })
    .max(30, "Wallet must be at most 30 characters.")
    .min(3, "Wallet must be at least 3 characters."),

  blockchain: z
  .enum(blockchains, {
    required_error: "Blockchain is required.",
  })
  .refine((val) => val !== undefined, {
    message: "Blockchain is required.",
  }),

  address: z
  .string({
    required_error: "Wallet's address is required.",
  })
  .max(30, "Wallet must be at most 30 characters.")
  .min(3, "Wallet must be at least 3 characters.")
});

export type DecentralizedWallet = z.infer<typeof decentralizedWalletCreateSchema>;


