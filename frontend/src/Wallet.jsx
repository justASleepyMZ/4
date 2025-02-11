import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./constants";

const WalletComponent = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [amount, setAmount] = useState("");
  const [contractBalance, setContractBalance] = useState("0")

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Установите MetaMask!");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
    fetchBalance(accounts[0]);
  }

  async function fetchBalance(address) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const userBalance = await contract.balanceOf(address);
    setBalance(ethers.formatUnits(userBalance, 18));
    setContractBalance(ethers.formatUnits(await contract.balanceOf(CONTRACT_ADDRESS)))
  }

  async function buyTokens() {
    if (!account) return;
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
        alert("Введите корректное число!");
        return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const tokenPrice = await contract.tokenPrice();
    const amountToBuy = ethers.parseUnits(amount, 18);
    const requiredETH = (amountToBuy * tokenPrice) / BigInt(10 ** 18);
    const insufficientETH = requiredETH - 1n;
          
    const userBalance = await provider.getBalance(signer.address);
    if (BigInt(userBalance) < requiredETH) {
        alert("Не хватает ETH для покупки!");
        return;
    }

    const tx = await contract.buyTokens(amountToBuy, { value: requiredETH });
    await tx.wait();
    fetchBalance(account);
  }

  async function sellTokens() {
    if (!account) return;
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
        alert("Введите корректное число!");
        return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const amountAITU = ethers.parseUnits(amount, 18);
    const tx = await contract.sellTokens(amountAITU);
    await tx.wait();
    fetchBalance(account);
  }

  useEffect(() => {
    if (account) {
      fetchBalance(account);
    }
  }, [account]);

  return (
    <div>
      <h1>AITU Wallet</h1>
      {account ? (
        <>
          <p>Кошелек: {account}</p>
          <p>Баланс: {balance} AITU</p>
          <p>Контракт: {contractBalance}</p>
          <input type="number" placeholder="Сумма" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <button onClick={buyTokens}>Купить токены</button>
          <button onClick={sellTokens}>Продать токены</button>
        </>
      ) : (
        <button onClick={connectWallet}>Подключить MetaMask</button>
      )}
    </div>
  );
};

export default WalletComponent;
