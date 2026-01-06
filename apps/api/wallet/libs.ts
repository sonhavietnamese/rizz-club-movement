import { PrivyClient } from '@privy-io/node'
import { GasStationClient } from '@shinami/clients/aptos'
import {
  PRIVY_APP_ID,
  PRIVY_SECRET_KEY,
  SHINAMI_GAS_STATION_ACCESS_KEY,
} from './secrets'
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk'

export const movement = new Aptos(
  new AptosConfig({
    network: Network.CUSTOM,
    fullnode: 'https://testnet.movementnetwork.xyz/v1',
    faucet: 'https://faucet.testnet.movementnetwork.xyz/',
  })
)

export const privy = new PrivyClient({
  appId: PRIVY_APP_ID,
  appSecret: PRIVY_SECRET_KEY,
})

export const shinami = {
  gas: new GasStationClient(SHINAMI_GAS_STATION_ACCESS_KEY),
}
