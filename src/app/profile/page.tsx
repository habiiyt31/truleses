"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/lib/wallet-provider";

export default function ProfilePage() {
  const router = useRouter();
  const { address, nickname, connected, read, write, setNickname: setWalletNick, C } = useWallet();
  const [nick, setNick] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!connected) return;
    setNick(nickname || "");
    (async () => {
      try {
        const res = await read(C.STAT, "get_my_profile");
        const d = JSON.parse(res as string);
        if (!d.error) { setProfile(d); if (d.nickname) { setNick(d.nickname); setWalletNick(d.nickname); } }
      } catch { console.log("No profile yet"); }
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

  const saveNick = async () => {
    if (!nick.trim()) return;
    setSaving(true); setStatus("Saving on-chain...");
    try {
      await write(C.STAT, "set_nickname", [nick.trim()]);
      setWalletNick(nick.trim());
      setStatus("Nickname saved!");
    } catch (e: any) { setStatus("Error: " + (e?.message || e)); }
    setSaving(false);
  };

  return (
    <div className="slide-up" style={{ maxWidth:500,margin:"0 auto",padding:20 }}>
      <div className="pixel-border pixel-card">
        <div style={{ fontFamily:"var(--font-pixel)",fontSize:13,color:"var(--pixel-purple)",marginBottom:20,textTransform:"uppercase",letterSpacing:2 }}>Player Profile</div>

        <div style={{ textAlign:"center",marginBottom:24 }}>
          <svg viewBox="0 0 16 16" width="72" height="72" style={{ imageRendering:"pixelated" as const }}>
            <rect x="5" y="0" width="6" height="2" fill="#e2b714"/><rect x="4" y="2" width="8" height="5" fill="#e2b714"/>
            <rect x="5" y="3" width="2" height="2" fill="#0a0a1a"/><rect x="9" y="3" width="2" height="2" fill="#0a0a1a"/>
            <rect x="6" y="6" width="4" height="1" fill="#4ecca3"/><rect x="4" y="7" width="8" height="5" fill="#9b59b6"/>
            <rect x="5" y="12" width="2" height="4" fill="#3498db"/><rect x="9" y="12" width="2" height="4" fill="#3498db"/>
          </svg>
        </div>

        <div style={{ marginBottom:16,padding:10,background:"var(--pixel-dark)",border:"1px solid var(--pixel-border)" }}>
          <p style={{ fontFamily:"var(--font-pixel)",fontSize:8,color:"var(--pixel-gray)",marginBottom:4 }}>MetaMask Wallet</p>
          <p style={{ fontFamily:"var(--font-retro)",fontSize:16,color:"var(--pixel-green)",wordBreak:"break-all" }}>{address}</p>
        </div>

        <div style={{ marginBottom:20 }}>
          <label style={{ fontFamily:"var(--font-pixel)",fontSize:9,color:"var(--pixel-gray)",marginBottom:6,display:"block" }}>Nickname</label>
          <div style={{ display:"flex",gap:8 }}>
            <input className="pixel-input" value={nick} onChange={e => setNick(e.target.value)} placeholder="Enter nickname" />
            <button className="pixel-btn pixel-btn-primary" onClick={saveNick} disabled={saving}>{saving ? "..." : "Save"}</button>
          </div>
          {status && <p style={{ fontFamily:"var(--font-retro)",fontSize:18,marginTop:8,color:status.includes("Error")?"var(--pixel-red)":"var(--pixel-green)" }}>{status}</p>}
        </div>

        {!loading && profile && !profile.error && (
          <>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16 }}>
              <div className="pixel-border" style={{ background:"var(--pixel-dark)",padding:14,textAlign:"center" }}>
                <div style={{ fontFamily:"var(--font-pixel)",fontSize:18,color:"var(--pixel-gold)" }}>{profile.total_xp||"0"}</div>
                <div style={{ fontFamily:"var(--font-pixel)",fontSize:7,color:"var(--pixel-gray)",marginTop:6 }}>Total XP</div>
              </div>
              <div className="pixel-border" style={{ background:"var(--pixel-dark)",padding:14,textAlign:"center" }}>
                <div style={{ fontFamily:"var(--font-pixel)",fontSize:18,color:"var(--pixel-green)" }}>{profile.total_correct||"0"}</div>
                <div style={{ fontFamily:"var(--font-pixel)",fontSize:7,color:"var(--pixel-gray)",marginTop:6 }}>Correct</div>
              </div>
              <div className="pixel-border" style={{ background:"var(--pixel-dark)",padding:14,textAlign:"center" }}>
                <div style={{ fontFamily:"var(--font-pixel)",fontSize:18,color:"var(--pixel-red)" }}>{profile.total_wrong||"0"}</div>
                <div style={{ fontFamily:"var(--font-pixel)",fontSize:7,color:"var(--pixel-gray)",marginTop:6 }}>Wrong</div>
              </div>
            </div>
            <div className="pixel-border" style={{ background:"var(--pixel-dark)",padding:14,textAlign:"center",marginBottom:20 }}>
              <div style={{ fontFamily:"var(--font-pixel)",fontSize:18,color:"var(--pixel-blue)" }}>{profile.games_played||"0"}</div>
              <div style={{ fontFamily:"var(--font-pixel)",fontSize:7,color:"var(--pixel-gray)",marginTop:6 }}>Games Played</div>
            </div>
          </>
        )}

        <button className="pixel-btn pixel-btn-gray" style={{ width:"100%" }} onClick={() => router.push("/")}>Back to Home</button>
      </div>
    </div>
  );
}