export default function getNativesTokensInfos(blockchain: string) {
  switch (blockchain) {
    case "Ethereum":
      return {
        name: "Ethereum",
        symbol: "ETH",
        address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        decimals: 18,
      };
    case "BSC":
      return {
        name: "Binance Coin",
        symbol: "BNB",
        address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
        decimals: 18,
      };
    case "Polygon":
      return {
        name: "Polygon",
        symbol: "MATIC",
        address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
        decimals: 18,
      };
    case "Avalanche":
      return {
        name: "Avalanche",
        symbol: "AVAX",
        address: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
        decimals: 18,
      };
    case "Fantom":
      return {
        name: "Fantom",
        symbol: "FTM",
        address: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
        decimals: 18,
      };
    case "Arbitrum":
      return {
        name: "Ethereum",
        symbol: "ETH",
        address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
        decimals: 18,
      };
    case "Cronos":
      return {
        name: "Cronos",
        symbol: "CRO",
        address: "0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23",
        decimals: 18,
      };
    default:
      return {
        name: "Ethereum",
        symbol: "ETH",
        address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        decimals: 18,
      };
  }
}
