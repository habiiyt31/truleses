"use client";
import { useState } from "react";
import { useWallet } from "@/lib/wallet-provider";

export default function WalletInfo() {
  const { address, nickname, connected, connectWallet, disconnect } = useWallet();
  const [open, setOpen] = useState(false);

  if (!connected || !address) {
    return (
      <button
        onClick={connectWallet}
        style={{
          fontFamily: "var(--font-pixel)", fontSize: 9, color: "var(--pixel-gold)",
          background: "var(--pixel-dark)", border: "2px solid var(--pixel-gold)",
          padding: "6px 12px", cursor: "pointer",
        }}
      >
        Connect
      </button>
    );
  }

  const short = address.slice(0, 6) + "..." + address.slice(-4);

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        fontFamily: "var(--font-pixel)", fontSize: 9, color: "var(--pixel-green)",
        background: "var(--pixel-dark)", border: "2px solid var(--pixel-border)",
        padding: "6px 12px", cursor: "pointer",
      }}>
        {nickname || short}
      </button>
      {open && <>
        <div style={{ position: "fixed", inset: 0, zIndex: 199 }} onClick={() => setOpen(false)} />
        <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 6, background: "var(--pixel-panel)", border: "2px solid var(--pixel-border)", padding: 14, minWidth: 240, zIndex: 200 }}>
          <p style={{ fontFamily: "var(--font-pixel)", fontSize: 8, color: "var(--pixel-gray)", marginBottom: 4 }}>MetaMask Wallet</p>
          <p style={{ fontFamily: "var(--font-retro)", fontSize: 14, color: "var(--pixel-green)", wordBreak: "break-all", marginBottom: 12 }}>{address}</p>
          {nickname && <p style={{ fontFamily: "var(--font-retro)", fontSize: 18, color: "var(--pixel-gold)", marginBottom: 12 }}>{nickname}</p>}
          <button className="pixel-btn pixel-btn-danger" style={{ width: "100%", fontSize: 9, padding: 8 }} onClick={() => { disconnect(); setOpen(false); }}>
            Disconnect
          </button>
        </div>
      </>}
    </div>
  );
}