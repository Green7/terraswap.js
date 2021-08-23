//
// TerraSwap types and helper functions
//

import { TokenInfo } from './rest';

export interface Token {
  token: {
    contract_addr: string;
  };
}

export interface NativeToken {
  native_token: {
    denom: string;
  };
}

export type AssetInfo = Token | NativeToken;

export type Asset = {
  info: AssetInfo;
  amount: string;
};

export function isNativeToken(object: AssetInfo): object is NativeToken {
  return 'native_token' in object;
}

export function isToken(object: AssetInfo): object is Token {
  return 'token' in object;
}

export function getContractAddrOrDenom(assetInfo: AssetInfo): string {
  if (isNativeToken(assetInfo)) {
    return assetInfo.native_token.denom;
  }
  return assetInfo.token.contract_addr;
}

export function createAssetInfoForToken(contractAddr: string): AssetInfo {
  return { token: { contract_addr: contractAddr } };
}

export function createAssetInfoForNative(denom: string): AssetInfo {
  return { native_token: { denom } };
}

export function createAssetForToken(contractAddr: string, amount: string): Asset {
  return {
    info: createAssetInfoForToken(contractAddr),
    amount,
  };
}

export function createAssetForNative(denom: string, amount: string): Asset {
  return {
    info: createAssetInfoForNative(denom),
    amount,
  };
}

export function createAssetForTokenInfo(tokenInfo: TokenInfo, amount: string): Asset {
  return tokenInfo?.isNative === true
    ? createAssetForNative(tokenInfo.name, amount)
    : createAssetForToken(tokenInfo.contract_addr, amount);
}

export interface SimulationResponse {
  return_amount: string;
  spread_amount: string;
  commission_amount: string;
}

export interface ReverseSimulationResponse {
  offer_amount: string;
  spread_amount: string;
  commission_amount: string;
}
