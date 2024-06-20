import Moralis from 'moralis';
import {Decimal} from 'decimal.js';
import formatBlockchain from '../../utils/formatBlockchain';
import getNativesTokensInfos from '../../utils/getNativesTokensInfos';
//cost 150 per request => 266 per day max

export async function getAllTransactions(walletAddress: string, blockchain: string) {
  try {
    if (!Moralis.Core.isStarted) {
      return null;
    }

    const response = await Moralis.EvmApi.wallets.getWalletHistory({
      "chain": formatBlockchain(blockchain),
      "order": "DESC",
      "address": walletAddress,
      "includeInternalTransactions": false,
      "includeInputData": false,
      "nftMetadata": false,
    });

    const tokenInfos = getNativesTokensInfos(blockchain);
    const formattedTransaction = filterAndFormatTransactions(response.result, tokenInfos);

    return formattedTransaction;
  } catch (e) {
    console.error(e);
    return null;
  }
}

interface TokenInfos {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
}

function filterAndFormatTransactions(transactions:any, tokenInfos:TokenInfos) {
  return transactions
    .filter((transaction:any) => !transaction.possibleSpam)
    .map((transaction:any) => {
      const erc20Transfer = transaction.erc20Transfers.length > 0 ? transaction.erc20Transfers[0] : null;
      const nativeTransfer = transaction.nativeTransfers.length > 0 ? transaction.nativeTransfers[0] : null;

      if (!erc20Transfer && !nativeTransfer) {
        return null;
      }

      //TODO add swap cases

      const logo = (erc20Transfer && erc20Transfer.tokenLogo) || (nativeTransfer && nativeTransfer.tokenLogo) || "/empty-token.svg";
      const symbol = (erc20Transfer && erc20Transfer.tokenSymbol) || tokenInfos.symbol || null;
      const name = (erc20Transfer && erc20Transfer.tokenName) || tokenInfos.name || null;
      const decimals = (erc20Transfer && erc20Transfer.tokenDecimals) || tokenInfos.decimals || 18;
      const address = (erc20Transfer && erc20Transfer.address._value) || tokenInfos.address;
      const from = (erc20Transfer && erc20Transfer.fromAddress._value) || (nativeTransfer && nativeTransfer.fromAddress._value) || null;
      const to = (erc20Transfer && erc20Transfer.toAddress._value) || (nativeTransfer && nativeTransfer.toAddress._value) || null;
      const value = (erc20Transfer && erc20Transfer.valueFormatted) || (nativeTransfer && nativeTransfer.valueFormatted) || 0;
      const fromLabel = (erc20Transfer && erc20Transfer.fromAddressLabel) || (nativeTransfer && nativeTransfer.fromAddressLabel) || null;
      const toLabel = (erc20Transfer && erc20Transfer.toAddressLabel) || (nativeTransfer && nativeTransfer.toAddressLabel) || null;
      const blockNumber = transaction.blockNumber.value.toString();

      return {
        idx: transaction.hash,
        tokenName: name,
        tokenSymbol: symbol,
        tokenLogo: logo,
        tokenDecimals: decimals,
        tokenAddress: address,
        fromAddress: from,
        toAddress: to,
        value: new Decimal(value),
        fromLabel: fromLabel,
        toLabel: toLabel,
        fees: transaction.transactionFee ? new Decimal(transaction.transactionFee) : null,
        status: Number(transaction.receiptStatus),
        type: transaction.category,
        timestamp: transaction.blockTimestamp,
        blockNumber: blockNumber,
      };
    })
    .filter((transaction:any) => transaction !== null);
}
