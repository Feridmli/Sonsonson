// SeaportUtils.js (Mobil DApp-ready)
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.8.0/dist/ethers.esm.min.js";
import { Seaport } from "https://cdn.jsdelivr.net/npm/@opensea/seaport-js@latest/dist/seaport.esm.min.js";
import WalletConnectProvider from "https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.8.0/dist/umd/index.min.js";

// ---------- Kontrakt ünvanları ----------
export const PROXY_ADDRESS = "0x9656448941C76B79A39BC4ad68f6fb9F01181EC7";
export const NFT_CONTRACT_ADDRESS = "0x54a88333F6e7540eA982261301309048aC431eD5";

// ---------- Cüzdan qoşma funksiyası ----------
export async function connectWallet() {
  try {
    let provider;

    if (window.ethereum) {
      // Desktop / DApp browser
      provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
    } else {
      // Mobile WalletConnect fallback
      const wcProvider = new WalletConnectProvider({
        rpc: {
          1: "https://mainnet.infura.io/v3/9bc33f89bb734386a357cccc561fae13",  // Ethereum mainnet
          8453: "https://rpc.apecoin.io"                     // ApeChain mainnet
        },
        qrcode: true
      });

      await wcProvider.enable();
      provider = new ethers.BrowserProvider(wcProvider);
    }

    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    console.log("Wallet connected:", address);
    return { provider, signer, address };

  } catch (e) {
    console.error("connectWallet error:", e);
    alert(e.message);
    throw e;
  }
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
