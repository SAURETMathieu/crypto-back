import { Decimal } from "decimal.js";
import Moralis from "moralis";
import formatBlockchain from "../../utils/formatBlockchain";
import getNativesTokensInfos from "../../utils/getNativesTokensInfos";
//cost 150 per request => 266 per day max

export async function getAllTransactions(
  walletAddress: string,
  blockchain: string
) {
  try {
    if (!Moralis.Core.isStarted) {
      return null;
    }

    const response = await Moralis.EvmApi.wallets.getWalletHistory({
      chain: formatBlockchain(blockchain),
      order: "DESC",
      address: walletAddress,
      includeInternalTransactions: false,
      includeInputData: false,
      nftMetadata: false,
    });

    const tokenInfos = getNativesTokensInfos(blockchain);
    const formattedTransaction = filterAndFormatTransactions(
      response.result,
      tokenInfos,
      walletAddress
    );

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

function formatTransfer(
  transfer: any,
  transaction: any,
  tokenInfos: TokenInfos,
  walletAdress: string
) {
  const logo = transfer?.tokenLogo || "/empty-token.svg";
  const symbol = transfer?.tokenSymbol || tokenInfos.symbol || null;
  const name = transfer?.tokenName || tokenInfos.name || null;
  const decimals = transfer?.tokenDecimals || tokenInfos.decimals || 18;
  const address = transfer?.address?._value || tokenInfos.address;
  const from = transfer?.fromAddress?._value || null;
  const to = transfer?.toAddress?._value || null;
  const value = transfer?.valueFormatted || 0;
  const fromLabel = transfer?.fromAddressLabel || null;
  const toLabel = transfer?.toAddressLabel || null;
  const blockNumber = parseInt(transaction?.blockNumber?.value?.toString());
  const type = (from && walletAdress && from.toLowerCase() === walletAdress.toLowerCase()) ? "sell" : "buy";

  return {
    idx: transaction.hash,
    tokenName: name,
    tokenSymbol: symbol,
    tokenLogo: logo,
    tokenDecimals: decimals,
    tokenAddress: address,
    fromAddress: from,
    toAddress: to,
    fromLabel: fromLabel,
    toLabel: toLabel,
    value: new Decimal(value),
    fees: transaction.transactionFee
      ? new Decimal(transaction.transactionFee)
      : null,
    status: Number(transaction.receiptStatus),
    type,
    timestamp: transaction.blockTimestamp,
    blockNumber: blockNumber,
  };
}

function filterAndFormatTransactions(
  transactions: any,
  tokenInfos: TokenInfos,
  walletAddress: string,
) {
  return transactions
    .filter((transaction: any) => !transaction.possibleSpam)
    .flatMap((transaction: any) => {
      const erc20Transfers = transaction.erc20Transfers.map(
        (erc20Transfer: any) =>
          formatTransfer(erc20Transfer, transaction, tokenInfos, walletAddress)
      );
      const nativeTransfers = transaction.nativeTransfers.map(
        (nativeTransfer: any) =>
          formatTransfer(nativeTransfer, transaction, tokenInfos, walletAddress)
      );
      return [...erc20Transfers, ...nativeTransfers];
    })
    .filter((transaction: any) => transaction !== null);
}
