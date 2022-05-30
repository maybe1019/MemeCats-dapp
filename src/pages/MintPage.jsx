import { useEthers } from '@usedapp/core'
import React, { useEffect, useState } from 'react'
import Web3 from 'web3'

import config from '../config/config.json'
import { getTotalSupply, mint } from './../utils/wallet';

export default function MintPage() {
  let [mintCnt, setMintCnt] = useState(1)
  let [totalSupply, setTotalSupply] = useState(0)

  const { account, chainId, library, activateBrowserWallet } = useEthers()

  useEffect(() => {
    loadTotalSupply()
    setInterval(loadTotalSupply, 60000)
  }, [])

  const loadTotalSupply = async () => {
    setTotalSupply(await getTotalSupply())
  }

  const handleIncreaseMintCnt = () => {
    if(mintCnt === config.contract.maxPerWallet) return
    setMintCnt(prev => prev+1)
  }

  const handleDecreaseMintCnt = () => {
    if(mintCnt === 1) return
    setMintCnt(prev => prev-1)
  }

  const handleConnect = async () => {
    if(!account) {
      activateBrowserWallet()
    }
    else if(chainId !== config.chainId) {
      try {
        await library.provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: Web3.utils.toHex(config.chainId) }]
        });
      } catch (switchError) {
        console.log(switchError)
      }
    }
    else {
      const res = await mint(library, account, mintCnt)
      loadTotalSupply()
      window.alert(res)
    }
  }

  return (
    <div className='mint-page'>
      <div className='mint-control'>
        <h1>Meme Cats</h1>
        <h2>{totalSupply} / {config.contract.totalSupply}</h2>
        <div className='mint-cnt'>
          <button onClick={handleDecreaseMintCnt}>-</button>
          <div>{mintCnt}</div>
          <button onClick={handleIncreaseMintCnt}>+</button>
        </div>
        <div>
          <button className='mint-btn' onClick={handleConnect}>
            {
              !account ? "Connect"
              : chainId !== config.chainId ? "Change Network"
              : "Mint"
            }
          </button>
        </div>
        <p>first {config.contract.freePerWallet} free ({config.contract.freePerWallet} per wallet), then {config.contract.price} eth ({config.contract.freePerWallet} per tx)</p>
      </div>

      <div className='nft-image'>
        <img src="./images/nft.gif" alt="nft" />
      </div>
    </div>
  )
}
