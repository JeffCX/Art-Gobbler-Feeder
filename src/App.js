import './App.css';
import './style.css';
import Header from "../src/section/Header/index"

import NFTImport from '../src/section/NFTImport/index'
import { Web3ReactProvider } from '@web3-react/core'
import web3 from 'web3'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function getLibrary(provider) {
  return new web3(provider)
}

function App() {
  return (
    <>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      theme="dark"
      pauseOnHover
     >
    </ToastContainer>
      {/* Same as */}
    <ToastContainer />
    <Web3ReactProvider getLibrary={getLibrary}>
      <Header />
      <NFTImport />
     
    </Web3ReactProvider>
    </>
  );
}

export default App;
