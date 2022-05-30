import React, { useState } from 'react'

import config from '../config/config.json'

export default function MintPage() {
  let [mintCnt, setMintCnt] = useState(1)

  const handleIncreaseMintCnt = () => {
    if(mintCnt === config.contract.maxPerWallet) return
    setMintCnt(prev => prev+1)
  }
  const handleDecreaseMintCnt = () => {
    if(mintCnt === 1) return
    setMintCnt(prev => prev-1)
  }

  return (
    <div className='mint-page'>
      <div className='mint-control'>
        <h1>Meme Cats</h1>
        <div className='mint-cnt'>
          <button onClick={handleDecreaseMintCnt}>-</button>
          <div>{mintCnt}</div>
          <button onClick={handleIncreaseMintCnt}>+</button>
        </div>
        <div>
          <button className='mint-btn'>Mint</button>
        </div>
        <p>first {config.contract.freePerWallet} free ({config.contract.freePerWallet} per wallet), then {config.contract.price} eth ({config.contract.freePerWallet} per tx)</p>
      </div>

      <div className='nft-image'>
        <img src="./images/nft.gif" alt="nft" />
      </div>
    </div>
  )
}
