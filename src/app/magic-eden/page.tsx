// src/app/magic-eden/page.tsx
"use client"
import { useEffect, useState } from "react";
import './collections.css'
import Link from "next/link";
import Navbar from "@/components/Navbar";
const MagicEdenPage = () => {
  interface Collection {
    id: string;
    slug: string;
    name: string;
    image: string;
    banner: string;
    twitterUrl?: string | null;
    discordUrl: string;
    externalUrl: string;
    description: string;
    floorAskPrice: {
      amount: {
        raw: string;
        decimal: number;
        usd: number;
        native: number;
      };
      currency: {
        name: string;
        symbol: string;
      };
    };
    tokenCount: string;
    rank: {
      "1day": number;
      "7day": number;
      "30day": number;
      allTime: number;
    };
    volume: {
      "1day": number;
      "7day": number;
      "30day": number;
      allTime: number;
    };
    sampleImages: string[];
  }

  interface CollectionResponse {
    collections: {
      collection: Collection;
      ownership: {
        tokenCount: string;
        onSaleCount: string;
      };
    }[];
  }

  const [collections, setCollections] = useState<Collection[]>([]); // Define collections state with correct type
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch Magic Eden collections using the new API with Authorization
    const fetchCollections = async () => {
      const options = {
        method: "GET",
        headers: {
          accept: "*/*", // Accept any type of content
          Authorization: "Bearer YOUR_API_KEY", // Replace with your actual API key
        },
      };

      try {
        const res = await fetch(
          "https://api-mainnet.magiceden.dev/v3/rtp/ethereum/users/0x071afa44241e3a28fc4272d9acb1781297a366bf/collections/v3?includeTopBid=false&includeLiquidCount=false&offset=0&limit=20",
          options
        );

        if (!res.ok) {
          throw new Error("Failed to fetch collections");
        }

        const data: CollectionResponse = await res.json(); // Type the response to CollectionResponse

        // Extract the collections array from the response
        setCollections(data.collections.map((item) => item.collection)); // Map to get the 'collection' object
        setLoading(false);
      } catch (err) {
        console.error("Error fetching collections:", err);
        setError("Failed to fetch collections.");
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);
  const handleCollectionClick=(collectionId:string)=>{
    localStorage.setItem("edenCollection",collectionId)
  }

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
      <>
      <Navbar/>
    <div className="collections-container">
      <h1 className="title">Magic Eden Collections</h1>
      <div className="collections-grid">
        {collections.map((collection) => (
          <div key={collection.id} className="collection-card">
            <img
              src={collection.image}
              alt={collection.name}
              className="collection-image"
            />
            <div className="collection-info">
              <h3 className="collection-name">{collection.name}</h3>
              <p className="collection-description">{collection.description}</p>
              <p className="collection-floor-price">
                Floor Price: {collection.floorAskPrice.amount.native} {collection.floorAskPrice.currency.symbol}
              </p>
              <p className="collection-volume">
                Volume (7d): {collection.volume["7day"]} {collection.floorAskPrice.currency.symbol}
              </p>
                  <Link href={`/magic-eden/nft`} onClick={()=>{handleCollectionClick(collection.id)}}>
                Visit Collection

                  </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
  );
};

export default MagicEdenPage;
