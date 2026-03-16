"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { CONTRACTS } from "./contracts";

interface WalletContextType {
  address: string | null;
  nickname: string;
  connected: boolean;
  loading: boolean;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  setNickname: (n: string) => void;
  read: (address: `0x${string}`, fn: string, args?: any[]) => Promise<any>;
  write: (address: `0x${string}`, fn: string, args?: any[]) => Promise<any>;
  C: typeof CONTRACTS;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be inside WalletProvider");
  return ctx;
}

function getEthereum(): any {
  if (typeof window !== "undefined") return (window as any).ethereum;
  return null;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [nickname, setNicknameState] = useState("");
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const initClient = useCallback((addr: string) => {
    const c = createClient({
      chain: studionet,
      account: addr as `0x${string}`,
      endpoint: "https://studio.genlayer.com/api",
      provider: typeof window !== "undefined" ? (window as any).ethereum : undefined,
    });
    setClient(c);
    setAddress(addr);
    localStorage.setItem("truleses_address", addr);
    const savedNick = localStorage.getItem("truleses_nick_" + addr.toLowerCase());
    if (savedNick) setNicknameState(savedNick);
  }, []);

  // Auto-connect on mount if previously connected
  useEffect(() => {
    (async () => {
      const eth = getEthereum();
      if (eth) {
        try {
          const accounts = await eth.request({ method: "eth_accounts" });
          if (accounts && accounts.length > 0) {
            initClient(accounts[0]);
          }
        } catch {}
      }
      setLoading(false);
    })();
  }, [initClient]);

  // Listen for account/chain changes
  useEffect(() => {
    const eth = getEthereum();
    if (!eth) return;
    const onAccounts = (accounts: string[]) => {
      if (accounts.length === 0) { setAddress(null); setClient(null); }
      else initClient(accounts[0]);
    };
    eth.on("accountsChanged", onAccounts);
    return () => eth.removeListener("accountsChanged", onAccounts);
  }, [initClient]);

  const connectWallet = useCallback(async () => {
    const eth = getEthereum();
    if (!eth) { window.open("https://metamask.io/download/", "_blank"); return; }
    try {
      // Add GenLayer Studio network to MetaMask
      try {
        await eth.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: "0xF22F",
            chainName: "GenLayer Studio",
            rpcUrls: ["https://studio.genlayer.com/api"],
            nativeCurrency: { name: "GEN", symbol: "GEN", decimals: 18 },
          }],
        });
      } catch (addChainError: any) {
        console.warn("wallet_addEthereumChain failed", addChainError?.message || addChainError);
      }
      try {
        await eth.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xF22F" }],
        });
      } catch (switchError: any) {
        console.warn("wallet_switchEthereumChain failed", switchError?.message || switchError);
      }
      // Request accounts (triggers MetaMask popup)
      const accounts = await eth.request({ method: "eth_requestAccounts" });
      if (accounts?.length > 0) initClient(accounts[0]);
    } catch (e: any) { console.log("Connect error:", e?.message); }
  }, [initClient]);

  const disconnect = useCallback(() => {
    setAddress(null); setClient(null); setNicknameState("");
    localStorage.removeItem("truleses_address");
  }, []);

  const setNickname = useCallback((n: string) => {
    setNicknameState(n);
    if (address) localStorage.setItem("truleses_nick_" + address.toLowerCase(), n);
  }, [address]);

  const read = useCallback(async (addr: `0x${string}`, fn: string, args: any[] = []) => {
    if (!client) throw new Error("Not connected");
    let attempt = 0;
    while (attempt < 3) {
      try {
        return await client.readContract({ address: addr, functionName: fn, args });
      } catch (e: any) {
        attempt += 1;
        console.warn(`GenLayer read attempt ${attempt} failed`, e?.message || e);
        if (attempt >= 3) {
          throw new Error(`GenLayer read failed after 3 attempts: ${e?.message || e}`);
        }
        await new Promise((r) => setTimeout(r, attempt * 300));
      }
    }
  }, [client]);

  const write = useCallback(async (addr: `0x${string}`, fn: string, args: any[] = []) => {
    if (!client) throw new Error("Not connected");
    let attempt = 0;
    while (attempt < 3) {
      try {
        const hash = await client.writeContract({ address: addr, functionName: fn, args, value: BigInt(0) });
        return await client.waitForTransactionReceipt({ hash, status: "ACCEPTED" } as any);
      } catch (e: any) {
        attempt += 1;
        console.warn(`GenLayer write attempt ${attempt} failed`, e?.message || e);
        if (attempt >= 3) {
          throw new Error(`GenLayer write failed after 3 attempts: ${e?.message || e}`);
        }
        await new Promise((r) => setTimeout(r, attempt * 300));
      }
    }
  }, [client]);

  return (
    <WalletContext.Provider value={{
      address, nickname, connected: !!address, loading,
      connectWallet, disconnect, setNickname, read, write, C: CONTRACTS,
    }}>
      {children}
    </WalletContext.Provider>
  );
}
