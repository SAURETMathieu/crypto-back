export default function formatBlockchain(blockchain: string): string {
  switch (blockchain) {
    case "Ethereum":
      return "0x1";
    case "BSC":
      return "0x38";
    case "Polygon":
      return "0x89";
    case "Avalanche":
      return "0xa86a";
    case "Fantom":
      return "0xfa";
    case "Arbitrum":
      return "0xa4b1";
    case "Cronos":
      return "0x19";
    default:
      return blockchain;
  }
}
