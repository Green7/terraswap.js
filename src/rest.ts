import axios from 'axios';
import { AssetInfo, getContractAddrOrDenom } from './types';
import {
  AUT,
  CAT,
  CHT,
  CNT,
  EUT,
  GBT,
  HKT,
  INT,
  JPT,
  KRT,
  LUNA,
  MNT,
  SDT,
  SGT,
  THT,
  UAUD,
  UCAD,
  UCHF,
  UCNY,
  UEUR,
  UGBP,
  UHKD,
  UINR,
  UJPY,
  UKRW,
  ULUNA,
  UMNT,
  USDR,
  USGD,
  UST,
  UTHB,
  UUSD,
} from './constants';
import { isBlacklisted } from './constants';

export type NetworkName = 'mainnet' | 'testnet';

// Our Pair info
export interface PairInfo {
  token: TokenInfo[];
  contractAddr: string;
  liquidityToken: string;
}

// TokenInfo from TerraSwap rest API
export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  total_supply: string;
  contract_addr: string;
  isNative?: boolean; // our additional field, not returned by TeraSwap API
}

// Pair from TerraSwap rest API
export interface PairResult {
  liquidity_token: string;
  contract_addr: string;
  asset_infos: AssetInfo[];
}

// Pairs array from TerraSwap rest API
interface PairsResult {
  pairs: PairResult[];
}

function createNativeToken(contractAddr: string, symbol: string, name: string): TokenInfo {
  return {
    name,
    symbol,
    decimals: 6,
    total_supply: '0',
    contract_addr: contractAddr,
    isNative: true,
  };
}

const nativeTokensInfo: Map<string, TokenInfo> = new Map<string, TokenInfo>([
  [LUNA, createNativeToken(ULUNA, LUNA, ULUNA)],
  [LUNA, createNativeToken(ULUNA, LUNA, ULUNA)],
  [KRT, createNativeToken(UKRW, KRT, UKRW)],
  [MNT, createNativeToken(UMNT, MNT, UMNT)],
  [SDT, createNativeToken(USDR, SDT, USDR)],
  [UST, createNativeToken(UUSD, UST, UUSD)],
  [AUT, createNativeToken(UAUD, AUT, UAUD)],
  [CAT, createNativeToken(UCAD, CAT, UCAD)],
  [CHT, createNativeToken(UCHF, CHT, UCHF)],
  [CNT, createNativeToken(UCNY, CNT, UCNY)],
  [EUT, createNativeToken(UEUR, EUT, UEUR)],
  [GBT, createNativeToken(UGBP, GBT, UGBP)],
  [HKT, createNativeToken(UHKD, HKT, UHKD)],
  [INT, createNativeToken(UINR, INT, UINR)],
  [JPT, createNativeToken(UJPY, JPT, UJPY)],
  [SGT, createNativeToken(USGD, SGT, USGD)],
  [THT, createNativeToken(UTHB, THT, UTHB)],
  [ULUNA, createNativeToken(ULUNA, LUNA, ULUNA)],
  [UKRW, createNativeToken(UKRW, KRT, UKRW)],
  [UMNT, createNativeToken(UMNT, MNT, UMNT)],
  [USDR, createNativeToken(USDR, SDT, USDR)],
  [UUSD, createNativeToken(UUSD, UST, UUSD)],
  [UAUD, createNativeToken(UAUD, AUT, UAUD)],
  [UCAD, createNativeToken(UCAD, CAT, UCAD)],
  [UCHF, createNativeToken(UCHF, CHT, UCHF)],
  [UCNY, createNativeToken(UCNY, CNT, UCNY)],
  [UEUR, createNativeToken(UEUR, EUT, UEUR)],
  [UGBP, createNativeToken(UGBP, GBT, UGBP)],
  [UHKD, createNativeToken(UHKD, HKT, UHKD)],
  [UINR, createNativeToken(UINR, INT, UINR)],
  [UJPY, createNativeToken(UJPY, JPT, UJPY)],
  [USGD, createNativeToken(USGD, SGT, USGD)],
  [UTHB, createNativeToken(UTHB, THT, UTHB)],
]);

export function getNetworkServiceURL(networkName: NetworkName): string {
  return networkName === 'mainnet' ? 'https://api.terraswap.io' : 'https://api-tequila.terraswap.io';
}

export async function getTokensInfo(networkName: NetworkName): Promise<Map<string, TokenInfo>> {
  const url = `${getNetworkServiceURL(networkName)}/tokens`;
  const res: TokenInfo[] = (await axios.get(url)).data;

  const result = new Map<string, TokenInfo>(nativeTokensInfo);
  res.forEach((tokenInfo: TokenInfo) => {
    result.set(tokenInfo.contract_addr, tokenInfo);
  });
  return result;
}

export async function getPairs(networkName: NetworkName): Promise<PairResult[]> {
  const url = `${getNetworkServiceURL(networkName)}/pairs`;
  const res: PairsResult = (await axios.get(url)).data;

  const result: PairResult[] = [];
  if (res.pairs.length !== 0) {
    res.pairs
      .filter((pair) => !isBlacklisted(pair?.asset_infos?.[0]) && !isBlacklisted(pair?.asset_infos?.[1]))
      .forEach((pair) => {
        result.push(pair);
      });
  }
  return result;
}

export async function getPairsInfo(networkName: NetworkName): Promise<PairInfo[]> {
  const pairs = await getPairs(networkName);
  const tokens = await getTokensInfo(networkName);

  return pairs
    .map((pairResult: PairResult) => {
      const tokenInfo1 = tokens.get(getContractAddrOrDenom(pairResult.asset_infos[0]));
      const tokenInfo2 = tokens.get(getContractAddrOrDenom(pairResult.asset_infos[1]));
      if (tokenInfo1 === undefined || tokenInfo2 === undefined) {
        return;
      }

      if (
        tokenInfo1?.symbol?.toUpperCase() === 'BLUNA' ||
        tokenInfo2?.symbol?.toUpperCase() === 'BLUNA' ||
        tokenInfo1?.symbol?.toUpperCase() === 'ANC' ||
        tokenInfo2?.symbol?.toUpperCase() === 'ANC'
      ) {
        if (
          !(
            tokenInfo1?.contract_addr === 'terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp' ||
            tokenInfo1?.contract_addr === 'terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76'
          )
        ) {
          return;
        }
        if (tokenInfo1?.symbol === 'BLUNA') {
          tokenInfo1.symbol = 'bLUNA';
        }
        if (tokenInfo2?.symbol === 'BLUNA') {
          tokenInfo2.symbol = 'bLUNA';
        }
      }

      if (tokenInfo1?.symbol === 'BETH') {
        tokenInfo1.symbol = 'bETH';
      }
      if (tokenInfo2?.symbol === 'BETH') {
        tokenInfo2.symbol = 'bETH';
      }

      if (
        networkName === 'mainnet' &&
        tokenInfo1?.symbol === 'MINE' &&
        !(tokenInfo1?.contract_addr === 'terra1kcthelkax4j9x8d3ny6sdag0qmxxynl3qtcrpy')
      ) {
        return;
      }

      if (
        networkName === 'mainnet' &&
        tokenInfo2?.symbol === 'MINE' &&
        !(tokenInfo2?.contract_addr === 'terra1kcthelkax4j9x8d3ny6sdag0qmxxynl3qtcrpy')
      ) {
        return;
      }

      if (
        networkName === 'mainnet' &&
        tokenInfo1?.symbol === 'LOTA' &&
        !(tokenInfo1?.contract_addr === 'terra1ez46kxtulsdv07538fh5ra5xj8l68mu8eg24vr')
      ) {
        return;
      }

      if (
        networkName === 'mainnet' &&
        tokenInfo2?.symbol === 'LOTA' &&
        !(tokenInfo2?.contract_addr === 'terra1ez46kxtulsdv07538fh5ra5xj8l68mu8eg24vr')
      ) {
        return;
      }

      if (
        networkName === 'mainnet' &&
        tokenInfo1?.symbol === 'SPEC' &&
        !(tokenInfo1?.contract_addr === 'terra1s5eczhe0h0jutf46re52x5z4r03c8hupacxmdr')
      ) {
        return;
      }

      if (
        networkName === 'mainnet' &&
        tokenInfo2?.symbol === 'SPEC' &&
        !(tokenInfo2?.contract_addr === 'terra1s5eczhe0h0jutf46re52x5z4r03c8hupacxmdr')
      ) {
        return;
      }

      const pair: PairInfo = {
        contractAddr: pairResult.contract_addr,
        token: [tokenInfo1, tokenInfo2],
        liquidityToken: pairResult.liquidity_token,
      };
      return pair;
    })
    .filter((item): item is PairInfo => !!item);
}
