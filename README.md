# 🔐 Para Wallet Demo

A production-ready example of integrating [Para REST API](https://docs.getpara.com/v2/rest/overview) with Next.js and Supabase to create a seamless crypto wallet experience.

> **No seed phrases. No complexity. Just secure wallets.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3FCF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Para](https://img.shields.io/badge/Para-REST%20API-FF4E00?style=flat-square)](https://docs.getpara.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [How Para Integration Works](#-how-para-integration-works)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Project Structure](#-project-structure)
- [Using Para in Your Project](#-using-para-in-your-project)
- [API Reference](#-api-reference)
- [Security](#-security)

---

## 🎯 Overview

This project demonstrates how to build a complete wallet solution using:

| Service | Purpose |
|---------|---------|
| **Para REST API** | Wallet creation & transaction signing via [MPC](https://docs.getpara.com/v2/concepts/security#multi-party-computation-mpc) |
| **Supabase** | User authentication & wallet data storage |
| **Next.js 16** | Full-stack React framework with Server Actions |
| **ethers.js** | Ethereum transaction building & broadcasting |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Browser)                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Sign Up   │  │   Log In    │  │  Dashboard  │  │   Send Transaction  │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
└─────────┼────────────────┼────────────────┼────────────────────┼────────────┘
          │                │                │                    │
          ▼                ▼                ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           NEXT.JS SERVER                                     │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        Server Actions                                 │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────┐  │   │
│  │  │  signup()  │  │  login()   │  │ getWallet()│  │sendTransaction()│  │   │
│  │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └───────┬────────┘  │   │
│  └────────┼───────────────┼───────────────┼─────────────────┼───────────┘   │
│           │               │               │                 │               │
│  ┌────────┼───────────────┼───────────────┼─────────────────┼───────────┐   │
│  │        ▼               ▼               ▼                 ▼           │   │
│  │  ┌──────────────────────────┐    ┌──────────────────────────────┐   │   │
│  │  │     lib/supabase/        │    │         lib/para.ts          │   │   │
│  │  │  • server.ts (SSR)       │    │  • createWallet()            │   │   │
│  │  │  • client.ts (CSR)       │    │  • signRaw()                 │   │   │
│  │  └────────────┬─────────────┘    └──────────────┬───────────────┘   │   │
│  │               │                                 │                   │   │
│  │  ┌────────────┼─────────────────────────────────┼───────────────┐   │   │
│  │  │            ▼                                 ▼               │   │   │
│  │  │  ┌─────────────────────────────────────────────────────┐    │   │   │
│  │  │  │              lib/ethereum.ts                         │    │   │   │
│  │  │  │  • buildTransaction()  • broadcastTransaction()      │    │   │   │
│  │  │  └─────────────────────────────────────────────────────┘    │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  └────────────────────────────────────────────────────────────────────┘   │
└───────────┬───────────────────────────────────┬───────────────────────────┘
            │                                   │
            ▼                                   ▼
┌───────────────────────────┐       ┌───────────────────────────┐
│        SUPABASE           │       │      PARA REST API        │
│                           │       │                           │
│  ┌─────────────────────┐  │       │  ┌─────────────────────┐  │
│  │    Authentication   │  │       │  │   Wallet Creation   │  │
│  │  • Email/Password   │  │       │  │   POST /v1/wallets  │  │
│  │  • Session Mgmt     │  │       │  └─────────────────────┘  │
│  └─────────────────────┘  │       │                           │
│                           │       │  ┌─────────────────────┐  │
│  ┌─────────────────────┐  │       │  │   Transaction Sign  │  │
│  │      Database       │  │       │  │ POST /v1/wallets/   │  │
│  │  • wallets table    │  │       │  │    {id}/sign-raw    │  │
│  │  • user mappings    │  │       │  └─────────────────────┘  │
│  └─────────────────────┘  │       │                           │
└───────────────────────────┘       │  ┌─────────────────────┐  │
                                    │  │    MPC Security     │  │
            │                       │  │  Keys never exposed │  │
            │                       │  └─────────────────────┘  │
            ▼                       └───────────────────────────┘
┌───────────────────────────┐                   │
│    BASE SEPOLIA NETWORK   │                   │
│                           │◄──────────────────┘
│  • Transaction broadcast  │    (Signed TX)
│  • Balance queries        │
│  • Chain ID: 84532        │
└───────────────────────────┘
```

---

## 🔄 How Para Integration Works

### 1️⃣ User Signs Up

```
User → Supabase Auth → Create Para Wallet → Store Mapping → Dashboard
```

```typescript
// 1. Create user in Supabase
const { data } = await supabase.auth.signUp({ email, password })

// 2. Create wallet via Para REST API
const { wallet } = await createWallet(data.user.id, 'CUSTOM_ID', 'EVM')

// 3. Poll until wallet is ready
const readyWallet = await pollWalletReady(wallet.id)

// 4. Store wallet mapping in Supabase
await supabase.from('wallets').insert({
  user_id: data.user.id,
  para_wallet_id: readyWallet.id,
  address: readyWallet.address
})
```

### 2️⃣ User Sends Transaction

```
Build TX → Hash → Sign with Para → Broadcast → Confirmed
```

```typescript
// 1. Build unsigned transaction
const { tx, serialized } = await buildTransaction(from, to, amount)

// 2. Hash for signing
const txHash = keccak256(serialized)

// 3. Sign with Para (MPC - keys never leave Para)
const { signature } = await signRaw(walletId, txHash)

// 4. Broadcast to network
const hash = await broadcastTransaction(tx, signature)
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔑 **Instant Wallets** | EVM wallet created automatically on signup |
| 🛡️ **MPC Security** | Private keys secured via Multi-Party Computation |
| 💸 **Send ETH** | Transfer ETH on Base Sepolia testnet |
| 📊 **Balance Tracking** | Real-time balance updates |
| 🔐 **Auth Flow** | Complete signup/login with email verification |
| ⚡ **Server Actions** | Type-safe server-side operations |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- [Supabase](https://supabase.com) account
- [Para API Key](https://developer.getpara.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/para-wallet-demo.git
cd para-wallet-demo

# Install dependencies
bun install
# or
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🔧 Environment Variables

Create a `.env.local` file with the following:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Para REST API
PARA_API_KEY=sk_your_para_api_key
PARA_API_URL=https://api.beta.getpara.com

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Ethereum (Optional - defaults to public RPC)
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

---

## 🗄️ Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Create wallets table
CREATE TABLE wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  para_wallet_id TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'EVM',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

-- Users can only read their own wallets
CREATE POLICY "Users can view own wallets"
  ON wallets FOR SELECT
  USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_wallets_address ON wallets(address);
```

---

## 📁 Project Structure

```
para-wallet-demo/
├── app/
│   ├── actions/
│   │   ├── auth.ts          # Authentication server actions
│   │   └── wallet.ts        # Wallet & transaction server actions
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts     # OAuth callback handler
│   ├── dashboard/
│   │   ├── page.tsx         # Dashboard page
│   │   └── DashboardClient.tsx
│   ├── login/
│   │   ├── page.tsx
│   │   └── LoginForm.tsx
│   ├── signup/
│   │   ├── page.tsx
│   │   └── SignupForm.tsx
│   ├── layout.tsx
│   └── page.tsx             # Landing page
├── lib/
│   ├── para.ts              # Para REST API client
│   ├── ethereum.ts          # Ethereum utilities
│   └── supabase/
│       ├── client.ts        # Browser Supabase client
│       └── server.ts        # Server Supabase client
├── middleware.ts            # Auth middleware
└── migrations/
    └── 001_create_wallets.sql
```

---

## 🔌 Using Para in Your Project

### Step 1: Create Para Client

```typescript
// lib/para.ts
const PARA_API_URL = 'https://api.beta.getpara.com'
const PARA_API_KEY = process.env.PARA_API_KEY!

async function paraRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${PARA_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'X-API-Key': PARA_API_KEY,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  
  if (!response.ok) {
    throw new Error(`Para API error: ${response.status}`)
  }
  
  return response.json()
}
```

### Step 2: Create Wallets

```typescript
export async function createWallet(
  userIdentifier: string,
  userIdentifierType: 'EMAIL' | 'CUSTOM_ID' = 'CUSTOM_ID',
  type: 'EVM' | 'SOLANA' | 'COSMOS' = 'EVM'
) {
  return paraRequest('/v1/wallets', {
    method: 'POST',
    body: JSON.stringify({ type, userIdentifier, userIdentifierType }),
  })
}
```

### Step 3: Sign Transactions

```typescript
export async function signRaw(walletId: string, data: string) {
  // Para requires 0x prefix
  const hexData = data.startsWith('0x') ? data : `0x${data}`
  
  return paraRequest(`/v1/wallets/${walletId}/sign-raw`, {
    method: 'POST',
    body: JSON.stringify({ data: hexData }),
  })
}
```

### Step 4: Build & Broadcast Transactions

```typescript
import { ethers, Transaction } from 'ethers'

// Build transaction
const tx = {
  to: recipientAddress,
  value: ethers.parseEther(amount),
  nonce: await provider.getTransactionCount(from),
  gasLimit: 21000n,
  maxFeePerGas: feeData.maxFeePerGas,
  maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
  chainId: 84532, // Base Sepolia
  type: 2,
}

// Hash unsigned transaction
const unsignedTx = Transaction.from(tx)
const txHash = keccak256(unsignedTx.unsignedSerialized)

// Sign with Para
const { signature } = await signRaw(walletId, txHash)

// Apply signature and broadcast
unsignedTx.signature = ethers.Signature.from({
  r: signature.slice(0, 66),
  s: '0x' + signature.slice(66, 130),
  v: parseInt(signature.slice(130, 132), 16) + 27,
})

await provider.broadcastTransaction(unsignedTx.serialized)
```

---

## 📚 API Reference

### Para REST API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/wallets` | POST | Create a new wallet |
| `/v1/wallets/{id}` | GET | Get wallet details |
| `/v1/wallets/{id}/sign-raw` | POST | Sign raw bytes |

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-API-Key` | Yes | Your Para API key |
| `X-Request-Id` | No | UUID for request tracing |

📖 [Full Para REST API Documentation](https://docs.getpara.com/v2/rest/overview)

---

## 🛡️ Security

This project leverages Para's security features:

- **🔐 MPC (Multi-Party Computation)**: Private keys are split across multiple parties. The full key never exists in one place.
- **🏰 Hardware Secure Enclaves**: Keys are protected by hardware-level security.
- **🚫 No Seed Phrases**: Users don't need to manage seed phrases.
- **🔑 Server-Side Signing**: All signing happens server-side via Para's secure infrastructure.

📖 [Learn more about Para Security](https://docs.getpara.com/v2/concepts/security)

---

## 📝 License

MIT License - feel free to use this as a starting point for your project!

---

## 🔗 Links

- [Para Documentation](https://docs.getpara.com)
- [Para REST API](https://docs.getpara.com/v2/rest/overview)
- [Para Developer Portal](https://developer.getpara.com)
- [Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia)
- [Supabase Documentation](https://supabase.com/docs)

---

<p align="center">
  Built using <a href="https://docs.getpara.com">Para</a> + <a href="https://supabase.com">Supabase</a> + <a href="https://nextjs.org">Next.js</a>
</p>
