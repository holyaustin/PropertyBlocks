# 🏗 PropertyBlocks : A Real World Asset (RWA) Project on BlockChain for fractionalized Real Estate Investment

<h4 align="center">
  <a href="https://youtu.be/NNKcoUi3734">YouTube Code Walkthrough</a> |
  <a href="https://scaffoldeth.iopropertyblocks.vercel.app/">Website</a>
</h4>

## Inspiration

The inspiration behind PropertyBlocks stemmed from the desire to democratize real estate investment. Traditional real estate investments often require significant capital, making it inaccessible for many. By leveraging blockchain technology, we aimed to lower the barrier to entry, allowing anyone to invest in real estate properties with smaller amounts of capital. The concept of fractional ownership inspired us to create a platform where individuals can buy, sell, and trade fractions of real estate assets seamlessly, thus promoting financial inclusion and decentralization.

## What it does

PropertyBlocks is a decentralized platform that enables the fractional ownership of real estate assets. It allows users to register properties, tokenize them into fractions, and sell or rent these fractions on the blockchain. Investors can purchase fractions of a property, thereby gaining ownership and potential rental income based on their investment. The platform also features a marketplace where users can buy, sell, and trade property fractions. Additionally, PropertyBlocks includes a mechanism for renting properties, with rental income distributed proportionally to fraction owners.

## How we built it

PropertyBlocks was built using Solidity for smart contract development on the Lisk blockchain. We utilized Hardhat and Chai for testing and deployment of our contracts. The frontend was developed using Next.js, with ethers.js facilitating interaction with the blockchain. For tokenization, we implemented the ERC20 standard to represent property fractions and for security. We integrated IPFS for decentralized storage of property-related metadata, ensuring immutability and transparency. The platform also includes robust security measures to protect users' investments and ensure the integrity of transactions.

## Challenges we ran into

During development, we faced several challenges and lots of reserach was conducted:

1. Smart Contract Security: Ensuring the security of our smart contracts was paramount. We had to implement and rigorously test measures to prevent common vulnerabilities such as reentrancy attacks and overflow/underflow issues.
2. Scalability: Managing and optimizing gas costs for transactions, especially for complex operations like fractional ownership transfers and rental income distribution, was challenging.
3. User Experience: Creating an intuitive and seamless user experience for interacting with the blockchain and managing property fractions required careful design and extensive testing.
4. Regulatory Compliance: Navigating the regulatory landscape for tokenized real estate was complex, requiring us to consider legal implications and compliance requirements in different jurisdictions.

## Accomplishments that we're proud of

We are proud of several key accomplishments:

1 Successful Deployment: Deploying a fully functional platform on the Ethereum blockchain that enables fractional ownership and rental of real estate properties.
2. User-Friendly Interface: Developing a user-friendly interface that simplifies complex blockchain interactions, making it accessible even to users with minimal blockchain knowledge.
3 Robust Security: Implementing robust security measures and conducting thorough testing to ensure the safety of users' investments.
4. Community Engagement: Building an engaged community of early adopters and investors who are excited about the potential of decentralized real estate investment.

## What we learned

I didn't know that the world of real estate is this vast and lucrative. My little research during this project opened my eyes to the huge potentials in this industry. i know trhat Blockchain will definitelt change the way the real estate is transacted digitally.

## What's next for PropertyBlock

If i have more time. i will continue to work on the project.

1. Introduce a lending pools.
2. Allow property owners to use their property as collateral to lend from the pool.
3. Fractionalized renting too.

Deployment on List Sepolia
<https://sepolia-blockscout.lisk.com/address/0x09c67f656805d3B4CB544ce11683928e62a9c4d7>

Deployment on Bsc Testnet
<https://testnet.bscscan.com/address/0xa199AB87E3787C67f5286d78f527B1426f022eeD>

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

![Debug Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Install dependencies if it was skipped in CLI:

```
cd my-dapp-example
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `packages/hardhat/hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

- Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`
- Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
- Edit your deployment scripts in `packages/hardhat/deploy`

## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.
