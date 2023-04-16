import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

const Domain = ({ domain, domainDaddy, provider, id }) => {

  const [owner, setOwner] = useState(null);
  const [hasSold, setHasSold] = useState(false);
  
  const getOwner = async () => {
    if (domain.isPurchased || hasSold) {
      const owner = await domainDaddy.ownerOf(id);
      setOwner(owner);
    }
  }
  
  const buyHandler = async () => {
    
    const signer = await provider.getSigner();
    const transaction = await domainDaddy.connect(signer).mint( id, { value: domain.cost });
    await transaction.wait();
    
    setHasSold(true);
  }

  useEffect(() => {
    getOwner();
  }, [hasSold]);


  return (
    <div className='card'>
      <div className='card__info'>
        <h3>
          {domain.isPurchased || owner ? 
          (
            <del>
              {domain.name}
            </del>
          ) : (
            <>{domain.name}</>
          )
          }
        </h3>

        <p>
        {domain.isPurchased|| owner ? (
            <>
              <small>
                Purchased by:<br />
                <span>
                  {owner && owner.slice(0, 6) + '...' + owner.slice(38, 42)}
                </span>
              </small>
            </>
          ) : (
            <>
              <strong>
                {ethers.utils.formatUnits(domain.cost.toString(), 'ether')}
              </strong>
              ETH
            </>
          )}
        </p>
      </div>

      {!domain.isPurchased && !owner && (

        <button
          type="button"
          className="card__button"
          onClick={ () => buyHandler() }
        >
          Buy Domain
        </button>
      )}
      
    </div>
  );
}

export default Domain;