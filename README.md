# 🏗 PropertyBlocks : A Real World Asset (RWA) Project on BlockChain for fractionalized Real Estate Investment and lending

<h4 align="center">
  <a href="https://youtu.be/NNKcoUi3734">YouTube Code Walkthrough</a> |
  <a href="https://propertyblocks.vercel.app/">Website</a>
</h4>

## Inspiration

The inspiration behind PropertyBlocks stemmed from the desire to democratize real estate investment. Traditional real estate investments often require significant capital, making it inaccessible for many. By leveraging blockchain technology, we aimed to lower the barrier to entry, allowing anyone to invest in real estate properties with smaller amounts of capital. The concept of fractional ownership inspired us to create a platform where individuals can buy, sell, and trade fractions of real estate assets seamlessly, thus promoting financial inclusion and decentralization.

## What it does

PropertyBlocks is a decentralized platform that enables the fractional ownership of real estate assets. It allows users to register properties, tokenize them into fractions, and sell or rent these fractions on the blockchain. Investors can purchase fractions of a property, thereby gaining ownership and potential rental income based on their investment. The platform also features a marketplace where users can buy, sell, and trade property fractions. Additionally, PropertyBlocks includes a mechanism for renting properties, with rental income distributed proportionally to fraction owners.

## How we built it

PropertyBlocks was built using Solidity for smart contract development on the blockchain. We utilized Hardhat and Chai for testing and deployment of our contracts. The frontend was developed using Next.js, with ethers.js facilitating interaction with the blockchain. For tokenization, we implemented the ERC20 standard to represent property fractions and for security. We integrated IPFS for decentralized storage of property-related metadata, ensuring immutability and transparency. The platform also includes robust security measures to protect users' investments and ensure the integrity of transactions.

## Challenges we ran into

During development, we faced several challenges and lots of reserach was conducted:

1. Smart Contract Security: Ensuring the security of our smart contracts was paramount. We had to implement and rigorously test measures to prevent common vulnerabilities such as reentrancy attacks and overflow/underflow issues.
2. Scalability: Managing and optimizing gas costs for transactions, especially for complex operations like fractional ownership transfers and rental income distribution, was challenging.
3. User Experience: Creating an intuitive and seamless user experience for interacting with the blockchain and managing property fractions required careful design and extensive testing.
4. Regulatory Compliance: Navigating the regulatory landscape for tokenized real estate was complex, requiring us to consider legal implications and compliance requirements in different jurisdictions.

## Accomplishments that we're proud of

We are proud of several key accomplishments:

1 Successful Deployment: Deploying a fully functional platform on the Testnet blockchain that enables fractional ownership and rental of real estate properties.
2. User-Friendly Interface: Developing a user-friendly interface that simplifies complex blockchain interactions, making it accessible even to users with minimal blockchain knowledge.
3 Robust Security: Implementing robust security measures and conducting thorough testing to ensure the safety of users' investments.
4. Community Engagement: Building an engaged community of early adopters and investors who are excited about the potential of decentralized real estate investment.

## What we learned

I didn't know that the world of real estate is this vast and lucrative. My little research during this project opened my eyes to the huge potentials in this industry. i know that Blockchain will definitely change the way the real estate is transacted digitally.

## What's next for PropertyBlock

If i have more time. i will continue to work on the project.

1. Introduce a lending pools.
2. Allow property owners to use their property as collateral to lend from the pool.
3. Fractionalized renting too.

Deployment on Arbitrium


🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

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

## Real estate, particularly property real estate, leverages ReFi (Regenerative Finance) principles to promote sustainability, equity, and regenerative practices within the industry. Here's how these principles are applied:

1. Sustainable Development
Principles:

Environmental Impact: Minimizing the ecological footprint of real estate projects through energy-efficient designs, renewable energy integration, and sustainable materials.
Resource Management: Implementing practices such as water conservation, waste reduction, and sustainable landscaping.
Applications:

Green building certifications (e.g., LEED, BREEAM).
Incorporation of renewable energy sources (e.g., solar panels, geothermal systems).
Use of recycled and low-impact materials in construction.
2. Community Engagement and Social Equity
Principles:

Inclusivity: Ensuring that development projects benefit all community members, including marginalized groups.
Local Economic Development: Supporting local economies by hiring local contractors and sourcing materials locally.
Applications:

Mixed-use developments that include affordable housing options.
Community land trusts that ensure long-term affordability and prevent displacement.
Public-private partnerships that involve community stakeholders in the planning process.
3. Regenerative Land Use
Principles:

Biodiversity: Enhancing natural habitats and promoting biodiversity in and around real estate projects.
Regenerative Agriculture: Utilizing land for agricultural purposes in a way that regenerates soil health and increases biodiversity.
Applications:

Development of urban green spaces, parks, and community gardens.
Incorporation of green roofs and living walls to promote urban biodiversity.
Use of permaculture principles in landscape design.
4. Financial Innovations and Mechanisms
Principles:

Impact Investing: Channeling investments into projects that generate positive social and environmental outcomes.
Circular Economy: Creating economic systems that emphasize reuse, recycling, and the longevity of materials.
Applications:

Green bonds and sustainability-linked loans to fund eco-friendly real estate projects.
Real estate investment trusts (REITs) focused on sustainable properties.
Implementation of circular construction practices to minimize waste and resource use.
5. Technological Integration
Principles:

Smart Cities: Leveraging technology to create more efficient, sustainable, and livable urban environments.
Data-Driven Decisions: Using data to optimize building performance and enhance sustainability.
Applications:

Implementation of smart building technologies (e.g., IoT sensors for energy management).
Development of digital platforms for community engagement and resource sharing.
Use of big data and analytics to drive sustainable urban planning.
6. Long-Term Resilience and Adaptation
Principles:

Climate Resilience: Designing buildings and infrastructure to withstand and adapt to climate change impacts.
Adaptive Reuse: Repurposing existing structures to reduce the need for new construction and preserve cultural heritage.
Applications:

Incorporation of climate-resilient features (e.g., flood defenses, heat-resistant materials).
Adaptive reuse of old buildings for new purposes (e.g., converting warehouses into residential lofts).
Creating flexible spaces that can be easily adapted for future needs.
By embedding ReFi principles, the real estate industry can shift towards a more sustainable, equitable, and regenerative model, addressing environmental challenges and fostering community well-being.

https://sepolia.lineascan.build/address/0x3672F4eb94d6f674D11b9D24321eaD0Bb0B490Ab

0xD547726541FB37dB19fDB263f4855bA969034071

0x3672F4eb94d6f674D11b9D24321eaD0Bb0B490Ab
