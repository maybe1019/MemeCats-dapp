import Web3 from 'web3';

import abi from '../config/abi.json'
import config from '../config/config.json'

export const mint = async (library, account, cnt) => {
  const web3 = new Web3(library.provider)
  const contract = new web3.eth.Contract(abi, config.contractAddress)

  try {
    const totalSupply = parseInt(await contract.methods.totalSupply().call())
    const balance = parseInt(await contract.methods.balanceOf(account).call())

    let value = 0

    if(totalSupply + cnt <= config.contract.freeMint && balance + cnt <= config.contract.freePerWallet) {
      value = 0;
    }
    else {
      value = cnt * config.contract.price
    }

    await contract.methods.mint(cnt).send({
      from: account,
      value: Web3.utils.toWei(value + ''),
      gas: 800000
    })

    return 'Success'
  } catch (error) {
    console.log(error)
    return 'error'
  }
}

export const getTotalSupply = async () => {
  const web3 = new Web3(config.rpcUrl)
  const contract = new web3.eth.Contract(abi, config.contractAddress)

  try {
    const ts = await contract.methods.totalSupply().call()
    return parseInt(ts)
  } catch (error) {
    console.log(error)
    return 0
  }
}