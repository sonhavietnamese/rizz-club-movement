'use client'
import { env } from '@/env'
import {
  getAccessToken,
  useActiveWallet,
  usePrivy,
  useSessionSigners,
  useSigners,
} from '@privy-io/react-auth'

type WalletInfo = {
  address: string
  type: 'movement'
  name: string
}

export default function Test() {
  const { addSigners } = useSigners()
  const { user, unlinkWallet } = usePrivy()
  const activeWallet = useActiveWallet()

  const handleUser = async () => {
    console.log(user)
  }

  const handleUnlinkWallet = async () => {
    console.log(user?.linkedAccounts)
    // unlink
    const unlinkedWallet = await unlinkWallet(user?.linkedAccounts[1].address)
    console.log(unlinkedWallet)
  }

  const handle = async () => {
    const authToken = await getAccessToken()

    console.log(authToken)

    // make request to api
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/hello`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: authToken }),
    })

    const data = await response.json()
    console.log(data)
  }

  const handleAddSigners = async () => {
    const signers = await addSigners({
      address: '0xe2bD27752ec8221492b24dA776E11b048794C46D',
      signers: [
        {
          signerId: 'evx3jdgy9q0cyj7jwbvt3roc',
        },
      ],
    })
    console.log(signers)
  }

  const handleSignMessage = async () => {
    // send request to api to sign message
  }

  const handleCreateWallet = async () => {
    console.log(user?.id)
    // send request to api to create wallet
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user?.id }),
    })
    const data = await response.json()
    console.log(data)
  }

  const handleSendTx = async () => {
    console.log(user)
    // try {
    //   // should check if the signer is already added
    //   await addSigners({
    //     address:
    //       '0x0c30e9ef26abb6a213717c54f636ba56ad0bffc6a0be07fffdee1314be11dbda',
    //     signers: [
    //       {
    //         signerId: 'evx3jdgy9q0cyj7jwbvt3roc',
    //       },
    //     ],
    //   })
    // } catch (error) {
    //   console.log(error)
    // }

    // send request to api to send tx
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/send-tx`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user?.id }),
    })
    const data = await response.json()
    console.log(data)
  }

  return (
    <div className="flex flex-col gap-2">
      <button onClick={handleCreateWallet}>Create Wallet</button>
      <button onClick={handleSendTx}>Send Tx</button>
      {/* <button onClick={handleUser}>Get User</button>
      <button onClick={handle}>Get Access Token</button>
      <button onClick={handleAddSigners}>Add Signers</button>
      <button onClick={handleUnlinkWallet}>Unlink Wallet</button> */}
    </div>
  )
}
