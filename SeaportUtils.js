// SeaportUtils.js
import { Seaport } from "https://cdn.jsdelivr.net/npm/@opensea/seaport-js@latest/dist/seaport.min.js";
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.8.0/dist/ethers.min.js";

// ---------- Kontrakt ünvanları ----------
const PROXY_ADDRESS = "0x9656448941C76B79A39BC4ad68f6fb9F01181EC7"; // Seaport proxy
const NFT_CONTRACT_ADDRESS = "0x54a88333F6e7540eA982261301309048aC431eD5"; // ERC721A NFT kontrakt

// ---------- Cüzdan qoşma funksiyası ----------
export async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask və ya uyğun Wallet tapılmadı!");
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  
  return { provider, signer, address };
}

// ---------- NFT alışı (fulfill order) ----------
export async function fulfillOrder(seaport, signer, order, options = {}) {
  try {
    if (!seaport) seaport = new Seaport(signer, { contractAddress: PROXY_ADDRESS });

    const tx = await seaport.fulfillOrder({
      order: order.seaportOrder,
      accountAddress: await signer.getAddress(),
      recipient: options.recipient || await signer.getAddress()
    });

    await tx.wait();
    alert(`NFT #${order.tokenId} uğurla alındı ✅`);
    return tx;
  } catch (e) {
    console.error("Fulfill error:", e);
    alert("NFT alışı uğursuz oldu ❌");
    throw e;
  }
}

// ---------- NFT kontrakt ünvanı ----------
export function getNFTContractAddress() {
  return NFT_CONTRACT_ADDRESS;
}