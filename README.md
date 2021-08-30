Terraswap.js is simple library for working with TeraSwap automated market-maker (AMM) protocol on the Terra blockchain.

## Features

- fabricators for composing TerraSwap messages
- retrieving current TeraSwap pairs via REST API (pair contract address lookup)
- support for messages: swap, simulation, reverse_simulation
- easy swapping by specifying symbol names


## Installation

Grab the latest version off [NPM](https://www.npmjs.com/package/terraswap.js):

```sh
yarn add terraswap.js
```
or 
```sh
npm i terraswap.js
```


## Usage

### Setup 


```ts
import { LCDClient, Coin } from '@terra-money/terra.js';

// Create LCD client and wallet 
const lcdConfig = {
  URL: 'https://tequila-lcd.terra.dev',
  chainID: 'tequila-0004',
  gasPrices: {
    uluna: 0.15,
  },
  gasAdjustment: 1.4,
};

const lcdClient: LCDClient = new LCDClient(lcdConfig);
// You must set your wallet mnemonic in MNEMONIC environment variable or set them below (mnemonic: 'your wallet seed phrase')
const wallet = new Wallet(lcdClient, new MnemonicKey({
    mnemonic: process.env.MNEMONIC, 
  }));

// Create terraSwap object
const terraSwap = new TerraSwap('testnet', wallet);

// Get pairs info from TerraSwap 
await terraSwap.getPairsInfo();

```

### Queries


```ts

// Query LUNA to UST price (ammount is in microunits)
const res = await terraSwap.querySimulationBySymbol(LUNA, UST, '1000000');

// Query reverse simulation: how much UST do you have to pay for 1 luna ?
const rres = await terraSwap.queryReverseSimulationBySymbol(LUNA, UST, '1000000');


```

### Swap

```ts
// Create and sign LUNA to UST swap message (ammount is in microunits)
const tx = await terraSwap.createAndSignSwapBySymbolMsg(UST, LUNA, '1000000', {
  msgs: [],
  gasAdjustment: lcdConfig.gasAdjustment,
  gasPrices: lcdConfig.gasPrices,
});

// Broadcast it
const txRes = await lcdClient.tx.broadcast(tx)

```

### Other

If you only want to compose a message (without signing it) use fabricateXXX functions
(fabricateQuerySimulation, fabricateReverseQuerySimulation, fabricateSwap, fabricateSwapBySymbol etc.)

If you need information about available TeraSwap pairs use PairFinder class.

