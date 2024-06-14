import Moralis from 'moralis';

//cost 500 per request => 80 per day max

export async function getAllTransactions(walletAddress: string, blockchain: string) {
  try {
    if (!Moralis.Core.isStarted) {
      return null;
    }

    const response = await Moralis.EvmApi.transaction.getWalletTransactions({
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
  return transactions
    .filter((transaction:any) => !transaction.possibleSpam)
    .map((transaction:any) => {
      const nftTransfers = transaction.nftTransfers.map((nftTransfer:any) => ({
        token_address: nftTransfer.token_address,
        token_id: nftTransfer.token_id,
        from_address: nftTransfer.from_address,
        from_address_label: nftTransfer.from_address_label,
        to_address: nftTransfer.to_address,
        to_address_label: nftTransfer.to_address_label,
        value: nftTransfer.value,
        amount: nftTransfer.amount,
        contract_type: nftTransfer.contract_type,
        block_number: nftTransfer.block_number,
        block_timestamp: nftTransfer.block_timestamp,
        block_hash: nftTransfer.block_hash,
        transaction_hash: nftTransfer.transaction_hash,
        transaction_type: nftTransfer.transaction_type,
        transaction_index: nftTransfer.transaction_index,
        log_index: nftTransfer.log_index,
        operator: nftTransfer.operator,
        possible_spam: nftTransfer.possible_spam,
        verified_collection: nftTransfer.verified_collection
      }));

      const erc20Transfers = transaction.erc20Transfers.map((erc20Transfer:any) => ({
        token_name: erc20Transfer.token_name,
        token_symbol: erc20Transfer.token_symbol,
        token_logo: erc20Transfer.token_logo,
        token_decimals: erc20Transfer.token_decimals,
        address: erc20Transfer.address,
        to_address: erc20Transfer.to_address,
        to_address_label: erc20Transfer.to_address_label,
        from_address: erc20Transfer.from_address,
        from_address_label: erc20Transfer.from_address_label,
        value: erc20Transfer.value,
        block_timestamp: erc20Transfer.block_timestamp,
        block_number: erc20Transfer.block_number,
        block_hash: erc20Transfer.block_hash,
        transaction_hash: erc20Transfer.transaction_hash,
        transaction_index: erc20Transfer.transaction_index,
        log_index: erc20Transfer.log_index,
        possible_spam: erc20Transfer.possible_spam,
        verified_contract: erc20Transfer.verified_contract
      }));

      const nativeTransfers = transaction.nativeTransfers.map((nativeTransfer:any) => ({
        from_address: nativeTransfer.from_address,
        from_address_label: nativeTransfer.from_address_label,
        to_address: nativeTransfer.to_address,
        to_address_label: nativeTransfer.to_address_label,
        value: nativeTransfer.value,
        value_formatted: nativeTransfer.value_formatted,
        direction: nativeTransfer.direction,
        internal_transaction: nativeTransfer.internal_transaction,
        token_symbol: nativeTransfer.token_symbol,
        token_logo: nativeTransfer.token_logo
      }));

      return {
        hash: transaction.hash,
        fromAddress: transaction.fromAddress._value,
        toAddress: transaction.toAddress._value,
        value: transaction.value,
        transactionFee: transaction.transactionFee,
        receiptStatus: transaction.receiptStatus,
        internalTransactions: transaction.internalTransactions,
        category: transaction.category,
        summary: transaction.summary,
        nftTransfers: nftTransfers,
        erc20Transfers: erc20Transfers,
        nativeTransfers: nativeTransfers
      };
    });
}
