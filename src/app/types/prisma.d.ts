import { Wallet, Balance, Transaction } from '@prisma/client';

export type WalletWithBalancesAndTransactions = Wallet & {
  balances: (Balance & {
    balanceUsd: number;
    asset: string;
    cryptoId: number;
    cryptoName: string;
    digit: number;
    logo_url: string;
    currency: string;
    transactions: Transaction[];
  })[];
};