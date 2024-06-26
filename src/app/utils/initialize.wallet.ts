const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export async function createWalletWithBalancesAndTransactions(
  walletData: any,
  walletTokensBalances: any,
  transactions: any
) {
  let createdWallet;
  let createdBalances: any[] = [];
  let createdTransactions: any[] = [];

  try {
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    let lastTransationTimestamp = transactions[transactions.length - 1]?.timestamp;
    if (!iso8601Regex.test(lastTransationTimestamp)) {
      lastTransationTimestamp = new Date();
    }else{
      lastTransationTimestamp = new Date(transactions[transactions.length - 1]?.timestamp);
    }
    lastTransationTimestamp.setSeconds(lastTransationTimestamp.getSeconds() + 1);
    const newIsoDate = lastTransationTimestamp.toISOString();
    walletData.lastTransaction = newIsoDate;

    await prisma.$transaction(async (prismaClient: any) => {
      createdWallet = await prismaClient.wallet.create({
        data: walletData,
      });

      const cryptoCache: { [symbol: string]: any } = {};

      for (const tokenBalance of walletTokensBalances) {
        let crypto = cryptoCache[tokenBalance.symbol];

        if (!crypto) {
          crypto = await prismaClient.crypto.findUnique({
            where: { asset: tokenBalance.symbol },
          });

          if (!crypto) {
            crypto = await prismaClient.crypto.create({
              data: {
                asset: tokenBalance.symbol,
                name: tokenBalance.name,
                digit: tokenBalance.decimals,
                logo_url: tokenBalance.logo,
              },
            });
          }

          cryptoCache[tokenBalance.symbol] = crypto;
        }

        const balance = await prismaClient.balance.create({
          data: {
            walletId: createdWallet.id,
            cryptoId: crypto.id,
            nbToken: tokenBalance.balance ?? 0,
            price: tokenBalance.usdPrice ?? null,
            price1h: tokenBalance.usdPrice1h ?? null,
            price24h: tokenBalance.usdPrice24h ?? null,
            percent: tokenBalance.portfolioPercentage ?? 0,
            timestamp: new Date(),
            realizedProfit: tokenBalance.realizedProfit ?? null,
            unrealizedProfit: tokenBalance.unrealizedProfit ?? null,
          },
        });

        createdBalances.push(balance);
      }

      for (const transaction of transactions) {
        let crypto = cryptoCache[transaction.tokenSymbol];

        if (!crypto) {
          crypto = await prismaClient.crypto.findUnique({
            where: { asset: transaction.tokenSymbol },
          });

          if (!crypto) {
            crypto = await prismaClient.crypto.create({
              data: {
                asset: transaction.tokenSymbol,
                name: transaction.tokenName,
                digit: transaction.tokenDecimals,
                logo_url: transaction.tokenLogo,
              },
            });
          }

          cryptoCache[transaction.tokenSymbol] = crypto;
        }

        const createdTransaction = await prismaClient.transaction.create({
          data: {
            idx: transaction.idx,
            fromAddress: transaction.fromAddress,
            toAddress: transaction.toAddress,
            fromLabel: transaction.fromLabel,
            toLabel: transaction.toLabel,
            fees: transaction.fees ?? 0,
            value: transaction.value ?? 0,
            status: transaction.status,
            type: transaction.type,
            timestamp: transaction.timestamp,
            blockNumber: transaction.blockNumber,
            price: transaction.tokenPrice ?? 0,
            cryptoId: crypto.id,
            walletId: createdWallet.id,
          },
        });

        createdTransactions.push(createdTransaction);
      }
    });

    return createdWallet;
  } catch (error) {
    console.error(
      "Error creating wallet with balances and transactions:",
      error
    );
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}