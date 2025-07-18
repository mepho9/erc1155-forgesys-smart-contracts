# ERC1155 ForgeSys - Solidity Smart Contracts

## 🚀 Project Overview

This repository contains the **Solidity smart contracts** powering the ForgeSys application, an upgradeable ERC1155 token system featuring minting with cooldown and a forge mechanic that combines tokens into higher-tier tokens.  
Built with Hardhat and OpenZeppelin upgradeable contracts for security, modularity, and maintainability.

---

## 🧱 Project Architecture

The smart contracts and related code are organized as follows:

```
erc1155-forgesys-smart-contracts/
├── contracts/              # Upgradeable Solidity contracts
│   ├── legacy/             # Old contracts for reference only
│   │   └── LegacyForgeSystem.sol
│   ├── ForgeLogic.sol
│   └── ForgeToken.sol
├── scripts/                # Deployment and manual interaction scripts
│   ├── deploy.js           # Upgradeable contracts deployment script
│   └── test-forge.js       # Script for manual testing and debugging
├── test/                   # Automated unit tests (Mocha & Chai)
│   ├── ForgeLogic.test.js
│   └── ForgeToken.test.js
├── hardhat.config.js       # Hardhat configuration file
├── package.json            # NPM dependencies and scripts
├── .gitignore              # Specifies ignored files/folders
└── README.md               # Project documentation
```

---

## ⚙️ Technology Stack

- **Solidity 0.8.x** — Smart contract language  
- **Hardhat** — Ethereum development environment  
- **OpenZeppelin Upgradeable Contracts** — Secure, audited upgradeable contract framework  
- **Ethers.js** — Ethereum JS library for contract interaction  
- **Mocha & Chai** — Testing framework and assertion library  
- **Node.js** — Runtime environment for scripts and tests  

---

## 📦 Setup Instructions

1. Clone the repository and install dependencies:

```bash
git clone <https://github.com/mepho9/erc1155-forgesys-smart-contracts.git>
cd erc1155-forgesys-smart-contracts
npm install
```

---

## 🔨 Compile Contracts

```bash
npx hardhat compile
```

---

## 🏗️ Deployment

```bash
npx hardhat run scripts/deploy.js
```

---

## 🧪 Running Tests

### 1. Automated Unit Tests

1. Run the full test suite covering all core functionalities and edge cases:

```bash
npx hardhat test
```

2. Tests include:

- Minting with cooldown enforcement
- Permissioned minting and burning through the forge contract
- Forge logic validation (burning component tokens and minting forged tokens)
- Expected revert scenarios for invalid inputs or unauthorized actions

### 2. Manual Testing Script

> For quick manual interaction and debugging, use the provided script:

```bash
npx hardhat run scripts/test-forge.js
```

---

## 🔐 Security & Best Practices

- Usage of OpenZeppelin upgradeable contracts enables future upgrades without loss of data.
- Strict access controls (onlyOwner, forgeContract role) protect critical functions.
- Mint cooldown mechanism mitigates spam and abuse.
- Comprehensive tests ensure robustness and contract correctness.

---

## 🔧 Environment Variables

This project expects a `.env` file in the root directory to manage sensitive information such as:

- RPC URLs (Infura, Alchemy endpoints)
- Private keys for deployment accounts (keep it secret)
- Any other configurable secrets or environment-specific variables

An example file `.env.example` is provided as a template.  
Make sure to copy it to `.env` and fill in your actual values before running scripts or tests:

```bash
cp .env.example .env
```

---

## 📚 Useful Resources

- [Hardhat Documentation](https://hardhat.org/getting-started/)
- [OpenZeppelin Upgradeable Contracts](https://docs.openzeppelin.com/contracts/4.x/api/proxy)
- [Ethers.js Documentation](https://docs.ethers.io/v5/)
- [Mocha Testing Framework](https://mochajs.org/)
- [Chai Assertion Library](https://www.chaijs.com/)

---

## 🔗 Frontend Repository

The ForgeSys frontend DApp will be available soon in a separate repository:  
`erc1155-forgesys-dapp-frontend` (incoming)  
Repository URL: _Coming soon_

---

## 🛠️ Available Scripts

- `deploy.js`: Deploys the upgradeable ForgeToken and ForgeLogic smart contracts.
- `test-forge.js`: Script to manually test minting and forging token flows on a local network.
- `ForgeToken.test.js`: Automated unit tests for the ForgeToken contract (minting, burning, cooldowns).
- `ForgeLogic.test.js`: Automated unit tests for the ForgeLogic contract (forging logic and token burning).

---

## 📌 Hardhat Tools (Console)

> You can also use the built-in Hardhat console:

```bash
npx hardhat console --network localhost
```

---

## 👨‍💻 Author

**Rufat Babayev (Mepho9)**  
- GitHub: [@mepho9](https://github.com/mepho9)  
- LinkedIn: [rbabayev9](https://www.linkedin.com/in/rbabayev9/)

---

## 📄 License

MIT License, free to use with attribution.

---