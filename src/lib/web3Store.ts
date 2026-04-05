import { create } from 'zustand';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface Web3Store {
  // Connection state
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;

  // Contract instances
  shoppingContract: ethers.Contract | null;
  creatorTokenContract: ethers.Contract | null;

  // Actions
  setConnected: (connected: boolean) => void;
  setAddress: (address: string | null) => void;
  setChainId: (chainId: number | null) => void;
  setProvider: (provider: ethers.providers.Web3Provider | null) => void;
  setSigner: (signer: ethers.Signer | null) => void;
  setShoppingContract: (contract: ethers.Contract | null) => void;
  setCreatorTokenContract: (contract: ethers.Contract | null) => void;

  // Connection helpers
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const useWeb3Store = create<Web3Store>((set, get) => ({
  isConnected: false,
  address: null,
  chainId: null,
  provider: null,
  signer: null,
  shoppingContract: null,
  creatorTokenContract: null,

  setConnected: (connected: boolean) => set({ isConnected: connected }),
  setAddress: (address: string | null) => set({ address }),
  setChainId: (chainId: number | null) => set({ chainId }),
  setProvider: (provider: ethers.providers.Web3Provider | null) => set({ provider }),
  setSigner: (signer: ethers.Signer | null) => set({ signer }),
  setShoppingContract: (contract: ethers.Contract | null) => set({ shoppingContract: contract }),
  setCreatorTokenContract: (contract: ethers.Contract | null) => set({ creatorTokenContract: contract }),

  connect: async () => {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask or Web3 wallet not installed');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const network = await provider.getNetwork();

      set({
        isConnected: true,
        address: accounts[0],
        chainId: network.chainId,
        provider,
        signer,
      });
    } catch (error) {
      console.error('Web3 connection failed:', error);
      set({ isConnected: false });
    }
  },

  disconnect: () => {
    set({
      isConnected: false,
      address: null,
      chainId: null,
      provider: null,
      signer: null,
      shoppingContract: null,
      creatorTokenContract: null,
    });
  },
}));
