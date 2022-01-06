import { MsgExecuteContract, Tx, Wallet } from '@terra-money/terra.js';
import {
  ContractAddrAndQuery,
  fabricateQuerySimulation,
  fabricateQuerySimulationBySymbol,
  fabricateReverseQuerySimulation,
  fabricateReverseQuerySimulationBySymbol,
  fabricateSwapBySymbol,
} from './fabricators';
import { Asset, ReverseSimulationResponse, SimulationResponse } from './types';
import { NetworkType } from './rest';
import { PairFinder } from './pairfinder';
import { CreateTxOptions } from '@terra-money/terra.js/dist/client/lcd/api/TxAPI';

export class TerraSwap {
  networkType: NetworkType;
  pairFinder: PairFinder;
  wallet: Wallet;

  constructor(networkType: NetworkType, wallet: Wallet) {
    this.networkType = networkType;
    this.pairFinder = new PairFinder(networkType);
    this.wallet = wallet;
  }

  async getPairsInfo() {
    await this.pairFinder.getPairsInfo();
  }

  fabricateSwapBySymbol(
    symbolFrom: string,
    symbolTo: string,
    amount: string,
    beliefPrice?: string,
    maxSpread?: string,
    to?: string,
  ): MsgExecuteContract {
    return fabricateSwapBySymbol(
      this.wallet.key.accAddress,
      this.pairFinder,
      symbolFrom,
      symbolTo,
      amount,
      beliefPrice,
      maxSpread,
      to,
    );
  }

  fabricateQuerySimulationBySymbol(symbolFrom: string, symbolTo: string, amount: string): ContractAddrAndQuery {
    return fabricateQuerySimulationBySymbol(this.pairFinder, symbolFrom, symbolTo, amount);
  }

  fabricateReverseQuerySimulationBySymbol(symbolFrom: string, symbolTo: string, amount: string): ContractAddrAndQuery {
    return fabricateReverseQuerySimulationBySymbol(this.pairFinder, symbolFrom, symbolTo, amount);
  }

  async querySimulation(pairContractAddr: string, offerAsset: Asset): Promise<SimulationResponse> {
    let response: SimulationResponse;
    response = await this.wallet.lcd.wasm.contractQuery(pairContractAddr, fabricateQuerySimulation(offerAsset));
    return response;
  }

  async querySimulationBySymbol(symbolFrom: string, symbolTo: string, amount: string): Promise<SimulationResponse> {
    const cq = this.fabricateQuerySimulationBySymbol(symbolFrom, symbolTo, amount);
    let response: SimulationResponse;
    response = await this.wallet.lcd.wasm.contractQuery(cq.contractAddr, cq.query);
    return response;
  }

  async queryReverseSimulation(pairContractAddr: string, askAsset: Asset): Promise<ReverseSimulationResponse> {
    let response: ReverseSimulationResponse;
    response = await this.wallet.lcd.wasm.contractQuery(pairContractAddr, fabricateReverseQuerySimulation(askAsset));
    return response;
  }

  async queryReverseSimulationBySymbol(
    symbolFrom: string,
    symbolTo: string,
    amount: string,
  ): Promise<ReverseSimulationResponse> {
    const cq = this.fabricateReverseQuerySimulationBySymbol(symbolFrom, symbolTo, amount);
    let response: ReverseSimulationResponse;
    response = await this.wallet.lcd.wasm.contractQuery(cq.contractAddr, cq.query);
    return response;
  }

  async createSwapBySymbolMsg(
    symbolFrom: string,
    symbolTo: string,
    amount: string,
    options: CreateTxOptions,
  ): Promise<Tx> {
    const msg = this.fabricateSwapBySymbol(symbolFrom, symbolTo, amount);
    options.msgs.push(msg);
    return await this.wallet.createTx(options);
  }

  async createAndSignSwapBySymbolMsg(
    symbolFrom: string,
    symbolTo: string,
    amount: string,
    options: CreateTxOptions,
  ): Promise<Tx> {
    const msg = this.fabricateSwapBySymbol(symbolFrom, symbolTo, amount);
    options.msgs.push(msg);
    return await this.wallet.createAndSignTx(options);
  }
}
