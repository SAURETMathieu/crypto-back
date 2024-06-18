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
    await prisma.$transaction(async (prismaClient: any) => {
      createdWallet = await prismaClient.wallet.create({
        data: walletData,
      });

      for (const tokenBalance of walletTokensBalances) {
        let crypto = await prismaClient.crypto.findUnique({
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

        const balance = await prismaClient.balance.create({
          data: {
            walletId: createdWallet.id,
            cryptoId: crypto.id,
            nbToken: tokenBalance.balance,
            price: tokenBalance.usdPrice,
            price24h: tokenBalance.usdPrice24h,
            percent: tokenBalance.portfolioPercentage,
            timestamp: new Date(),
          },
        });

        createdBalances.push(balance);
      }

      for (const transaction of transactions) {
        let crypto = await prismaClient.crypto.findUnique({
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
        const createdTransaction = await prismaClient.transaction.create({
          data: {
            idx: transaction.idx,
            fromAddress: transaction.fromAddress,
            toAddress: transaction.toAddress,
            fromLabel: transaction.fromLabel,
            toLabel: transaction.toLabel,
            price: transaction.tokenPrice,
            fees: transaction.fees,
            value: transaction.value,
            status: transaction.status,
            type: transaction.type,
            timestamp: transaction.timestamp,
            cryptoId: crypto.id,
            walletId: createdWallet.id,
          },
        });

        createdTransactions.push(createdTransaction);
      }
    });

    return {
      newWallet: createdWallet,
      newBalances: createdBalances,
      newTransactions: createdTransactions,
    };
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
