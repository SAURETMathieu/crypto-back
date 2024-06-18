import Moralis from 'moralis';
import {Decimal} from 'decimal.js';
//cost 150 per request => 266 per day max

export async function getAllTransactions(walletAddress: string, blockchain: string) {
  try {
    if (!Moralis.Core.isStarted) {
      return null;
    }

    const response = await Moralis.EvmApi.wallets.getWalletHistory({
      "chain": "0x1",
      "order": "DESC",
      "address": walletAddress,
      "includeInternalTransactions": false,
      "includeInputData": false,
      "nftMetadata": false,
    });
    const formattedTransaction = filterAndFormatTransactions(response.result);

    return formattedTransaction;
  } catch (e) {
    console.error(e);
    return null;
  }
}

function filterAndFormatTransactions(transactions:any) {
  return transactions
    .filter((transaction:any) => !transaction.possibleSpam)
    .map((transaction:any) => {
      const erc20Transfer = transaction.erc20Transfers.length > 0 ? transaction.erc20Transfers[0] : null;

      const nativeTransfer = transaction.nativeTransfers.length > 0 ? transaction.nativeTransfers[0] : null;

      const logo = (erc20Transfer && erc20Transfer.tokenLogo) || (nativeTransfer && nativeTransfer.tokenLogo) || null;
      const symbol = (erc20Transfer && erc20Transfer.tokenSymbol) || (nativeTransfer && nativeTransfer.tokenSymbol) || null;
      const name = (erc20Transfer && erc20Transfer.tokenName) || "Ethereum";
      const decimals = (erc20Transfer && erc20Transfer.tokenDecimals) || 18;
      const address = (erc20Transfer && erc20Transfer.address._value) || "0xae7ab96520de3a18e5e111b5eaab095312d7fe84";
      const from = (erc20Transfer && erc20Transfer.fromAddress._value) || (nativeTransfer && nativeTransfer.fromAddress._value) || null;
      const to = (erc20Transfer && erc20Transfer.toAddress._value) || (nativeTransfer && nativeTransfer.toAddress._value) || null;
      const value = (erc20Transfer && erc20Transfer.valueFormatted) || (nativeTransfer && nativeTransfer.valueFormatted) || null;
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
    });
}
