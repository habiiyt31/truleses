"use client";
import { useWallet } from "@/lib/wallet-provider";

export default function ConnectWallet() {
  const { connectWallet } = useWallet();

  return (
    <div style={{ textAlign: "center", padding: "50px 20px", maxWidth: 460, margin: "0 auto" }}>
      {/* MetaMask fox pixel art */}
      <svg viewBox="0 0 16 16" width="80" height="80" style={{ imageRendering: "pixelated" as const, marginBottom: 24 }}>
        <rect x="3" y="2" width="10" height="3" fill="#e2761b" />
        <rect x="2" y="5" width="12" height="4" fill="#e4761b" />
        <rect x="3" y="9" width="10" height="2" fill="#d7c1b3" />
        <rect x="4" y="11" width="8" height="2" fill="#e2761b" />
        <rect x="5" y="5" width="2" height="2" fill="#1a1a2e" />
        <rect x="9" y="5" width="2" height="2" fill="#1a1a2e" />
      </svg>

      <h1 style={{ fontFamily: "var(--font-pixel)", fontSize: "clamp(16px,4vw,24px)", color: "var(--pixel-gold)", marginBottom: 8 }}>
        Connect Wallet
      </h1>
      <p style={{ fontFamily: "var(--font-retro)", fontSize: 22, color: "var(--pixel-gray)", marginBottom: 30 }}>
        Connect MetaMask to play Truleses
      </p>

      <button
        className="pixel-btn pixel-btn-gold"
        style={{ width: "100%", padding: 16, fontSize: 12 }}
        onClick={connectWallet}
      >
        Connect MetaMask
      </button>

      <div style={{ marginTop: 24, padding: 14, border: "1px solid var(--pixel-border)", background: "rgba(226,183,20,0.05)" }}>
        <p style={{ fontFamily: "var(--font-pixel)", fontSize: 8, color: "var(--pixel-gold)", marginBottom: 6 }}>
          Setup MetaMask
        </p>
        <div style={{ fontFamily: "var(--font-retro)", fontSize: 16, color: "var(--pixel-gray)", lineHeight: 1.5, textAlign: "left" }}>
          <p>1. Install MetaMask extension</p>
          <p>2. Add GenLayer Studio network:</p>
          <p style={{ color: "var(--pixel-green)", paddingLeft: 12 }}>Network: GenLayer Studio</p>
          <p style={{ color: "var(--pixel-green)", paddingLeft: 12 }}>RPC: studio.genlayer.com/api</p>
          <p style={{ color: "var(--pixel-green)", paddingLeft: 12 }}>Chain ID: 61999</p>
          <p style={{ color: "var(--pixel-green)", paddingLeft: 12 }}>Symbol: GEN</p>
          <p>3. Click "Connect MetaMask" above</p>
        </div>
      </div>
    </div>
  );
}
