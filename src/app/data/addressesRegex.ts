export const ethereumAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
export const bscAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
export const btcAddressRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
export const maticAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
export const avaxAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
export const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{44}$/;

export const getRegexForBlockchain = (blockchain: string | undefined): RegExp | null => {
  switch (blockchain) {
    case "Ethereum":
    case "BSC":
    case "Avalanche":
    case "Polygon":
      return ethereumAddressRegex;
    case "Bitcoin":
      return btcAddressRegex;
    case "Solana":
      return solanaAddressRegex;
    default:
      return null;
  }
};