// cost 1 per request => 10000 per month max
// per day max 333

interface requestOptions {
  limit?: number;
  offset?: number;
  from?: number;
  to?: number;
  order?: "asc" | "desc";
  unlisted?: boolean;
}

export async function getTransactions(walletAddress: string, blockchain: string, requestOptions?:requestOptions) {
  try {
    const apiKey = process.env.MOBULA_KEY as string;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    };
    const limit = requestOptions?.limit ?? 1000;
    const from = requestOptions?.from ?? "";
    const to = requestOptions?.to ?? "";
    const order = requestOptions?.order ?? "desc";
    const offset = requestOptions?.offset ?? 0;
    const unlisted = requestOptions?.unlisted ?? false;
    const url = `https://api.mobula.io/api/1/wallet/transactions?wallet=${walletAddress}&blockchains=${blockchain}&limit=${limit}&from=${from}&to=${to}&order=${order}&offset=${offset}&unlisted=${unlisted}`;
    const res = await fetch(
      url,
      options
    );

    const { data } = await res.json();

    if (!res.ok) {
      return null;
    }

    const formattedData = data?.map((transaction: any) => {
      const asset = transaction.asset ?? {};
      return {
        idx: transaction.hash,
        tokenName: asset.name ?? null,
        tokenSymbol: asset.symbol ?? null,
        tokenLogo: asset.logo ?? "/empty-token.svg",
        tokenDecimals: asset.decimals ?? 18,
        tokenAddress: asset.contract ?? null,
        fromAddress: transaction.from,
        fromLabel: null,
        toAddress: transaction.to,
        toLabel: null,
        price: transaction.amount_usd/transaction.amount ?? 0,
        fees: transaction.tx_cost ?? null,
        value: transaction.amount,
        status: 1,
        type: transaction.type,
        timestamp: transaction.timestamp,
        blockNumber: transaction.block_number,
      };
    });

    return formattedData;
  } catch (e) {
    console.error(e);
    return null;
  }
}