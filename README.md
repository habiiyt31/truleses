# TRULESES 

AI powered multiplayer True/False quiz game on GenLayer blockchain.

## Flow
1. Connect Wallet 
2. Set Nickname (on-chain via stat contract)
3. Host creates room (AI generates questions)
4. Share room link to invite players
5. Players join room (waiting lobby)
6. Host starts game (timer begins)
7. Players answer True/False questions
8. Answers submitted on-chain (auto-graded, XP calculated)
9. Leaderboard per room shown
10. Game archived on-chain

## Setup

```bash
npm install
# Edit .env.local with your contract addresses
npm run dev
```

Open http://localhost:3000

## .env.local

```
NEXT_PUBLIC_TRULESES_ADDRESS=Your Address
NEXT_PUBLIC_STORAGE_ADDRESS=Your Address
NEXT_PUBLIC_STAT_ADDRESS=Your Address
```

## Smart Contracts (deploy in order)

1. stat.py → player profiles, nicknames, global XP
2. truleses_storage.py → game archive
3. truleses.py → main game logic (needs stat + storage addresses)

After deploying truleses.py, call add_admin on stat and storage with the truleses address.

## Tech Stack
- Next.js 15 + TypeScript
- genlayer-js SDK
- GenLayer Blockchain (AI Consensus)
