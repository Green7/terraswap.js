import { isTxError, LCDClient, MnemonicKey, Wallet } from '@terra-money/terra.js';
import { TerraSwap } from '../terraswap';
import { LUNA, UST } from '../constants';
import { bLUNA } from '../../dist';

const lcdConfig = {
  URL: 'https://bombay-lcd.terra.dev',
  chainID: 'bombay-12',
  gasPrices: {
    uluna: 0.15,
  },
  gasAdjustment: 1.4,
};

const lcdClient: LCDClient = new LCDClient(lcdConfig);
let wallet: Wallet;
let terraSwap: TerraSwap;

beforeAll(async () => {
  require('dotenv').config();
  wallet = new Wallet(
    lcdClient,
    new MnemonicKey({
      mnemonic: process.env.MNEMONIC,
    }),
  );
  terraSwap = new TerraSwap('testnet', wallet);
  await terraSwap.getPairsInfo();
});

test('TerraSwap querySimulation LUNA TO UST', async () => {
  const res = await terraSwap.querySimulationBySymbol(LUNA, UST, '1000');
  expect(res).toBeDefined();
  expect(res).toHaveProperty('return_amount');
  expect(res).toHaveProperty('spread_amount');
  expect(res).toHaveProperty('commission_amount');
});

// Todo: queryReverseSimulationBySymbol returns TooSmallOfferAmount on bombay testnet
// test('TerraSwap queryReverseSimulation LUNA TO UST', async () => {
//     const res = await terraSwap.queryReverseSimulationBySymbol(LUNA, UST, '1000');
//     expect(res).toBeDefined();
//     expect(res).toHaveProperty('offer_amount');
//     expect(res).toHaveProperty('spread_amount');
//     expect(res).toHaveProperty('commission_amount');
// });

test('TerraSwap swap LUNA TO UST', async () => {
  const tx = await terraSwap.createAndSignSwapBySymbolMsg(LUNA, UST, '1000', {
    msgs: [],
    memo: 'test LUNA to UST',
    gasAdjustment: lcdConfig.gasAdjustment,
    gasPrices: lcdConfig.gasPrices,
  });
  expect(tx).toBeDefined();
  const res = await lcdClient.tx.broadcast(tx);
  expect(isTxError(res)).toBe(false);
});

test('TerraSwap swap UST to LUNA', async () => {
  const tx = await terraSwap.createAndSignSwapBySymbolMsg(UST, LUNA, '1000', {
    msgs: [],
    memo: 'test UST to LUNA',
    gasAdjustment: lcdConfig.gasAdjustment,
    gasPrices: lcdConfig.gasPrices,
  });
  expect(tx).toBeDefined();
  const res = await lcdClient.tx.broadcast(tx);
  expect(isTxError(res)).toBe(false);
});

test('TerraSwap swap bLUNA to LUNA', async () => {
  const tx = await terraSwap.createAndSignSwapBySymbolMsg(bLUNA, LUNA, '1000', {
    msgs: [],
    memo: 'test bLUNA to LUNA',
    gasAdjustment: lcdConfig.gasAdjustment,
    gasPrices: lcdConfig.gasPrices,
  });
  expect(tx).toBeDefined();
  const res = await lcdClient.tx.broadcast(tx);
  expect(isTxError(res)).toBe(false);
});

test('TerraSwap swap LUNA to bLUNA', async () => {
  const tx = await terraSwap.createAndSignSwapBySymbolMsg(LUNA, bLUNA, '1000', {
    msgs: [],
    memo: 'test LUNA to bLUNA',
    gasAdjustment: lcdConfig.gasAdjustment,
    gasPrices: lcdConfig.gasPrices,
  });
  expect(tx).toBeDefined();
  const res = await lcdClient.tx.broadcast(tx);
  expect(isTxError(res)).toBe(false);
});
