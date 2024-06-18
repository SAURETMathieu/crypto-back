import {
  EvmTokenPriceItem,
  EvmTokenPriceItemInput,
} from "@moralisweb3/common-evm-utils";
import Moralis from "moralis";

//cost 100 per request => 400 per day max

export async function getTokensPrices(
  tokens: EvmTokenPriceItemInput[] | EvmTokenPriceItem[],
  blockchain: string
) {
  try {
    if (!Moralis.Core.isStarted) {
      return null;
    }

    const response = await Moralis.EvmApi.token.getMultipleTokenPrices(
      {
        chain: "0x1",
      },
      {
        tokens,
      }
    );

    //console.log(response.result);
    return response.result;
  } catch (e) {
    console.error(e);
    return null;
  }
}
