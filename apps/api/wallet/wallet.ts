import {
  AccountAddress,
  AccountAuthenticatorEd25519,
  Ed25519PublicKey,
  Ed25519Signature,
  generateSigningMessageForTransaction,
} from '@aptos-labs/ts-sdk'
import { AuthorizationContext } from '@privy-io/node'
import {
  RIZZ_CLUB_MODULE_FUNCTIONS,
  normalizeEd25519PublicKey,
  normalizeHex,
} from '@repo/shared'
import { api } from 'encore.dev/api'
import { toHex } from 'viem'
import { movement, privy, shinami } from './libs'
import { PRIVY_AUTHORIZATION_PRIVATE_KEY } from './secrets'

export const createWallet = api(
  { expose: true, method: 'POST', path: '/create-wallet' },
  async ({ userId }: { userId: string }): Promise<Response> => {
    try {
      const { id, address, chain_type } = await privy
        .wallets()
        .create({ chain_type: 'movement', owner: { user_id: userId } }) // const verifiedClaims = await privy.utils().auth().verifyAuthToken(token)

      return { message: 'wallet created', address, id, chain_type }
    } catch (error) {
      console.log(`Token verification failed with error ${error}.`)
      throw error
    }
  }
)

export const getProfile = api(
  { expose: true, method: 'POST', path: '/get-profile' },
  async ({ userId }: { userId: string }): Promise<Response> => {
    try {
      const user = await privy.users()._get(userId)
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

      const address = AccountAddress.from(movementWallet.address)

      const profile = await movement.view({
        payload: {
          function: RIZZ_CLUB_MODULE_FUNCTIONS.PROFILE.GET_PROFILE,
          functionArguments: [address],
        },
      })

      console.log('profile', profile)
      return { message: 'profile fetched', profile }
    } catch (error) {
      console.log(`Token verification failed with error ${error}.`)
    }

    return { message: 'tx sent' }
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

      const rawTxn = await movement.transaction.build.simple({
        sender: address,
        data: {
          function: RIZZ_CLUB_MODULE_FUNCTIONS.PROFILE.UPDATE_USERNAME,
          typeArguments: [],
          functionArguments: [
            'wwwww', // username: String
          ],
        },
        withFeePayer: true,
      })

      // Sponsor the transaction with Shinami - this returns the fee payer authenticator
      // Note: sponsorTransaction expects the raw transaction object
      const feePayerAuthenticator = await shinami.gas.sponsorTransaction(rawTxn)
      console.log('feePayerAuthenticator', feePayerAuthenticator)

      // Sign the transaction with Privy
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
        feePayerAuthenticator,
      })

      // Wait for it to be committed on-chain.
      const committed = await movement.transaction.waitForTransaction({
        transactionHash: pending.hash,
      })

      console.log('committed', committed)

      // // Sign TX using privy
      // const message = generateSigningMessageForTransaction(rawTxn)
      // const signatureResponse = await privy.wallets().rawSign(walletId, {
      //   params: { hash: toHex(message) },
      //   authorization_context: authorizationContext,
      // })

      // const signature = normalizeHex(signatureResponse.signature)
      // const senderAuthenticator = new AccountAuthenticatorEd25519(
      //   new Ed25519PublicKey(publicKey),
      //   new Ed25519Signature(signature)
      // )
      // const pending = await movement.transaction.submit.simple({
      //   transaction: rawTxn,
      //   senderAuthenticator,
      // })
      // if (!pending.hash) {
      //   throw new Error('Transaction submission failed: no hash returned')
      // }
      // const executed = await movement.waitForTransaction({
      //   transactionHash: pending.hash,
      // })
      // console.log('Executed:', executed.hash)
    } catch (error) {
      console.log(`Token verification failed with error ${error}.`)
    }

    return { message: 'tx sent' }
  }
)

interface Response {
  message: string
  profile?: unknown
  address?: string
  id?: string
  chain_type?: string
}
