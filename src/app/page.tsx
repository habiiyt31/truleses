"use client";
import Link from "next/link";
import { useWallet } from "@/lib/wallet-provider";

export default function Home() {
  const { address, nickname, loading } = useWallet();
  if (loading) return <div style={{ textAlign:"center",padding:80,fontFamily:"var(--font-pixel)",color:"var(--pixel-gold)" }}>Loading...</div>;

  const short = address ? address.slice(0,6) + "..." + address.slice(-4) : "";

  return (
    <div style={{ textAlign:"center",padding:"50px 20px" }}>
      <h1 className="glow" style={{ fontFamily:"var(--font-pixel)",fontSize:"clamp(22px,5vw,40px)",color:"var(--pixel-gold)",marginBottom:10 }}>TRULESES</h1>
      <p style={{ fontFamily:"var(--font-retro)",fontSize:28,color:"var(--pixel-green)" }}>True or False Quiz Game</p>
      <p style={{ fontFamily:"var(--font-retro)",fontSize:20,color:"var(--pixel-gray)",marginBottom:10 }}>Powered by GenLayer</p>

      <div style={{ margin:"30px auto",width:96,height:96 }}>
        <svg viewBox="0 0 16 16" width="96" height="96" style={{ imageRendering:"pixelated" as const }}>
          <rect x="5" y="0" width="6" height="2" fill="#e2b714"/><rect x="4" y="2" width="8" height="5" fill="#e2b714"/>
          <rect x="5" y="3" width="2" height="2" fill="#0a0a1a"/><rect x="9" y="3" width="2" height="2" fill="#0a0a1a"/>
          <rect x="6" y="6" width="4" height="1" fill="#e84545"/><rect x="4" y="7" width="8" height="5" fill="#4ecca3"/>
          <rect x="3" y="8" width="1" height="3" fill="#4ecca3"/><rect x="12" y="8" width="1" height="3" fill="#4ecca3"/>
          <rect x="5" y="12" width="2" height="4" fill="#3498db"/><rect x="9" y="12" width="2" height="4" fill="#3498db"/>
        </svg>
      </div>

      {nickname && <p style={{ fontFamily:"var(--font-pixel)",fontSize:11,color:"var(--pixel-green)",marginBottom:16 }}>Welcome, {nickname}!</p>}

      <div style={{ display:"flex",flexDirection:"column",gap:14,maxWidth:340,margin:"20px auto 0" }}>
        <Link href="/rooms"><button className="pixel-btn pixel-btn-primary" style={{ width:"100%" }}>Play Now</button></Link>
        <Link href="/create"><button className="pixel-btn pixel-btn-gold" style={{ width:"100%" }}>Create Room</button></Link>
        <Link href="/history"><button className="pixel-btn pixel-btn-gray" style={{ width:"100%" }}>Game History</button></Link>
        <Link href="/profile"><button className="pixel-btn pixel-btn-purple" style={{ width:"100%" }}>My Profile</button></Link>
      </div>

      {address && <p style={{ fontFamily:"var(--font-pixel)",fontSize:8,color:"var(--pixel-gray)",marginTop:40 }}>Connected: {short}</p>}
    </div>
  );
}