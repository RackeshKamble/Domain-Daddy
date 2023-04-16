import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
// import Search from './components/Search'
 import Domain from './components/Domain'

// ABIs
import DomainDaddy from './abis/DomainDaddy.json'

// Config
import config from './config.json';

function App() {

  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  const [domainDaddy, setDomainDaddy] = useState(null);
  const [domains, setDomains] = useState([]); // Hooks

  const loadBlockchainData = async () => {
    
    // Load Provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    // Load Networks
    const network = await provider.getNetwork();
    const domainDaddy = new ethers.Contract(config[network.chainId].DomainDaddy.address, DomainDaddy, provider);
    setDomainDaddy(domainDaddy);
    
    const maxSupply = await domainDaddy.maxSupply();
    
    // Get Domain names
    const domains = [];

    for (var i = 1; i <= maxSupply; i++) {
      const domain = await domainDaddy.getDomains(i);
      domains.push(domain);
    }

    //Set Domains
    setDomains(domains);
   
    // Change Hardhat Account on button click
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account);
    });

  }

  useEffect(() => {
    loadBlockchainData()
  }, []);

  return (
    <div>
      <Navigation account= {account} setAccount = {setAccount}/>

      {/* <Search /> */}

      <div className='cards__section'>

        <h2 className='cards__title'>Get a Domain on Ethereum BlockChain</h2>

          <p className='cards__description'>          
            
            Register human-readable domain names that can be used to access Ethereum-based services.
          </p>
          <p className='cards__description'>
          
          Have a greater control over domain ownership and build decentralized websites and applications.
          {'\n'}</p>
        {/* Horizontal Rule */}
        <hr/>
        
        
        {/* <Domain/> */}
        <div className='cards'>
        
        {/* index is key here */}
        
        {domains.map((domain, index) => (            
            <Domain 
              domain={domain} 
              domainDaddy={domainDaddy} 
              provider={provider} 
              id={index + 1} 
              key={index}
            />
          ))
        }
        <div className="footer__copyright">
          <small>&copy; RAKESH KAMBLE. All Rights Reserved.</small>
        </div>  
      
        </div>
      </div>

    </div>
  );
}

export default App;