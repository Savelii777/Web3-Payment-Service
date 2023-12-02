import Web3 from "web3";
import { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import { initializeApp } from "firebase/app";
import { ethers } from "ethers";
import { getAuth, signInWithCustomToken, signOut } from "firebase/auth";
import axios from "axios";

import "./App.css";
import ConnectWalletButton from "./components/ConnectWalletButton";
import mobileCheck from "./helpers/mobileCheck";
import getLinker from "./helpers/deepLink";



const firebaseConfig = {
  apiKey: "AIzaSyB1fGu9E8w2NUsf05uMKH1Coq6sEx6kVm0",
  authDomain: "metamsk-a5083.firebaseapp.com",
  databaseURL: "https://metamsk-a5083-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "metamsk-a5083",
  storageBucket: "metamsk-a5083.appspot.com",
  messagingSenderId: "807002056444",
  appId: "1:807002056444:web:6fe0e3850f16a7988bd979",
  measurementId: "G-S29PJYNV79"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const App = () => {
  const [loading, setLoading] = useState(false);
  const [isLoggedIn , setLogin] = useState(false);
  const [address, setAddress] = useState("");
  const [error, setError] = useState();
  const [txs, setTxs] = useState([]);

  const startPayment = async ({ setError, setTxs, ether, addr }) => {
    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");

      await window.ethereum.send("eth_requestAccounts");
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();
      ethers.utils.getAddress(addr);
      const tx = await signer.sendTransaction({
        to: addr,
        value: ethers.utils.parseEther(ether)
      });
      console.log({ ether, addr });
      console.log("tx", tx);
      setTxs([tx]);
      // const userAddress = await window.ethereum.request({ method: 'eth_requestAccounts' })
      // const baseUrl = "http://localhost:4000";
      // const user = window.location.search.substring(1).split("&")[0].split("=")[1];
      // const response = await axios.get(` ${baseUrl}/transaction?user=${user}&amount=${ethers.utils.parseEther(ether)/1000000000000000000}`);
    } catch (err) {

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const userAddress = Web3.utils.toChecksumAddress(accounts[0]);
      console.log(userAddress)
      const baseUrl = "http://localhost:4000";
      const user = window.location.search.substring(1).split("&")[0].split("=")[1];
      const response = await axios.get(` ${baseUrl}/transaction?user=${user}&amount=${ethers.utils.parseEther(ether)/1000000000000000000}&address=${userAddress}`);
      setError(err.message);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setError();
    await startPayment({
      setError,
      setTxs,
      ether: data.get("ether"),
      addr: data.get("addr")
    });
  };
  const onPressConnect = async () => {
    setLoading(true);

    try {
      const yourWebUrl = "mysite.com"; // Replace with your domain
      const deepLink = `https://metamask.app.link/dapp/${yourWebUrl}`;
      const downloadMetamaskUrl = "https://metamask.io/download.html";

      if (window?.ethereum?.isMetaMask) {
        // Desktop browser
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const account = Web3.utils.toChecksumAddress(accounts[0]);
        await handleLogin(account);
      } else if (mobileCheck()) {
        // Mobile browser
        const linker = getLinker(downloadMetamaskUrl);
        linker.openURL(deepLink);
      } else {
        window.open(downloadMetamaskUrl);
      }
    } catch (error) {
      console.log(error);
      setAddress("");
    }

    setLoading(false);

    // const chainId = 18 // Polygon Mainnet
    //
    // if (window.ethereum.networkVersion !== chainId) {
    //   try {
    //     await window.ethereum.request({
    //       method: 'wallet_switchEthereumChain',
    //       params: [{ chainId: Web3.utils.toHex(chainId) }]
    //     });
    //   } catch (err) {
    //     // This error code indicates that the chain has not been added to MetaMask
    //     if (err.code === 4902) {
    //       await window.ethereum.request({
    //         method: 'wallet_addEthereumChain',
    //         params: [
    //           {
    //             chainName: 'Tron Mainnet',
    //             chainId: Web3.utils.toHex(chainId),
    //             nativeCurrency: { name: 'TRX', decimals: 18, symbol: 'TRX' },
    //             rpcUrls: ['https://tron.network/']
    //           }
    //         ]
    //       });
    //     }
    //   }
    // }
  };

  const handleLogin = async (address) => {
    const baseUrl = "http://localhost:4000";
    const response = await axios.get(`${baseUrl}/message?address=${address}`);
    const messageToSign = response?.data?.messageToSign;

    if (!messageToSign) {
      throw new Error("Invalid message to sign");
    }

    const web3 = new Web3(Web3.givenProvider);
    const signature = await web3.eth.personal.sign(messageToSign, address);

    const jwtResponse = await axios.get(
      `${baseUrl}/jwt?address=${address}&signature=${signature}`
    );

    const customToken = jwtResponse?.data?.customToken;

    if (!customToken) {
      throw new Error("Invalid JWT");
    }

    await signInWithCustomToken(auth, customToken);
    setAddress(address);

  };

  const onPressLogout = () => {
    setAddress("");
    signOut(auth);
  };

  return (
    <div className="App">
      <header className="App-header">
        <ConnectWalletButton
          onPressConnect={onPressConnect}
          onPressLogout={onPressLogout}
          loading={loading}
          address={address}
        />
         <form className="m-4" onSubmit={handleSubmit}>
          <div className="credit-card w-full lg:w-1/1 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
            <main className="mt-4 p-4">
              <h1 className="text-xl font-semibold text-gray-700 text-center">
                Send ETH payment
              </h1>
              <div className="">
                <div className="my-3 visible: hidden">
                  <input
                      type="text"
                      name="addr"
                      value="0xf11FaD9855FCF72b869626d0DCf5615ED9170078"
                      className="input input-bordered block w-full focus:ring focus:outline-none"
                      placeholder="Recipient Address"
                  />
                </div>
                <div className="my-3">
                  <input
                      name="ether"
                      type="text"
                      className="input input-bordered block w-full focus:ring focus:outline-none"
                      placeholder="Amount in ETH"
                  />
                </div>
              </div>
            </main>
            <footer className="p-4">
              <button
                  type="submit"
                  className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
              >
                Pay now
              </button>
              <ErrorMessage message={error} />
              <TxList txs={txs} />
            </footer>
          </div>
        </form>
      </header>
    </div>
  );
};

export default App;
