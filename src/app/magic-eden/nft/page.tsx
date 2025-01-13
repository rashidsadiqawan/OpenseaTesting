/* eslint-disable @next/next/no-img-element */
"use client"
import { useEffect, useState } from 'react';
import './nft.css'
type TokenData = {
  token: {
    tokenId: string;
    image: string;
    name: string | null;
    description: string | null;
    collection: {
      name: string;
      image: string;
      symbol: string;
    };
  };
  market: {
    floorAsk: {
      price: {
        amount: {
          decimal: number;
          usd: number;
        };
      };
      source: {
        name: string;
        url: string;
      };
    };
  };
};

const TokensList = () => {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the API on component mount
  useEffect(() => {
    const fetchTokens = async () => {
      const options = {
        method: 'GET',
        headers: {
          accept: '*/*',
          Authorization: 'Bearer YOUR_API_KEY',
        },
      };

      try {
        const res = await fetch(
          'https://api-mainnet.magiceden.dev/v3/rtp/ethereum/tokens/v6?collection=0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258&sortBy=floorAskPrice&limit=2&includeTopBid=false&excludeEOA=false&includeAttributes=false&includeQuantity=false&includeDynamicPricing=false&includeLastSale=false&normalizeRoyalties=false',
          options
        );
        const data = await res.json();
        setTokens(data.tokens);
      } catch (err:any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="tokens-list">
      <h2>Latest Tokens</h2>
      <div className="token-cards">
        {tokens.map((tokenData) => (
          <div key={tokenData.token.tokenId} className="token-card">
            <img src={tokenData.token.image} alt={tokenData.token.name || 'Token Image'} />
            <div className="token-info">
              <h3>{tokenData.token.name || 'Unnamed Token'}</h3>
              <p className="collection">
                Collection: <strong>{tokenData.token.collection.name}</strong> ({tokenData.token.collection.symbol})
              </p>
              <p className="price">
                Price: <strong>{tokenData.market.floorAsk.price.amount.decimal} ETH</strong> (
                ${tokenData.market.floorAsk.price.amount.usd.toFixed(2)} USD)
              </p>
              <a
                href={tokenData.market.floorAsk.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="market-link"
              >
                View on {tokenData.market.floorAsk.source.name}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokensList;
