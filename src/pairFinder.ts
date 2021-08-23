import { getPairsInfo, NetworkName, PairInfo, TokenInfo } from './rest';

export interface IPairFinder {
  // finds PairInfo for swap between symbol1 and symbol2 or throw
  getPair(symbol1: string, symbol2: string): PairInfo;
}

export class PairFinder implements IPairFinder {
  pairs: PairInfo[];
  private readonly networkName: NetworkName;

  constructor(networkName: NetworkName) {
    this.networkName = networkName;
    this.pairs = [];
  }

  async getPairsInfo() {
    this.pairs = await getPairsInfo(this.networkName);
  }

  getPair(symbol1: string, symbol2: string): PairInfo {
    for (const pair of this.pairs) {
      if (
        (pair.token[0].symbol === symbol1 && pair.token[1].symbol === symbol2) ||
        (pair.token[1].symbol === symbol1 && pair.token[0].symbol === symbol2)
      ) {
        return pair;
      }
    }
    throw new Error(`Can't find pair for symbols: ${symbol1},${symbol2}`);
  }
}

export function getTokenFromPair(pair: PairInfo, symbol: string): TokenInfo {
  for (const token of pair.token) {
    if (token.symbol === symbol) {
      return token;
    }
  }
  throw new Error(`Symbol: ${symbol} not found in pair: ${pair}`);
}
