-- Wallets table to map Supabase users to Para wallets
create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  para_wallet_id text not null unique,
  address text not null,
  type text not null default 'EVM',
  created_at timestamptz default now(),
  
  constraint unique_user_type unique (user_id, type)
);

-- Enable RLS
alter table public.wallets enable row level security;

-- Users can only read their own wallets
create policy "Users can view own wallets"
  on public.wallets for select
  using (auth.uid() = user_id);

-- Index for faster lookups
create index if not exists idx_wallets_user_id on public.wallets(user_id);
create index if not exists idx_wallets_address on public.wallets(address);

