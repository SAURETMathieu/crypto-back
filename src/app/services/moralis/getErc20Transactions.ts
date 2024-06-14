import Moralis from 'moralis';

//cost 50 per request => 800 per day max

export async function getErc20Transactions(walletAddress: string, blockchain: string) {
  try {
    if (!Moralis.Core.isStarted) {
      return null;
    }

    const response = await Moralis.EvmApi.token.getWalletTokenTransfers({
      "chain": "0x1",
      "order": "DESC",
      // "fromDate": "12/14/18",
      // "toDate": "14/12/24",
      "address": walletAddress
    });
    const formattedTransaction = filterAndFormatTransactions(response.result);

    return formattedTransaction;
  } catch (e) {
    console.error(e);
    return null;
  }
}

function filterAndFormatTransactions(transactions:any) {

  const transactionsWithoutSpam = transactions?.filter((transaction:any) => !transaction._data.possibleSpam);

  const formattedTransaction = transactionsWithoutSpam?.map((transaction:any) => {
      return {
        idx: transaction._data.transactionHash,
        tokenName: transaction._data.tokenName,
        tokenSymbol: transaction._data.tokenSymbol,
        tokenLogo: transaction._data.tokenLogo,
        fromAddress: transaction._data.fromAddress._value,
        fromLabel: transaction._data.fromAddressLabel,
        toAddress: transaction._data.toAddress._value,
        toLabel: transaction._data.toAddressLabel,
        value: transaction._data.valueDecimal,
        transactionFees: null,
        timestamp: transaction._data.blockTimestamp,
      };
    });

    return formattedTransaction;
}
