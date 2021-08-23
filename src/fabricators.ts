import { Coin, Coins, MsgExecuteContract } from '@terra-money/terra.js';
import { Asset, createAssetForTokenInfo, getContractAddrOrDenom } from './types';
import { getTokenFromPair, IPairFinder } from './pairFinder';

export interface ContractAddrAndQuery {
  contractAddr: string;
  query: object;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function fabricateQuerySimulation(offerAsset: Asset): object {
  return {
    simulation: {
      offer_asset: offerAsset,
    },
  };
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function fabricateReverseQuerySimulation(askAsset: Asset): object {
  return {
    reverse_simulation: {
      ask_asset: askAsset,
    },
  };
}

export function fabricateSwap(
  accAddr: string,
  pairAddr: string,
  offerAsset: Asset,
  beliefPrice?: string,
  maxSpread?: string,
  to?: string,
): MsgExecuteContract {
  const coins = new Coins([new Coin(getContractAddrOrDenom(offerAsset.info), offerAsset.amount)]);
  return new MsgExecuteContract(
    accAddr,
    pairAddr,
    {
      swap: {
        offer_asset: offerAsset,
        belief_price: beliefPrice,
        max_spread: maxSpread,
        to,
      },
    },
    coins,
  );
}

export function fabricateSwapBySymbol(
  accAddr: string,
  pairFinder: IPairFinder,
  symbolFrom: string,
  symbolTo: string,
  amount: string,
  beliefPrice?: string,
  maxSpread?: string,
  to?: string,
): MsgExecuteContract {
  const pair = pairFinder.getPair(symbolFrom, symbolTo);
  const tokenInfo = getTokenFromPair(pair, symbolFrom);
  return fabricateSwap(
    accAddr,
    pair.contractAddr,
    createAssetForTokenInfo(tokenInfo, amount),
    beliefPrice,
    maxSpread,
    to,
  );
}

export function fabricateQuerySimulationBySymbol(
  pairFinder: IPairFinder,
  symbolFrom: string,
  symbolTo: string,
  amount: string,
): ContractAddrAndQuery {
  const pair = pairFinder.getPair(symbolFrom, symbolTo);
  const tokenInfo = getTokenFromPair(pair, symbolFrom);
  return {
    contractAddr: pair.contractAddr,
    query: fabricateQuerySimulation(createAssetForTokenInfo(tokenInfo, amount)),
  };
}

export function fabricateReverseQuerySimulationBySymbol(
  pairFinder: IPairFinder,
  symbolFrom: string,
  symbolTo: string,
  amount: string,
): ContractAddrAndQuery {
  const pair = pairFinder.getPair(symbolFrom, symbolTo);
  const tokenInfo = getTokenFromPair(pair, symbolTo);
  return {
    contractAddr: pair.contractAddr,
    query: fabricateReverseQuerySimulation(createAssetForTokenInfo(tokenInfo, amount)),
  };
}
