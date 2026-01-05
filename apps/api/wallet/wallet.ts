import { api } from 'encore.dev/api'
import { privy } from '../lib/privy'
import { AuthorizationContext } from '@privy-io/node'
import {
  AccountAddress,
  AccountAuthenticatorEd25519,
  Ed25519PublicKey,
  Ed25519Signature,
  generateSigningMessageForTransaction,
} from '@aptos-labs/ts-sdk'
import { movement } from '../lib/movement'
import { toHex } from 'viem'
import { PRIVY_AUTHORIZATION_PRIVATE_KEY } from './encore.service'

/**
 * Normalizes a hex string for Ed25519 public key (32 bytes = 64 hex chars).
 * Removes leading '00' padding if present, as Privy returns 33-byte keys.
 */
function normalizeEd25519PublicKey(hex: string): string {
  const cleaned = hex.startsWith('0x') ? hex.slice(2) : hex
  // Privy returns 33-byte keys (66 hex chars) with leading 00, but Ed25519 needs 32 bytes (64 hex chars)
  if (cleaned.length === 66 && cleaned.startsWith('00')) {
    return cleaned.slice(2)
  }
  return cleaned
}

/**
 * Normalizes a hex string by removing the '0x' prefix if present.
 */
function normalizeHex(hex: string): string {
  return hex.startsWith('0x') ? hex.slice(2) : hex
}

// test verify access token
export const createWallet = api(
  { expose: true, method: 'POST', path: '/create' },
  async ({ userId }: { userId: string }): Promise<Response> => {
    try {
      const { id, address, chain_type } = await privy
        .wallets()
        .create({ chain_type: 'movement', owner: { user_id: userId } }) // const verifiedClaims = await privy.utils().auth().verifyAuthToken(token)

      console.log(id, address, chain_type)
    } catch (error) {
      console.log(`Token verification failed with error ${error}.`)
    }

    return { message: 'wallet created' }
  }
)

export const sendTx = api(
  { expose: true, method: 'POST', path: '/send-tx' },
  async ({ userId }: { userId: string }): Promise<Response> => {
    try {
      const user = await privy.users()._get(userId)
      console.log('user', user)
      const walletsWithSessionSigners = user.linked_accounts.filter(
        (account) =>
          account.type === 'wallet' && 'id' in account && account.delegated
      )
      const authorizationContext: AuthorizationContext = {
        authorization_private_keys: [PRIVY_AUTHORIZATION_PRIVATE_KEY],
      }
      console.log('walletsWithSessionSigners', walletsWithSessionSigners)

      // Get the first Movement/Aptos wallet
      const movementWallet = walletsWithSessionSigners.find(
        (account) =>
          account.type === 'wallet' &&
          'chain_type' in account &&
          (account.chain_type === 'movement' || account.chain_type === 'aptos')
      )

      if (
        !movementWallet ||
        !('id' in movementWallet) ||
        !('public_key' in movementWallet) ||
        !('address' in movementWallet)
      ) {
        throw new Error('No Movement/Aptos wallet found')
      }

      const walletId = movementWallet.id
      if (!walletId || !movementWallet.public_key || !movementWallet.address) {
        throw new Error('Wallet information is incomplete')
      }

      const publicKey = normalizeEd25519PublicKey(movementWallet.public_key)
      const address = AccountAddress.from(movementWallet.address)
      // // 2) Build the raw transaction (SDK fills in seq#, chainId, gas if you let it)
      const rawTxn = await movement.transaction.build.simple({
        sender: address,
        data: {
          function: '0x1::coin::transfer',
          typeArguments: ['0x1::aptos_coin::AptosCoin'],
          functionArguments: [
            '0xdb2be04fdb5943e4760d008a50f8bcff6aff2e5d23b66bbd9d223c74e190996d',
            1,
          ], // amount in Octas
        },
      })
      const message = generateSigningMessageForTransaction(rawTxn)
      const signatureResponse = await privy.wallets().rawSign(walletId, {
        params: { hash: toHex(message) },
        authorization_context: authorizationContext,
      })

      const signature = normalizeHex(signatureResponse.signature)
      const senderAuthenticator = new AccountAuthenticatorEd25519(
        new Ed25519PublicKey(publicKey),
        new Ed25519Signature(signature)
      )
      const pending = await movement.transaction.submit.simple({
        transaction: rawTxn,
        senderAuthenticator,
      })
      if (!pending.hash) {
        throw new Error('Transaction submission failed: no hash returned')
      }
      const executed = await movement.waitForTransaction({
        transactionHash: pending.hash,
      })
      console.log('Executed:', executed.hash)
    } catch (error) {
      console.log(`Token verification failed with error ${error}.`)
    }

    return { message: 'tx sent' }
  }
)

interface Response {
  message: string
}
