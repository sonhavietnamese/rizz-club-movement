import { secret } from 'encore.dev/config'

export const PRIVY_APP_ID = secret('PRIVY_APP_ID')()
export const PRIVY_CLIENT_ID = secret('PRIVY_CLIENT_ID')()
export const PRIVY_SECRET_KEY = secret('PRIVY_SECRET_KEY')()
export const PRIVY_VERIFICATION_KEY = secret('PRIVY_VERIFICATION_KEY')()
export const PRIVY_AUTHORIZATION_KEY_ID = secret('PRIVY_AUTHORIZATION_KEY_ID')()
export const PRIVY_AUTHORIZATION_PRIVATE_KEY = secret(
  'PRIVY_AUTHORIZATION_PRIVATE_KEY'
)()

// Shinami secrets
export const SHINAMI_GAS_STATION_ACCESS_KEY = secret(
  'SHINAMI_GAS_STATION_ACCESS_KEY'
)()
