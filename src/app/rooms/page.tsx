"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/lib/wallet-provider";

export default function RoomsPage() {
  const router = useRouter();
  const { connected, read, C } = useWallet();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinId, setJoinId] = useState("");

  useEffect(() => {
    if (!connected) return;
    (async () => {
      try {
        const res = await read(C.TRULESES, "get_active_rooms");
        const data = JSON.parse(res as string);
        setRooms(data.rooms || []);
      } catch { console.log("No rooms"); }
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

  const goRoom = (id: string, state: string) => {
    if (state === "ACTIVE") router.push(`/play?id=${id}`);
    else router.push(`/lobby?id=${id}`);
  };

  return (
    <div className="slide-up" style={{ maxWidth:600,margin:"0 auto",padding:20 }}>
      <div className="pixel-border pixel-card">
        <div style={{ fontFamily:"var(--font-pixel)",fontSize:13,color:"var(--pixel-green)",marginBottom:20,textTransform:"uppercase",letterSpacing:2 }}>Active Rooms</div>

        {loading ? (
          <p style={{ fontFamily:"var(--font-retro)",fontSize:24,color:"var(--pixel-green)",textAlign:"center",padding:30 }}>Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <div style={{ textAlign:"center",padding:30 }}>
            <p style={{ fontFamily:"var(--font-retro)",fontSize:24,color:"var(--pixel-gray)",marginBottom:16 }}>No active rooms</p>
            <button className="pixel-btn pixel-btn-gold" onClick={() => router.push("/create")}>Create One!</button>
          </div>
        ) : (
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {rooms.map((r: any) => (
              <div key={r.id} className="pixel-border" style={{ background:"var(--pixel-dark)",padding:14,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer" }}
                onClick={() => goRoom(r.id, r.state)}>
                <div>
                  <div style={{ display:"flex",gap:8,alignItems:"center",marginBottom:4 }}>
                    <span style={{ fontFamily:"var(--font-pixel)",fontSize:10,color:"var(--pixel-gold)" }}>{r.theme}</span>
                    <span style={{ fontFamily:"var(--font-pixel)",fontSize:8,padding:"2px 8px",background:r.state==="WAITING"?"rgba(226,183,20,0.2)":"rgba(78,204,163,0.2)",color:r.state==="WAITING"?"var(--pixel-gold)":"var(--pixel-green)" }}>{r.state}</span>
                  </div>
                  <div style={{ fontFamily:"var(--font-retro)",fontSize:18,color:"var(--pixel-gray)" }}>
                    {r.id} &middot; {r.num_questions}Q &middot; {r.player_count} players
                  </div>
                </div>
                <button className="pixel-btn pixel-btn-primary" style={{ fontSize:9,padding:"8px 14px" }}>
                  {r.state === "WAITING" ? "Join" : "Play"}
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop:20,display:"flex",gap:8 }}>
          <input className="pixel-input" placeholder="Enter Room ID..." value={joinId} onChange={e => setJoinId(e.target.value)}
            onKeyDown={e => e.key==="Enter" && joinId && router.push(`/lobby?id=${joinId}`)} style={{ flex:1 }} />
          <button className="pixel-btn pixel-btn-primary" onClick={() => joinId && router.push(`/lobby?id=${joinId}`)}>Join</button>
        </div>
        <div style={{ display:"flex",gap:10,marginTop:14 }}>
          <button className="pixel-btn pixel-btn-gold" onClick={() => router.push("/create")} style={{ flex:1 }}>Create Room</button>
          <button className="pixel-btn pixel-btn-gray" onClick={() => router.push("/")}>Home</button>
        </div>
      </div>
    </div>
  );
}