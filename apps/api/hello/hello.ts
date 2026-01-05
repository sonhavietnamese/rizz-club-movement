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

export const get = api(
  { expose: true, method: 'GET', path: '/hello/:name' },
  async ({ name }: { name: string }): Promise<Response> => {
    const msg = `Hello ${name}!`
    return { message: msg }
  }
)

// test verify access token
export const post = api(
  { expose: true, method: 'POST', path: '/hello' },
  async ({ token }: { token: string }): Promise<Response> => {
    try {
      const verifiedClaims = await privy.utils().auth().verifyAuthToken(token)
      console.log('verifiedClaims', verifiedClaims)

      const user = await privy.users()._get(verifiedClaims.user_id)
      console.log('user', user)
      const walletsWithSessionSigners = user.linked_accounts.filter(
        (account) =>
          account.type === 'wallet' && 'id' in account && account.delegated
      )

      const authorizationContext: AuthorizationContext = {
        authorization_private_keys: ['authorization-key'],
      }

      console.log('walletsWithSessionSigners', walletsWithSessionSigners)

      const walletId = 'dzip7zqhb7odac7dctqu2azu'
      const publicKey =
        '002f11685176e58395e6a71a3d7c05d4fd9438f08a7324a4b22d03cb7448c71454' // 32-byte ed25519 public key hex
      const address = AccountAddress.from(
        '0xab2f1fa8d34811ad4367b7695220c5f239a3203be20e11e8783cee3c2895525f'
      )

      // 2) Build the raw transaction (SDK fills in seq#, chainId, gas if you let it)
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
      const signatureResponse = await privy
        .wallets()
        .rawSign(walletId, { params: { hash: toHex(message) } })
      const signature = signatureResponse as unknown as string

      // 5) Wrap pk + signature in an authenticator and submit
      const senderAuthenticator = new AccountAuthenticatorEd25519(
        new Ed25519PublicKey(publicKey),
        new Ed25519Signature(signature.slice(2))
      )

      const pending = await movement.transaction.submit.simple({
        transaction: rawTxn,
        senderAuthenticator,
      })

      const executed = await movement.waitForTransaction({
        transactionHash: pending.hash,
      })
      console.log('Executed:', executed.hash)
    } catch (error) {
      console.log(`Token verification failed with error ${error}.`)
    }

    return { message: 'Token verified' }
  }
)

interface Response {
  message: string
}
