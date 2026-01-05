import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk'

export const movement = new Aptos(
  new AptosConfig({
    network: Network.CUSTOM,
    fullnode: 'https://testnet.movementnetwork.xyz/v1',
    faucet: 'https://faucet.testnet.movementnetwork.xyz/',
  })
)
