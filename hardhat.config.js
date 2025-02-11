require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Для безопасного хранения ключей

module.exports = {
  solidity: "0.8.20",
  networks: {
    holesky: {
      url: "https://ethereum-holesky.publicnode.com", // RPC узел Holesky
      accounts: [process.env.PRIVATE_KEY], // Твой приватный ключ из .env
      chainId: 17000,
    },
  },
};
