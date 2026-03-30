"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/lib/wallet-provider";

export default function LeaderboardPage() {
  const router = useRouter();
  const { connected, read, C } = useWallet();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!connected) return;
    (async () => {
      try {
        const res = await read(C.STAT, "get_leaderboard", [50]);
        const d = JSON.parse(res as string);
        setEntries(d.leaderboard || []);
      } catch { console.log("No leaderboard yet"); }
      setLoading(false);
    })();
  }, [connected]);

  if (!connected) return (
    <div style={{ textAlign:"center", padding:80 }}>
      <p style={{ fontFamily:"var(--font-pixel)", fontSize:11, color:"var(--pixel-gold)", marginBottom:16 }}>
        Please connect your wallet first
      </p>
      <p style={{ fontFamily:"var(--font-retro)", fontSize:18, color:"var(--pixel-gray)" }}>
        Use the Connect button in the top right corner
      </p>
      <button className="pixel-btn pixel-btn-gray" style={{ marginTop:24 }} onClick={() => router.push("/")}>Back to Home</button>
    </div>
  );

  return (
    <div className="slide-up" style={{ maxWidth:650,margin:"0 auto",padding:20 }}>
      <div className="pixel-border pixel-card">
        <div style={{ fontFamily:"var(--font-pixel)",fontSize:13,color:"var(--pixel-gold)",marginBottom:20,textTransform:"uppercase",letterSpacing:2 }}>Global Leaderboard</div>
        {loading ? (
          <p style={{ fontFamily:"var(--font-retro)",fontSize:24,color:"var(--pixel-green)",textAlign:"center",padding:30 }}>Loading...</p>
        ) : entries.length === 0 ? (
          <p style={{ fontFamily:"var(--font-retro)",fontSize:24,color:"var(--pixel-gray)",textAlign:"center",padding:30 }}>No players yet. Be the first!</p>
        ) : (
          <>
            <div className="pixel-border" style={{ display:"grid",gridTemplateColumns:"36px 1fr 70px 70px 80px 60px",gap:4,padding:"10px 12px",fontFamily:"var(--font-pixel)",fontSize:8,color:"var(--pixel-gold)",background:"var(--pixel-accent)" }}>
              <span>#</span><span>Player</span><span style={{ textAlign:"right" }}>Correct</span><span style={{ textAlign:"right" }}>Wrong</span><span style={{ textAlign:"right" }}>XP</span><span style={{ textAlign:"right" }}>Games</span>
            </div>
            {entries.map((e: any, i: number) => (
              <div key={e.address} className="pixel-border" style={{ display:"grid",gridTemplateColumns:"36px 1fr 70px 70px 80px 60px",gap:4,padding:"10px 12px",alignItems:"center",marginTop:2,background:i===0?"rgba(226,183,20,0.1)":i===1?"rgba(189,195,199,0.05)":"var(--pixel-dark)" }}>
                <span style={{ fontFamily:"var(--font-pixel)",fontSize:13,color:i===0?"var(--pixel-gold)":i===1?"#bdc3c7":i===2?"#cd7f32":"var(--pixel-gray)" }}>{e.rank}</span>
                <span style={{ fontFamily:"var(--font-retro)",fontSize:20,color:"var(--pixel-white)" }}>{e.nickname||e.address?.slice(0,10)+"..."}</span>
                <span style={{ fontFamily:"var(--font-retro)",fontSize:18,color:"var(--pixel-green)",textAlign:"right" }}>{e.total_correct}</span>
                <span style={{ fontFamily:"var(--font-retro)",fontSize:18,color:"var(--pixel-red)",textAlign:"right" }}>{e.total_wrong}</span>
                <span style={{ fontFamily:"var(--font-pixel)",fontSize:11,color:"var(--pixel-gold)",textAlign:"right" }}>{e.total_xp}</span>
                <span style={{ fontFamily:"var(--font-retro)",fontSize:18,color:"var(--pixel-gray)",textAlign:"right" }}>{e.games_played}</span>
              </div>
            ))}
          </>
        )}
        <button className="pixel-btn pixel-btn-gray" style={{ marginTop:20,width:"100%" }} onClick={() => router.push("/")}>Back to Home</button>
      </div>
    </div>
  );
}