import prisma from "../../helpers/pg.prisma";
import { Prisma } from '@prisma/client'

export default async function getWalletsWithBalancesAndTransactions(userId: string) {

  const query = Prisma.sql`
    SELECT
      "Wallet".*,
      json_agg(json_build_object(
      'id', "Balance"."id",
      'asset', "Crypto".asset,
      'cryptoId', "Crypto".id,
      'cryptoName', "Crypto"."name",
      'digit', "Crypto".digit,
      'logo_url', "Crypto".logo_url,
      'currency', "Crypto".currency,
      'nbToken', "Balance"."nbToken",
      'price', "Balance"."price",
      'price24h', "Balance"."price24h",
      'timestamp', "Balance"."timestamp",
      'percent', "Balance"."percent",
      'transactions', COALESCE(transactions_agg.transactions, '[]'::json)
      )) AS "balances"
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
          'price', "Transaction"."price"
        )) AS transactions
      FROM "Transaction"
      GROUP BY "Transaction"."cryptoId", "Transaction"."walletId"
    ) AS transactions_agg ON transactions_agg."cryptoId" = "Crypto"."id"
      AND "Wallet".id = transactions_agg."walletId"
    WHERE "Wallet"."userId" = ${userId}
    GROUP BY "Wallet".id, "Wallet".name;`;

    const result = await prisma.$queryRaw(query);

    return result as any[];
}