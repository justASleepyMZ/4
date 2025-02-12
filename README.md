# BlockchainTechnologies

## Setup the enviroment

Make sure you have latest version on Node.js

```bash
`npm init
npm i hardhat react @nomicfoundation/hardhat-toolbox`
```
![Example](images/1.png)

## Getting Started

To get started, first deploy the smart contract on some TestNet.

```bash
npx hardhat run scripts/deploy.js --network [your configuration]
```
![Example](images/2.png)

Then paste your deployed contract address (`0x123...`) into `constants.js`. 

After all start the frontend server:

```bash
npm i
npm run dev
```
![Example](images/3.png)

Then, open [http://localhost:5173](http://localhost:5173) in your browser to view the result.

![Example](images/4.png)

![Example](images/5.png)

## Tech Stack

- Solidity
- Hardhat
- React
- NodeJS




