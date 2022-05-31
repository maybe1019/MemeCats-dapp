import { useEthers } from "@usedapp/core";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Modal from "react-modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

import config from "../config/config.json";
import { getTotalSupply, mint } from "./../utils/wallet";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "400px",
  },
};

export default function MintPage() {
  const [mintCnt, setMintCnt] = useState(1);
  const [totalSupply, setTotalSupply] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    account,
    chainId,
    library,
    activate,
    activateBrowserWallet,
  } = useEthers();

  useEffect(() => {
    loadTotalSupply();
    setInterval(loadTotalSupply, 60000);
  }, []); //eslint-disable-line

  const loadTotalSupply = async () => {
    setTotalSupply(await getTotalSupply());
  };

  const handleIncreaseMintCnt = () => {
    if (mintCnt === config.contract.maxPerWallet) return;
    setMintCnt((prev) => prev + 1);
  };

  const handleDecreaseMintCnt = () => {
    if (mintCnt === 1) return;
    setMintCnt((prev) => prev - 1);
  };

  const handleConnectToMetamask = () => {
    activateBrowserWallet();
    setModalOpen(false);
  };

  const handleConnectToWalletConnect = async () => {
    setModalOpen(false);
    try {
      const provider = new WalletConnectProvider({
        infuraId: config.infuraId,
      });
      await provider.enable();
      await activate(provider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConnect = async () => {
    if (!account) {
      setModalOpen(true);
    } else if (chainId !== config.chainId) {
      try {
        await library.provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: Web3.utils.toHex(config.chainId) }],
        });
      } catch (switchError) {
        console.log(switchError);
      }
    } else {
      const res = await mint(library, account, mintCnt);
      loadTotalSupply();
      window.alert(res);
    }
  };

  return (
    <div className="mint-page">
      <div className="mint-control">
        <h1>Meme Cats</h1>
        <h2>
          {totalSupply} / {config.contract.totalSupply}
        </h2>
        <div className="mint-cnt">
          <button onClick={handleDecreaseMintCnt}>-</button>
          <div>{mintCnt}</div>
          <button onClick={handleIncreaseMintCnt}>+</button>
        </div>
        <div>
          {/* <button className="mint-btn" onClick={handleConnect}>
            {!account
              ? "Connect"
              : chainId !== config.chainId
              ? "Change Network"
              : "Mint"}
          </button> */}
          <button className="mint-btn">Sold Out</button>
        </div>
        <p>
          first {config.contract.freeMint} free ({config.contract.freePerWallet} per wallet), then {config.contract.price} eth ({config.contract.maxPerWallet} per tx)
        </p>
      </div>

      <div className="nft-image">
        <img src="./images/nft.gif" alt="nft" />
      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={customStyles}
        ariaHideApp={false}
      >
        <div className="wallet-modal">
          <div className="modal-caption">Connect Wallet</div>
          <button className="wallet-button" onClick={handleConnectToMetamask}>
            <img src="./images/metamask.svg" alt="metamask" />
            <div>Metamask</div>
          </button>

          <button
            className="wallet-button"
            onClick={handleConnectToWalletConnect}
          >
            <img src="./images/walletconnect.png" alt="walletconnect" />
            <div>Wallet Connect</div>
          </button>
        </div>
      </Modal>
    </div>
  );
}
