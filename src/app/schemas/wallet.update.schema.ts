import { z } from "zod";
import { blockchains, exchanges } from "../enum/enum";
import { getRegexForBlockchain } from "../data/addressesRegex";

export const walletUpdateSchema = z.union([
  z.object({
    name: z
      .string()
      .max(30, "Wallet must be at most 30 characters.")
      .min(3, "Wallet must be at least 3 characters."),

    exchange: z.enum(exchanges).optional(),

    key: z
      .string()
      .max(30, "API key must be at most 30 characters.")
      .min(3, "API key must be at least 3 characters.")
      .optional(),
  }),
  z.object({
    name: z
      .string()
      .max(30, "Wallet must be at most 30 characters.")
      .min(3, "Wallet must be at least 3 characters."),

    blockchain: z.enum(blockchains).optional(),

    address: z
      .string()
      .max(44, "Wallet must be at most 44 characters.")
      .min(26, "Wallet must be at least 26 characters.")
      .refine(
        (data:any) => {
          const regex = getRegexForBlockchain(data.blockchain);
          if (!regex) return false;
          return regex.test(data.address);
        },
        {
          message: `This address is invalid for this blockchain.`,
        }
      )
      .optional(),
  }),
]);

export type WalletUpdateSchema = z.infer<typeof walletUpdateSchema>;

