import { Coin, Coins, MsgExecuteContract } from '@terra-money/terra.js';
import { Asset, createAssetForTokenInfo, getContractAddrOrDenom, isNativeToken } from './types';
import { getTokenFromPair, IPairFinder } from './pairfinder';

export interface ContractAddrAndQuery {
  contractAddr: string;
  query: object;
}

export const createHookMsg = (msg: object): string =>
  Buffer.from(JSON.stringify(msg)).toString('base64');

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

export function fabricateSwapFromNative(
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

export function fabricateSwapFromToken(
  accAddr: string,
  pairAddr: string,
  tokenAddr: string,
  offerAsset: Asset,
  beliefPrice?: string,
  maxSpread?: string,
  to?: string,
): MsgExecuteContract {
  return new MsgExecuteContract(accAddr, tokenAddr, {
    send: {
      contract: pairAddr,
      amount: offerAsset.amount,
      msg: createHookMsg({
        swap: {
          belief_price: beliefPrice,
          max_spread: maxSpread,
          to,
        },
      }),
    },
  });
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
  const offerAsset = createAssetForTokenInfo(tokenInfo, amount);

  return isNativeToken(offerAsset.info) ? fabricateSwapFromNative(accAddr, pair.contractAddr, offerAsset, beliefPrice, maxSpread, to) :
    fabricateSwapFromToken(accAddr, pair.contractAddr, tokenInfo.contract_addr, offerAsset, beliefPrice, maxSpread, to);
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
