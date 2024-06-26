import { z } from "zod";

export const walletUpdateSchema = z.object({
  name: z
    .string()
    .max(30, "Wallet must be at most 30 characters.")
    .min(3, "Wallet must be at least 3 characters."),
});

export type WalletUpdateSchema = z.infer<typeof walletUpdateSchema>;
