import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { WalletProvider } from "@/lib/wallet-provider";
import WalletInfo from "@/components/wallet-info";

export const metadata: Metadata = { title: "TRULESES - True or False Quiz", description: "AI-powered quiz game on GenLayer" };

function Stars() {
  const s = Array.from({ length: 50 }, (_, i) => ({ id: i, l: `${Math.random()*100}%`, t: `${Math.random()*100}%`, sz: Math.random()*2+1, dl: `${Math.random()*3}s`, dr: `${Math.random()*2+2}s` }));
  return <div className="stars-bg">{s.map(x => <div key={x.id} className="star" style={{ left:x.l,top:x.t,width:x.sz,height:x.sz,animationDelay:x.dl,animationDuration:x.dr }} />)}</div>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body>
      <WalletProvider>
        <Stars />
        <nav className="navbar">
          <Link href="/" style={{ fontFamily:"var(--font-pixel)",fontSize:13,color:"var(--pixel-gold)",textDecoration:"none" }}>TRULESES</Link>
          <div style={{ display:"flex",gap:16,alignItems:"center" }}>
            <Link href="/rooms" style={{ color:"var(--pixel-green)" }}>Rooms</Link>
            <Link href="/history" style={{ color:"var(--pixel-green)" }}>History</Link>
            <Link href="/profile" style={{ color:"var(--pixel-purple)" }}>Profile</Link>
            <WalletInfo />
          </div>
        </nav>
        <main style={{ position:"relative",zIndex:1 }}>{children}</main>
      </WalletProvider>
    </body></html>
  );
}
