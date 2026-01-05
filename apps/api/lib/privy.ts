import { PrivyClient } from '@privy-io/node'
import { PRIVY_APP_ID, PRIVY_SECRET_KEY } from '../hello/encore.service'

export const privy = new PrivyClient({
  appId: PRIVY_APP_ID,
  appSecret: PRIVY_SECRET_KEY,
})
