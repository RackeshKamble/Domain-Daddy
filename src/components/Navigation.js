import { ethers } from 'ethers';
import logo from '../assets/logo.svg';

import { useEffect, useState } from 'react'

const Navigation = ({ account, setAccount }) => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (account) {
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, [account]);

  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
    setConnected(true);
  };

  return (
    <nav>
      <div className='nav__brand'>
        <img src={logo} alt="Logo" />
        <h1>Domain Daddy</h1>
      </div>
      {connected ? (
        <button type="button" className="nav__connect">
          {account.slice(0, 6) + '...' + account.slice(38, 42)}
        </button>
      ) : (
        <>
          <button type="button" className="nav__connect" onClick={connectHandler}>
            Connect
          </button>
          <p className="nav__connect-message">Please connect with your MetaMask Wallet to show available domains.</p>
        </>
      )}
    </nav>
  );
};

export default Navigation;
