"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/lib/wallet-provider";
import ConnectWallet from "@/components/connect-wallet";

export default function HistoryPage() {
  const router = useRouter();
  const { connected, read, C } = useWallet();
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State baru untuk menangani dropdown leaderboard
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loadingLb, setLoadingLb] = useState(false);

  useEffect(() => {
    if (!connected) return;
    (async () => {
      try {
        const res = await read(C.TRULESES, "get_old_games", [20]);
        const d = JSON.parse(res as string);
        setGames(d.contests || []);
      } catch { console.log("No history"); }
      setLoading(false);
    })();
  }, [connected]);

  // Fungsi untuk memunculkan/menyembunyikan leaderboard di halaman yang sama
  const handleViewClick = async (gameId: string) => {
    // Jika diklik game yang sama, maka tutup dropdown-nya
    if (expandedId === gameId) {
      setExpandedId(null);
      return;
    }

    // Buka dropdown dan mulai loading
    setExpandedId(gameId);
    setLoadingLb(true);
    setLeaderboardData([]);

    try {
      const res = await read(C.TRULESES, "get_leaderboard", [gameId]);
      const data = JSON.parse(res as string);
      setLeaderboardData(data.leaderboard || []);
    } catch (e) {
      console.log("Failed to load leaderboard");
    }
    setLoadingLb(false);
  };

  if (!connected) return <ConnectWallet />;

  return (
    <div className="slide-up" style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <div className="pixel-border pixel-card">
        <div style={{ fontFamily: "var(--font-pixel)", fontSize: 13, color: "var(--pixel-gray)", marginBottom: 20, textTransform: "uppercase", letterSpacing: 2 }}>
          Game History
        </div>

        {loading ? (
          <p style={{ fontFamily: "var(--font-retro)", fontSize: 24, color: "var(--pixel-green)", textAlign: "center", padding: 30 }}>Loading...</p>
        ) : games.length === 0 ? (
          <p style={{ fontFamily: "var(--font-retro)", fontSize: 24, color: "var(--pixel-gray)", textAlign: "center", padding: 30 }}>No finished games yet</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {games.map((g: any) => (
              <div key={g.id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                
                {/* CARD UTAMA GAME */}
                <div 
                  className="pixel-border" 
                  style={{ 
                    background: expandedId === g.id ? "var(--pixel-darker)" : "var(--pixel-dark)", 
                    padding: 14, 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onClick={() => handleViewClick(g.id)}
                >
                  <div>
                    <div style={{ fontFamily: "var(--font-pixel)", fontSize: 10, color: "var(--pixel-gold)", marginBottom: 4 }}>{g.theme}</div>
                    <div style={{ fontFamily: "var(--font-retro)", fontSize: 18, color: "var(--pixel-gray)" }}>
                      {g.id} &middot; {g.num_questions}Q &middot; {g.num_players} players
                    </div>
                  </div>
                  <button className={`pixel-btn ${expandedId === g.id ? 'pixel-btn-gray' : 'pixel-btn-blue'}`} style={{ fontSize: 9, padding: "6px 12px" }}>
                    {expandedId === g.id ? "CLOSE" : "VIEW"}
                  </button>
                </div>

                {/* AREA LEADERBOARD (DROPDOWN) */}
                {expandedId === g.id && (
                  <div className="pixel-border" style={{ background: "rgba(0,0,0,0.4)", padding: "14px", borderTop: "none" }}>
                    <div style={{ fontFamily: "var(--font-pixel)", fontSize: 10, color: "var(--pixel-green)", marginBottom: 10 }}>RESULTS</div>
                    
                    {loadingLb ? (
                       <p style={{ fontFamily: "var(--font-retro)", fontSize: 16, color: "var(--pixel-gray)", textAlign: "center" }}>Fetching ranks...</p>
                    ) : leaderboardData.length === 0 ? (
                       <p style={{ fontFamily: "var(--font-retro)", fontSize: 16, color: "var(--pixel-gray)", textAlign: "center" }}>No players played this game.</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {/* Header Tabel Mini */}
                        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-pixel)", fontSize: 8, color: "var(--pixel-gray)", borderBottom: "2px dashed var(--pixel-dark)", paddingBottom: 4 }}>
                          <span style={{ flex: 0.5 }}>#</span>
                          <span style={{ flex: 2 }}>PLAYER</span>
                          <span style={{ flex: 1, textAlign: "center" }}>R / W</span>
                          <span style={{ flex: 1, textAlign: "right" }}>XP</span>
                        </div>
                        
                        {/* List Pemain */}
                        {leaderboardData.map((player: any) => (
                          <div key={player.address} style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-retro)", fontSize: 16, color: player.rank === "1" ? "var(--pixel-gold)" : "white" }}>
                            <span style={{ flex: 0.5 }}>{player.rank}</span>
                            <span style={{ flex: 2 }}>{player.nick || player.address.substring(0, 6) + "..."}</span>
                            <span style={{ flex: 1, textAlign: "center", color: "var(--pixel-gray)" }}>
                              <span style={{color: "var(--pixel-green)"}}>{player.correct_count}</span> / <span style={{color: "var(--pixel-red)"}}>{player.wrong_count}</span>
                            </span>
                            <span style={{ flex: 1, textAlign: "right" }}>{player.total_xp}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

        <button className="pixel-btn pixel-btn-gray" style={{ marginTop: 20, width: "100%" }} onClick={() => router.push("/")}>Back to Home</button>
      </div>
    </div>
  );
}