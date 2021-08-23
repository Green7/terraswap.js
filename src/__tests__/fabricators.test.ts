import { PairFinder } from '../pairFinder';
import {
  fabricateQuerySimulationBySymbol,
  fabricateReverseQuerySimulationBySymbol,
  fabricateSwap,
  fabricateSwapBySymbol,
} from '../fabricators';
import { bLUNA, LUNA, ULUNA, UST } from '../constants';
import { Coin, Coins, MsgExecuteContract } from '@terra-money/terra.js';
import { createAssetForNative } from '../types';

let testNetworkPairsProvider: PairFinder;
let mainNetworkPairsProvider: PairFinder;

beforeAll(async () => {
  testNetworkPairsProvider = new PairFinder('testnet');
  await testNetworkPairsProvider.getPairsInfo();

  mainNetworkPairsProvider = new PairFinder('mainnet');
  await mainNetworkPairsProvider.getPairsInfo();
});

test('PairsProvider fabricateQuerySimulationBySymbol LUNA to UST', async () => {
  const res = fabricateQuerySimulationBySymbol(testNetworkPairsProvider, LUNA, UST, '10000');

  expect(res.contractAddr).toBe('terra156v8s539wtz0sjpn8y8a8lfg8fhmwa7fy22aff');
  expect(res.query).toEqual({
    simulation: { offer_asset: { amount: '10000', info: { native_token: { denom: 'uluna' } } } },
  });
});

test('PairsProvider fabricateQuerySimulationBySymbol UST to LUNA', async () => {
  const res = fabricateQuerySimulationBySymbol(testNetworkPairsProvider, UST, LUNA, '10000');

  expect(res.contractAddr).toBe('terra156v8s539wtz0sjpn8y8a8lfg8fhmwa7fy22aff');
  expect(res.query).toEqual({
    simulation: { offer_asset: { amount: '10000', info: { native_token: { denom: 'uusd' } } } },
  });
});

test('PairsProvider fabricateQuerySimulationBySymbol LUNA to bLUNA', async () => {
  const res = fabricateQuerySimulationBySymbol(mainNetworkPairsProvider, LUNA, bLUNA, '10000');

  expect(res.contractAddr).toBe('terra1jxazgm67et0ce260kvrpfv50acuushpjsz2y0p');
  expect(res.query).toEqual({
    simulation: { offer_asset: { amount: '10000', info: { native_token: { denom: 'uluna' } } } },
  });
});

test('PairsProvider fabricateQuerySimulationBySymbol bLUNA to LUNA ', async () => {
  const res = fabricateQuerySimulationBySymbol(mainNetworkPairsProvider, bLUNA, LUNA, '10000');

  expect(res.contractAddr).toBe('terra1jxazgm67et0ce260kvrpfv50acuushpjsz2y0p');
  expect(res.query).toEqual({
    simulation: {
      offer_asset: {
        amount: '10000',
        info: { token: { contract_addr: 'terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp' } },
      },
    },
  });
});

test('PairsProvider fabricateReverseQuerySimulationBySymbol LUNA to UST', async () => {
  const res = fabricateReverseQuerySimulationBySymbol(testNetworkPairsProvider, LUNA, UST, '10000');

  expect(res.contractAddr).toBe('terra156v8s539wtz0sjpn8y8a8lfg8fhmwa7fy22aff');
  expect(res.query).toEqual({
    reverse_simulation: { ask_asset: { amount: '10000', info: { native_token: { denom: 'uusd' } } } },
  });
});

test('PairsProvider fabricateReverseQuerySimulationBySymbol UST to LUNA', async () => {
  const res = fabricateReverseQuerySimulationBySymbol(testNetworkPairsProvider, UST, LUNA, '10000');

  expect(res.contractAddr).toBe('terra156v8s539wtz0sjpn8y8a8lfg8fhmwa7fy22aff');
  expect(res.query).toEqual({
    reverse_simulation: { ask_asset: { amount: '10000', info: { native_token: { denom: 'uluna' } } } },
  });
});

test('PairsProvider fabricateReverseQuerySimulationBySymbol LUNA to bLUNA ', async () => {
  const res = fabricateReverseQuerySimulationBySymbol(mainNetworkPairsProvider, LUNA, bLUNA, '10000');

  expect(res.contractAddr).toBe('terra1jxazgm67et0ce260kvrpfv50acuushpjsz2y0p');
  expect(res.query).toEqual({
    reverse_simulation: {
      ask_asset: {
        amount: '10000',
        info: { token: { contract_addr: 'terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp' } },
      },
    },
  });
});

test('PairsProvider fabricateReverseQuerySimulationBySymbol bLUNA to LUNA', async () => {
  const res = fabricateReverseQuerySimulationBySymbol(mainNetworkPairsProvider, bLUNA, LUNA, '10000');

  expect(res.contractAddr).toBe('terra1jxazgm67et0ce260kvrpfv50acuushpjsz2y0p');
  expect(res.query).toEqual({
    reverse_simulation: { ask_asset: { amount: '10000', info: { native_token: { denom: 'uluna' } } } },
  });
});

test('fabricateSwap ULUNA to UST', async () => {
  const msg = fabricateSwap(
    'account001',
    'pairAddr',
    createAssetForNative(ULUNA, '10000'),
    'moon',
    '0.01',
    'accountTo',
  );

  expect(msg).toEqual(
    new MsgExecuteContract(
      'account001',
      'pairAddr',
      {
        swap: {
          offer_asset: {
            amount: '10000',
            info: {
              native_token: {
                denom: 'uluna',
              },
            },
          },
          belief_price: 'moon',
          max_spread: '0.01',
          to: 'accountTo',
        },
      },
      new Coins([new Coin('uluna', '10000')]),
    ),
  );
});

test('fabricateSwapBySymbol LUNA to UST', async () => {
  const msg = fabricateSwapBySymbol(
    'account001',
    testNetworkPairsProvider,
    LUNA,
    UST,
    '10000',
    'moon',
    '0.01',
    'accountTo',
  );

  expect(msg).toEqual(
    new MsgExecuteContract(
      'account001',
      'terra156v8s539wtz0sjpn8y8a8lfg8fhmwa7fy22aff',
      {
        swap: {
          offer_asset: {
            amount: '10000',
            info: {
              native_token: {
                denom: 'uluna',
              },
            },
          },
          belief_price: 'moon',
          max_spread: '0.01',
          to: 'accountTo',
        },
      },
      new Coins([new Coin('uluna', '10000')]),
    ),
  );
});
