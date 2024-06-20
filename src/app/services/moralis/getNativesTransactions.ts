import Moralis from "moralis";
import formatBlockchain from '../../utils/formatBlockchain';
//cost 30 per request => 800 per day max

export async function getNativesTransactions(
  walletAddress: string,
  blockchain: string
) {
  try {
    if (!Moralis.Core.isStarted) {
      return null;
    }

    const response = await Moralis.EvmApi.transaction.getWalletTransactions({
      chain: formatBlockchain(blockchain),
      order: "DESC",
      // "fromDate": "12/14/18",
      // "toDate": "14/12/24",
      address: walletAddress,
    });

    const formattedTransaction = filterAndFormatTransactions(
      response.result,
      walletAddress
    );
    return formattedTransaction;
  } catch (e) {
    console.error(e);
    return null;
  }
}

function filterAndFormatTransactions(transactions: any, walletAddress: string) {
  const transactionsWithoutSpam = transactions?.filter(
    (transaction: any) => !transaction._data.possibleSpam
  );

  const formattedTransaction = transactionsWithoutSpam?.map(
    (transaction: any) => {
      let transactionFees = 0;
      if (
        transaction._data.from._value === walletAddress &&
        transaction._data.to._value !== walletAddress
      ) {
        transactionFees =
          (transaction._data.gasPrice * transaction._data.gasUsed) /
          Math.pow(10, 18);
      }
      return {
        idx: transaction._data.hash,
        tokenName: "Ethereum",
        tokenSymbol: "ETH",
        tokenLogo: "eth",
        fromAddress: transaction._data.from._value,
        fromLabel: null,
        toAddress: transaction._data.to._value,
        toLabel: null,
        value: Number(transaction._data.value.rawValue.value) / Math.pow(10, 18),
        status: transaction._data.receiptStatus,
        transactionFees: transactionFees,
        timestamp: transaction._data.blockTimestamp,
      };
    }
  );

  return formattedTransaction;
}
