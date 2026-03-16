"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/lib/wallet-provider";
import ConnectWallet from "@/components/connect-wallet";

const THEMES = ["Blockchain","Science","History","Geography","Technology","Crypto","Gaming","Sports","Movies","Music"];

export default function CreateRoom() {
  const router = useRouter();
  const { connected, write, C } = useWallet();
  const [form, setForm] = useState({ gameId:"", theme:"Blockchain", numQ:5, timeQ:60, lang:"English" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  if (!connected) return <ConnectWallet />;

  const handleCreate = async () => {
    if (!form.gameId.trim()) { setStatus("Enter a Room ID!"); return; }
    setLoading(true);
    setStatus("Creating room... AI generating questions...");
    try {
      await write(C.TRULESES, "create_room", [form.gameId, form.theme, form.numQ, form.timeQ, form.lang]);
      setStatus("Room created! Redirecting to lobby...");
      setTimeout(() => router.push(`/lobby?id=${form.gameId}`), 800);
    } catch (e: any) { setStatus("Error: " + (e?.message || e)); }
    setLoading(false);
  };

  return (
    <div className="slide-up" style={{ maxWidth:500,margin:"0 auto",padding:20 }}>
      <div className="pixel-border pixel-card">
        <div style={{ fontFamily:"var(--font-pixel)",fontSize:13,color:"var(--pixel-gold)",marginBottom:20,textTransform:"uppercase",letterSpacing:2 }}>Create Quiz Room</div>
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          <div>
            <label style={{ fontFamily:"var(--font-pixel)",fontSize:9,color:"var(--pixel-gray)",marginBottom:6,display:"block" }}>Room ID</label>
            <input className="pixel-input" placeholder="my-quiz-room" value={form.gameId} onChange={e => setForm({...form,gameId:e.target.value})} />
          </div>
          <div>
            <label style={{ fontFamily:"var(--font-pixel)",fontSize:9,color:"var(--pixel-gray)",marginBottom:6,display:"block" }}>Theme</label>
            <select className="pixel-select" value={form.theme} onChange={e => setForm({...form,theme:e.target.value})}>{THEMES.map(t => <option key={t}>{t}</option>)}</select>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            <div>
              <label style={{ fontFamily:"var(--font-pixel)",fontSize:9,color:"var(--pixel-gray)",marginBottom:6,display:"block" }}>Questions</label>
              <select className="pixel-select" value={form.numQ} onChange={e => setForm({...form,numQ:+e.target.value})}>{[5,6,7,8,9,10,12,15].map(n => <option key={n} value={n}>{n}</option>)}</select>
            </div>
            <div>
              <label style={{ fontFamily:"var(--font-pixel)",fontSize:9,color:"var(--pixel-gray)",marginBottom:6,display:"block" }}>Sec/Question</label>
              <select className="pixel-select" value={form.timeQ} onChange={e => setForm({...form,timeQ:+e.target.value})}>{[30,45,60,90,120].map(n => <option key={n} value={n}>{n}s</option>)}</select>
            </div>
          </div>
          <div>
            <label style={{ fontFamily:"var(--font-pixel)",fontSize:9,color:"var(--pixel-gray)",marginBottom:6,display:"block" }}>Language</label>
            <select className="pixel-select" value={form.lang} onChange={e => setForm({...form,lang:e.target.value})}><option>English</option><option>Indonesian</option></select>
          </div>
          {status && <p style={{ fontFamily:"var(--font-retro)",fontSize:18,color:status.includes("Error")?"var(--pixel-red)":"var(--pixel-green)" }}>{status}</p>}
          <div style={{ display:"flex",gap:12,marginTop:8 }}>
            <button className="pixel-btn pixel-btn-gold" onClick={handleCreate} disabled={loading} style={{ flex:1 }}>{loading ? "Creating..." : "Create Room"}</button>
            <button className="pixel-btn pixel-btn-gray" onClick={() => router.push("/")}>Back</button>
          </div>
        </div>
      </div>
    </div>
  );
}
