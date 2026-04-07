# TRULESES

AI-powered multiplayer True/False quiz game built on GenLayer
Intelligent Contracts

TRULESES demonstrates how GenLayer Intelligent Contracts can power
interactive multiplayer applications using AI-generated content and
on-chain validation. Questions are generated dynamically by AI, answers
are evaluated transparently through AI consensus, and results are
permanently stored on-chain, ensuring fairness without relying on
centralized systems.

Player profiles, nicknames, and XP progression are stored on-chain,
allowing identity and achievements to persist across multiple game
sessions. Each game room produces a verifiable leaderboard, showcasing
how AI consensus can support real-time interaction and trustless
scoring.

------------------------------------------------------------------------

## Features

-   AI-generated True/False questions
-   Multiplayer real-time gameplay
-   On-chain answer validation using AI consensus
-   Persistent player profiles and XP
-   Verifiable leaderboard per game room
-   Fully on-chain game archive
-   Modular Intelligent Contract architecture
-   Transparent and trustless scoring

------------------------------------------------------------------------

## Architecture Overview

The Intelligent Contract system is modular to demonstrate composability
within the GenLayer ecosystem:

  Contract              Purpose
  --------------------- --------------------------------------------------
  stat.py               Stores player profiles, nicknames, and global XP
  truleses_storage.py   Stores completed game sessions
  truleses.py           Main game logic and AI-powered question flow

The main contract interacts with stat and storage contracts, showing how
multiple Intelligent Contracts can work together.

------------------------------------------------------------------------

## Game Flow

1.  Player connects wallet
2.  Player sets nickname (stored on-chain via stat contract)
3.  Host creates a game room
4.  AI generates True/False questions
5.  Host shares room link
6.  Players join waiting lobby
7.  Host starts the game
8.  Question timer begins
9.  Players answer True or False in real time
10. Answers are submitted on-chain
11. AI consensus evaluates answers
12. XP is calculated automatically
13. Leaderboard is generated for each room
14. Game session is permanently archived on-chain

------------------------------------------------------------------------

## Tech Stack

-   Next.js 15
-   TypeScript
-   genlayer-js SDK
-   GenLayer Intelligent Contracts
-   AI Consensus validation

------------------------------------------------------------------------

## Installation

Clone the repository and install dependencies:

``` bash
npm install
```

Create a `.env.local`and add to `contracts.ts` file and configure contract addresses:

    NEXT_PUBLIC_TRULESES_ADDRESS=Your Address
    NEXT_PUBLIC_STORAGE_ADDRESS=Your Address
    NEXT_PUBLIC_STAT_ADDRESS=Your Address

Start the development server:

``` bash
npm run dev
```

Open:

    http://localhost:3000

------------------------------------------------------------------------

## Contract Deployment Order

Deploy Intelligent Contracts in the following order:

1.  stat.py\
    Stores player profiles, nicknames, and XP

2.  truleses_storage.py\
    Stores completed game sessions

3.  truleses.py\
    Main game logic (requires stat and storage contract addresses)

After deploying `truleses.py`, grant admin permissions:

Call `add_admin` on both stat and storage contracts using the truleses
contract address.

------------------------------------------------------------------------

## Environment Configuration

Example `.env.local`:

    NEXT_PUBLIC_TRULESES_ADDRESS=0xYourContractAddress
    NEXT_PUBLIC_STORAGE_ADDRESS=0xYourContractAddress
    NEXT_PUBLIC_STAT_ADDRESS=0xYourContractAddress

------------------------------------------------------------------------

## Purpose

TRULESES showcases how GenLayer can be used beyond DeFi by enabling:

-   Multiplayer on-chain games
-   AI-driven user interaction
-   Persistent on-chain identity
-   Transparent game mechanics
-   Composable Intelligent Contracts

------------------------------------------------------------------------

## Future Improvements

-   Additional game modes
-   Difficulty scaling AI questions
-   NFT achievements
-   Seasonal leaderboards
-   Tournament rooms
-   Social features
