import { ethers, keccak256, toUtf8Bytes, Transaction } from 'ethers'

// Base Sepolia testnet
const BASE_SEPOLIA_RPC = process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'

export function getProvider() {
  return new ethers.JsonRpcProvider(BASE_SEPOLIA_RPC)
}

export async function getBalance(address: string): Promise<string> {
  const provider = getProvider()
  const balance = await provider.getBalance(address)
  return ethers.formatEther(balance)
}

export async function buildTransaction(
  from: string,
  to: string,
  valueInEth: string
): Promise<{ tx: ethers.TransactionLike; serialized: string }> {
  const provider = getProvider()
  const nonce = await provider.getTransactionCount(from)
  const feeData = await provider.getFeeData()

  const tx: ethers.TransactionLike = {
    to,
    value: ethers.parseEther(valueInEth),
    nonce,
    gasLimit: BigInt(21000),
    maxFeePerGas: feeData.maxFeePerGas,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    chainId: 84532, // Base Sepolia
    type: 2,
  }

  // Serialize unsigned transaction and hash it
  const unsignedTx = Transaction.from(tx)
  const serialized = unsignedTx.unsignedSerialized

  return { tx, serialized }
}

export function hashMessage(message: string): string {
  // EIP-191 personal sign prefix
  const prefix = '\x19Ethereum Signed Message:\n' + message.length
  return keccak256(toUtf8Bytes(prefix + message))
}

export async function broadcastTransaction(
  tx: ethers.TransactionLike,
  signature: string
): Promise<string> {
  const provider = getProvider()

  // Parse signature - Para returns 65-byte signature with r, s, v
  const sig = signature.startsWith('0x') ? signature : `0x${signature}`
  
  // Extract r, s, v from the signature (65 bytes = 130 hex chars)
  // Format: 0x + r(64 chars) + s(64 chars) + v(2 chars)
  const r = sig.slice(0, 66) // 0x + 64 chars
  const s = '0x' + sig.slice(66, 130)
  const v = parseInt(sig.slice(130, 132), 16)
  
  // Normalize v value (Para may return 0/1 or 27/28)
  const normalizedV = v < 27 ? v + 27 : v

  console.log('Signature components:', { r, s, v: normalizedV })

  // Create the signed transaction
  const unsignedTx = Transaction.from(tx)
  unsignedTx.signature = ethers.Signature.from({
    r,
    s,
    v: normalizedV,
  })

  console.log('Signed transaction serialized:', unsignedTx.serialized)

  const response = await provider.broadcastTransaction(unsignedTx.serialized)
  return response.hash
}

export function isValidAddress(address: string): boolean {
  return ethers.isAddress(address)
}

