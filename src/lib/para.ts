// Para REST API client
const PARA_API_URL = process.env.PARA_API_URL || 'https://api.beta.getpara.com'
const PARA_API_KEY = process.env.PARA_API_KEY!

type WalletType = 'EVM' | 'SOLANA' | 'COSMOS'
type WalletStatus = 'creating' | 'ready'

interface Wallet {
  id: string
  type: WalletType
  status: WalletStatus
  address?: string
  publicKey?: string
  createdAt: string
}

interface CreateWalletResponse {
  wallet: Wallet
  scheme: string
}

interface SignResponse {
  signature: string
}

async function paraRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${PARA_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'X-API-Key': PARA_API_KEY,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Para API error details:', {
      status: response.status,
      statusText: response.statusText,
      error,
      endpoint,
    })
    throw new Error(`Para API error: ${response.status} - ${error}`)
  }

  return response.json()
}

export async function createWallet(
  userIdentifier: string,
  userIdentifierType: 'EMAIL' | 'CUSTOM_ID' = 'CUSTOM_ID',
  type: WalletType = 'EVM'
): Promise<CreateWalletResponse> {
  return paraRequest<CreateWalletResponse>('/v1/wallets', {
    method: 'POST',
    body: JSON.stringify({
      type,
      userIdentifier,
      userIdentifierType,
    }),
  })
}

export async function getWallet(walletId: string): Promise<Wallet> {
  return paraRequest<Wallet>(`/v1/wallets/${walletId}`)
}

export async function pollWalletReady(
  walletId: string,
  maxAttempts = 10,
  delayMs = 1000
): Promise<Wallet> {
  for (let i = 0; i < maxAttempts; i++) {
    const wallet = await getWallet(walletId)
    if (wallet.status === 'ready') {
      return wallet
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }
  throw new Error('Wallet creation timed out')
}

export async function signRaw(
  walletId: string,
  data: string
): Promise<SignResponse> {
  // Para API requires 0x prefix and even length hex string
  const hexData = data.startsWith('0x') ? data : `0x${data}`
  
  console.log('Para signRaw - walletId:', walletId)
  console.log('Para signRaw - data:', hexData)
  
  return await paraRequest<SignResponse>(`/v1/wallets/${walletId}/sign-raw`, {
    method: 'POST',
    body: JSON.stringify({ data: hexData }),
  })
}

