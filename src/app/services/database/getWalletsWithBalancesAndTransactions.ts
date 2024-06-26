import prisma from "../../helpers/pg.prisma";
import { Prisma } from '@prisma/client'

export default async function getWalletsWithBalancesAndTransactions(userId: string, walletId?: number) {

  const walletCondition = walletId ? Prisma.sql`AND "Wallet".id = ${walletId}` : Prisma.empty;

  const query = Prisma.sql`
    SELECT
      "Wallet".*,
      COALESCE(json_agg(json_build_object(
      'id', "Balance"."id",
      'asset', "Crypto".asset,
      'cryptoId', "Crypto".id,
      'cryptoName', "Crypto"."name",
      'digit', "Crypto".digit,
      'logo_url', "Crypto".logo_url,
      'currency', "Crypto".currency,
      'nbToken', "Balance"."nbToken",
      'price', "Balance"."price",
      'price1h', "Balance"."price1h",
      'price24h', "Balance"."price24h",
      'timestamp', "Balance"."timestamp",
      'percent', "Balance"."percent",
      'realizedProfit', "Balance"."realizedProfit",
      'unrealizedProfit', "Balance"."unrealizedProfit",
      'balanceUsd', "Balance"."nbToken" * COALESCE("Balance"."price", 0),
      'transactions', COALESCE(transactions_agg.transactions, '[]'::json)
      )) FILTER (WHERE "Balance"."id" IS NOT NULL), '[]'::json) AS "balances"
    FROM "Wallet"
    LEFT JOIN "Balance" ON "Wallet".id = "Balance"."walletId"
    LEFT JOIN "Crypto" ON "Balance"."cryptoId" = "Crypto".id
    LEFT JOIN (
      SELECT
        "Transaction"."cryptoId",
        "Transaction"."walletId",
        json_agg(json_build_object(
          'id', "Transaction".id,
          'idx', "Transaction".idx,
          'cryptoId', "Transaction"."cryptoId",
          'walletId', "Transaction"."walletId",
          'fromAddress', "Transaction"."fromAddress",
          'toAddress', "Transaction"."toAddress",
          'fromLabel', "Transaction"."fromLabel",
          'toLabel', "Transaction"."toLabel",
          'fees', "Transaction"."fees",
          'value', "Transaction"."value",
          'status', "Transaction"."status",
          'type', "Transaction"."type",
          'timestamp', "Transaction"."timestamp",
          'price', "Transaction"."price",
          'blockNumber', "Transaction"."blockNumber"
        )) AS transactions
      FROM "Transaction"
      GROUP BY "Transaction"."cryptoId", "Transaction"."walletId"
    ) AS transactions_agg ON transactions_agg."cryptoId" = "Crypto"."id"
      AND "Wallet".id = transactions_agg."walletId"
    WHERE "Wallet"."userId" = ${userId}
    ${walletCondition}
    GROUP BY "Wallet".id, "Wallet".name;`;

    const result = await prisma.$queryRaw(query);

    return result as any[];
}