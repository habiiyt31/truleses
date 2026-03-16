"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWallet } from "@/lib/wallet-provider";
import ConnectWallet from "@/components/connect-wallet";

function LobbyContent() {
  const router = useRouter();
  const params = useSearchParams();
  const gameId = params.get("id") || "";
  const { address, connected, read, write, C } = useWallet();

  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [starting, setStarting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState("");

  const fetchRoom = async () => {
    try {
      const res = await read(C.TRULESES, "get_room_info", [gameId]);
      const data = JSON.parse(res as string);
      if (data.error) { setErr(data.error); setLoading(false); return; }
      setRoom(data);
      if (data.game_state === "ACTIVE") { router.push(`/play?id=${gameId}`); return; }
      if (data.game_state === "FINISHED") { router.push(`/leaderboard?id=${gameId}`); return; }
    } catch (e: any) { setErr(e?.message || "Failed to load"); }
    setLoading(false);
  };

  useEffect(() => { if (connected && gameId) fetchRoom(); }, [connected, gameId]);
  useEffect(() => {
    if (!connected || !gameId) return;
    const i = setInterval(fetchRoom, 5000);
    return () => clearInterval(i);
  }, [connected, gameId]);

  if (!connected) return <ConnectWallet />;
  if (loading) return <div style={{ textAlign:"center",padding:80,fontFamily:"var(--font-pixel)",color:"var(--pixel-gold)" }}>Loading lobby...</div>;
  if (err) return <div style={{ textAlign:"center",padding:60 }}><p style={{ fontFamily:"var(--font-pixel)",fontSize:12,color:"var(--pixel-red)",marginBottom:16 }}>{err}</p><button className="pixel-btn pixel-btn-gray" onClick={() => router.push("/rooms")}>Back</button></div>;
  if (!room) return null;

  const isHost = address?.toLowerCase() === room.game_creator?.toLowerCase();
  const hasJoined = room.players?.some((p: any) => p.address?.toLowerCase() === address?.toLowerCase());
  const shareLink = typeof window !== "undefined" ? `${window.location.origin}/lobby?id=${gameId}` : "";

  const handleJoin = async () => {
    setJoining(true);
    try { await write(C.TRULESES, "join_room", [gameId]); await fetchRoom(); } catch (e: any) { setErr(e?.message || "Failed"); }
    setJoining(false);
  };

  const handleStart = async () => {
    setStarting(true);
    try { await write(C.TRULESES, "start_game", [gameId]); router.push(`/play?id=${gameId}`); } catch (e: any) { setErr(e?.message || "Failed"); }
    setStarting(false);
  };

  return (
    <div className="slide-up" style={{ maxWidth:560,margin:"0 auto",padding:20 }}>
      <div className="pixel-border pixel-card">
        <div style={{ textAlign:"center",marginBottom:20 }}>
          <div style={{ fontFamily:"var(--font-pixel)",fontSize:9,color:"var(--pixel-gray)",marginBottom:6,textTransform:"uppercase",letterSpacing:2 }}>Waiting Room</div>
          <h2 style={{ fontFamily:"var(--font-pixel)",fontSize:16,color:"var(--pixel-gold)",marginBottom:6 }}>{room.game_theme}</h2>
          <p style={{ fontFamily:"var(--font-retro)",fontSize:20,color:"var(--pixel-gray)" }}>{room.game_num_questions} questions &middot; {room.game_time_per_question}s each</p>
          <p style={{ fontFamily:"var(--font-retro)",fontSize:18,color:"var(--pixel-gray)" }}>Room: {gameId}</p>
        </div>

        <div style={{ marginBottom:20 }}>
          <label style={{ fontFamily:"var(--font-pixel)",fontSize:9,color:"var(--pixel-gray)",marginBottom:6,display:"block" }}>Share link to invite players</label>
          <div className="copy-link" onClick={() => { navigator.clipboard.writeText(shareLink); setCopied(true); setTimeout(() => setCopied(false),2000); }}>
            {copied ? "Copied!" : shareLink}
          </div>
        </div>

        <div style={{ marginBottom:20 }}>
          <div style={{ fontFamily:"var(--font-pixel)",fontSize:9,color:"var(--pixel-green)",marginBottom:8 }}>Players ({room.player_count || 0})</div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:4 }}>
            {(room.players || []).map((p: any, i: number) => (
              <div key={i} className="player-pill">
                {p.nick || (p.address?.slice(0,6) + "..." + p.address?.slice(-4))}
                {p.address?.toLowerCase() === room.game_creator?.toLowerCase() && <span style={{ fontFamily:"var(--font-pixel)",fontSize:8,color:"var(--pixel-gold)",marginLeft:4 }}>HOST</span>}
              </div>
            ))}
            {(!room.players || room.players.length === 0) && <p style={{ fontFamily:"var(--font-retro)",fontSize:20,color:"var(--pixel-gray)" }}>No players yet</p>}
          </div>
        </div>

        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {!isHost && !hasJoined && <button className="pixel-btn pixel-btn-primary" style={{ width:"100%" }} onClick={handleJoin} disabled={joining}>{joining ? "Joining..." : "Join Room"}</button>}
          {!isHost && hasJoined && (
            <div style={{ textAlign:"center",padding:12,background:"rgba(78,204,163,0.1)",border:"1px solid var(--pixel-green)" }}>
              <p style={{ fontFamily:"var(--font-pixel)",fontSize:10,color:"var(--pixel-green)" }}>Joined! Waiting for host...</p>
            </div>
          )}
          {isHost && <button className="pixel-btn pixel-btn-gold" style={{ width:"100%",fontSize:13,padding:16 }} onClick={handleStart} disabled={starting}>{starting ? "Starting..." : "Start Game"}</button>}
          <button className="pixel-btn pixel-btn-gray" style={{ width:"100%" }} onClick={() => router.push("/rooms")}>Back to Rooms</button>
        </div>
      </div>
    </div>
  );
}

export default function LobbyPage() {
  return <Suspense fallback={<div style={{ textAlign:"center",padding:80,fontFamily:"var(--font-pixel)",color:"var(--pixel-gold)" }}>Loading...</div>}><LobbyContent /></Suspense>;
}
