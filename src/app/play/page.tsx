"use client";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWallet } from "@/lib/wallet-provider";

function PlayContent() {
  const router = useRouter();
  const params = useSearchParams();
  const gameId = params.get("id") || "";
  const { connected, read, write, C } = useWallet();

  const [questions, setQuestions] = useState<any[]>([]);
  const [theme, setTheme] = useState("");
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState<(boolean|null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timePer, setTimePer] = useState(60);
  const [phase, setPhase] = useState<"load"|"play"|"submit"|"done">("load");
  const [lb, setLb] = useState<any[]>([]);
  const timer = useRef<any>(null);

  useEffect(() => {
    if (!connected || !gameId) { router.push("/rooms"); return; }
    (async () => {
      try {
        const res = await read(C.TRULESES, "get_questions", [gameId]);
        const d = JSON.parse(res as string);
        if (d.error) { if (d.error.includes("not started")) { router.push(`/lobby?id=${gameId}`); } else { router.push("/rooms"); } return; }
        setQuestions(d.questions || []);
        setTheme(d.theme || "");
        setTimePer(+(d.time_per_question || 60));
        setTimeLeft(+(d.time_per_question || 60));
        setAnswers(new Array((d.questions||[]).length).fill(null));
        setPhase("play");
      } catch { router.push("/rooms"); }
    })();
  }, [connected, gameId]);

  useEffect(() => {
    if (phase !== "play") return;
    timer.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { doAnswer(false); return 0; } return t-1; });
    }, 1000);
    return () => clearInterval(timer.current);
  }, [phase, cur]);

  const doAnswer = useCallback((ans: boolean) => {
    clearInterval(timer.current);
    const na = [...answers]; na[cur] = ans; setAnswers(na);
    if (cur < questions.length-1) { setCur(c => c+1); setTimeLeft(timePer); }
    else submitAll(na);
  }, [answers, cur, questions.length, timePer]);

  const submitAll = async (fa: (boolean|null)[]) => {
    setPhase("submit");
    try {
      await write(C.TRULESES, "submit_answers", [gameId, JSON.stringify(fa)]);
      const r = await read(C.TRULESES, "get_leaderboard", [gameId]);
      setLb(JSON.parse(r as string).leaderboard || []);
      setPhase("done");
    } catch { setPhase("play"); }
  };

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

  if (phase === "load") return <div style={{ textAlign:"center",padding:80 }}><p className="glow" style={{ fontFamily:"var(--font-pixel)",fontSize:14,color:"var(--pixel-gold)" }}>Loading quiz...</p></div>;

  if (phase === "submit") return (
    <div style={{ textAlign:"center",padding:80 }}>
      <div className="pulse" style={{ marginBottom:20 }}>
        <svg viewBox="0 0 16 16" width="48" height="48" style={{ imageRendering:"pixelated" as const }}><rect x="2" y="6" width="12" height="4" fill="#e2b714"/><rect x="6" y="2" width="4" height="12" fill="#e2b714"/></svg>
      </div>
      <p className="glow" style={{ fontFamily:"var(--font-pixel)",fontSize:14,color:"var(--pixel-gold)" }}>Submitting on-chain...</p>
      <p style={{ fontFamily:"var(--font-retro)",fontSize:22,color:"var(--pixel-gray)",marginTop:10 }}>Validators checking your answers</p>
    </div>
  );

  if (phase === "done") return (
    <div className="slide-up" style={{ maxWidth:600,margin:"0 auto",padding:20 }}>
      <div className="pixel-border pixel-card">
        <div style={{ textAlign:"center",marginBottom:20 }}>
          <h2 className="glow" style={{ fontFamily:"var(--font-pixel)",fontSize:20,color:"var(--pixel-gold)",marginBottom:8 }}>Game Over!</h2>
          <p style={{ fontFamily:"var(--font-retro)",fontSize:24,color:"var(--pixel-green)" }}>{theme}</p>
        </div>
        <div className="lb-row lb-header pixel-border"><span>#</span><span>Player</span><span style={{ textAlign:"center" }}>Right</span><span style={{ textAlign:"center" }}>Wrong</span><span style={{ textAlign:"right" }}>XP</span></div>
        {lb.map((p,i) => (
          <div key={p.address} className="lb-row pixel-border" style={{ background:i===0?"rgba(226,183,20,0.1)":"var(--pixel-dark)" }}>
            <span style={{ fontFamily:"var(--font-pixel)",fontSize:14,color:i===0?"var(--pixel-gold)":i===1?"#bdc3c7":"var(--pixel-gray)" }}>{p.rank}</span>
            <span style={{ fontFamily:"var(--font-retro)",fontSize:22,color:"var(--pixel-white)" }}>{p.nick||p.address?.slice(0,8)+"..."}</span>
            <span style={{ fontFamily:"var(--font-retro)",fontSize:22,color:"var(--pixel-green)",textAlign:"center" }}>{p.correct_count}</span>
            <span style={{ fontFamily:"var(--font-retro)",fontSize:22,color:"var(--pixel-red)",textAlign:"center" }}>{p.wrong_count}</span>
            <span style={{ fontFamily:"var(--font-pixel)",fontSize:11,color:"var(--pixel-gold)",textAlign:"right" }}>{p.total_xp} XP</span>
          </div>
        ))}
        <div style={{ display:"flex",gap:12,marginTop:20 }}>
          <button className="pixel-btn pixel-btn-primary" onClick={() => router.push("/rooms")} style={{ flex:1 }}>Play Again</button>
          <button className="pixel-btn pixel-btn-gold" onClick={() => router.push("/")} style={{ flex:1 }}>Home</button>
        </div>
      </div>
    </div>
  );

  const q = questions[cur];
  const prog = (cur/questions.length)*100;
  const tPct = (timeLeft/timePer)*100;

  return (
    <div className="slide-up" style={{ maxWidth:600,margin:"0 auto",padding:20 }}>
      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:14 }}>
        <span style={{ fontFamily:"var(--font-pixel)",fontSize:11,color:"var(--pixel-gold)" }}>{theme}</span>
        <span style={{ fontFamily:"var(--font-pixel)",fontSize:11,color:"var(--pixel-gray)" }}>Q {cur+1}/{questions.length}</span>
      </div>
      <div className="progress-bar" style={{ marginBottom:12 }}><div className="progress-fill" style={{ width:`${prog}%`,background:"var(--pixel-green)" }}/></div>
      <div className="progress-bar" style={{ height:4,marginBottom:16 }}><div className="progress-fill" style={{ width:`${tPct}%`,background:timeLeft<=10?"var(--pixel-red)":"var(--pixel-gold)",transition:"width 1s linear" }}/></div>
      <div style={{ textAlign:"center",marginBottom:16 }}>
        <span className={timeLeft<=5?"blink":""} style={{ fontFamily:"var(--font-pixel)",fontSize:22,color:timeLeft<=10?"var(--pixel-red)":"var(--pixel-gold)" }}>{timeLeft}s</span>
      </div>
      <div className="pixel-border pixel-card" style={{ marginBottom:20 }}>
        <p style={{ fontFamily:"var(--font-retro)",fontSize:28,lineHeight:1.4,color:"var(--pixel-white)",textAlign:"center",minHeight:80 }}>&ldquo;{q?.q}&rdquo;</p>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20 }}>
        <button className="tf-btn tf-true" onClick={() => doAnswer(true)}>TRUE</button>
        <button className="tf-btn tf-false" onClick={() => doAnswer(false)}>FALSE</button>
      </div>
      <div style={{ display:"flex",justifyContent:"center",gap:6 }}>
        {answers.map((a,i) => <div key={i} style={{ width:14,height:14,background:a===null?"var(--pixel-border)":a?"var(--pixel-green)":"var(--pixel-red)",border:i===cur?"2px solid var(--pixel-gold)":"1px solid var(--pixel-border)" }}/>)}
      </div>
    </div>
  );
}

export default function PlayPage() {
  return <Suspense fallback={<div style={{ textAlign:"center",padding:80,fontFamily:"var(--font-pixel)",color:"var(--pixel-gold)" }}>Loading...</div>}><PlayContent /></Suspense>;
}