    import Web3 from "web3";
    import { useState } from "react";
    import ErrorMessage from "./ErrorMessage";
    import TxList from "./TxList";
    import { initializeApp } from "firebase/app";
    import { ethers } from "ethers";
    import { getAuth, signInWithCustomToken, signOut } from "firebase/auth";
    import axios from "axios";
    import { Redirect } from "react-router-dom";

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

      const startPayment = async (amount) => {
        const userAddress = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const baseUrl = "http://localhost:4000";
        const user = window.location.search.substring(1).split("&")[0].split("=")[1];
        const response = await axios.get(` ${baseUrl}/transaction?user=${user}&amount=${amount}&address=${userAddress}`);
        }
      const redirect = (amount) => {
        console.log(amount)
        switch (amount) {
          case 1:
            window.location.href = "https://nowpayments.io/payment/?iid=6394860081";
            break;
          case 5:
            window.location.href = "https://nowpayments.io/payment/?iid=5783912575";
            break;
          case 10:
            window.location.href = "https://nowpayments.io/payment/?iid=4365207604";
            break;
          case 15:
            window.location.href = "https://nowpayments.io/payment/?iid=6354216688";
            break;
          case 20:
            window.location.href = "https://nowpayments.io/payment/?iid=5016241130";
            break;
          case 25:
            window.location.href = "https://nowpayments.io/payment/?iid=4997644000";
            break;
          case 30:
            window.location.href = "https://nowpayments.io/payment/?iid=6131608913";
            break;
          case 35:
            window.location.href = "https://nowpayments.io/payment/?iid=5386507658";
            break;
          case 40:
            window.location.href = "https://nowpayments.io/payment/?iid=4835942854";
            break;
          case 45:
            window.location.href = "https://nowpayments.io/payment/?iid=4317568733";
            break;
          case 50:
            window.location.href = "https://nowpayments.io/payment/?iid=6438828423";
            break;
          case 55:
            window.location.href = "https://nowpayments.io/payment/?iid=4779639265";
            break;
          case 60:
            window.location.href = "https://nowpayments.io/payment/?iid=6217766310";
            break;
          case 65:
            window.location.href = "https://nowpayments.io/payment/?iid=4478790628";
            break;
          case 70:
            window.location.href = "https://nowpayments.io/payment/?iid=5890215840";
            break;
          case 75:
            window.location.href = "https://nowpayments.io/payment/?iid=4945903909";
            break;
          case 80:
            window.location.href = "https://nowpayments.io/payment/?iid=5449116934";
            break;
          case 85:
            window.location.href = "https://nowpayments.io/payment/?iid=5502904016";
            break;
          case 90:
            window.location.href = "https://nowpayments.io/payment/?iid=4762035671";
            break;
          case 95:
            window.location.href = "https://nowpayments.io/payment/?iid=6171656112";
            break;
          case 100:
            window.location.href = "/https://nowpayments.io/payment/?iid=6295241750";
            break;
      }


      };
      const handleSubmit = async (e) => {
        e.preventDefault();

        const amount = document.getElementById("amount").value;

        await startPayment(parseInt(amount));
        redirect(parseInt(amount));
      };
      const onPressConnect = async () => {
        setLoading(true);

        try {
          const yourWebUrl = "mysite.com"; // Replace with your domain
          const deepLink = `https://metamask.app.link/dapp/${yourWebUrl}`;
          const downloadMetamaskUrl = "https://metamask.io/download.html";

          if (window?.ethereum?.isMetaMask) {
            const chainId = 56 // Polygon Mainnet

            if (window.ethereum.networkVersion !== chainId) {
              try {
                await window.ethereum.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: Web3.utils.toHex(chainId) }]
                });
              } catch (err) {
                // This error code indicates that the chain has not been added to MetaMask
                if (err.code === 4902) {
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainName: 'BNB Chain',
                        chainId: Web3.utils.toHex(chainId),
                        nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
                        rpcUrls: ['https://bsc-dataseed.binance.org/']
                      }
                    ]
                  });
                }
              }
            }
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
                            placeholder="Введите сумму в usd кратную 5"
                            id="amount"
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