/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Loader from "@/Component/Loader"; // Import your Loader component
import "./NFTDisplay.css"; // Add a CSS file or use a CSS module

// Define the NFT interface
interface NFT {
  name: string;
  collection: string;
  contracts: string[]; // Replace with a more specific type if available
  image_url: string;
  description: string;
  slug: string;
}

const NFTDisplay = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      const options = {
        headers: {
          accept: "application/json",
          "x-api-key": "6772ed3ee6c743c78b14305eedc0e9c9",
        },
      };

      try {
        const res = await axios.get(
          "https://testnets-api.opensea.io/api/v2/collections?chain=sepolia&creator_username=spheraworld&limit=10",
          options
        );
        setNfts(res.data.collections || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  if (loading) return <Loader />; // Use the Loader component when loading
  if (error) return <div className="error">{error}</div>;

  const collectionHandler = (collectionName: string, nftChainInfo: unknown[]) => {
    nftChainInfo.forEach((info) => {
      localStorage.setItem(collectionName, JSON.stringify(info));
    });
    localStorage.setItem("collection", collectionName);
  };

  return (
    <div className="container">
      <h2 className="title">Available NFT Collections</h2>
      <div className="nft-list">
        {nfts.map((nft, index) => (
          <Link href={`/nft`} key={index}>
            <div
              className="nft-item"
              onClick={() => collectionHandler(nft.collection, nft.contracts)}
            >
              <img
                src={nft.image_url}
                alt={nft.name}
                className="nft-image"
              />
              <h3 className="nft-name">{nft.name}</h3>
              <p className="nft-description">{nft.description}</p>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NFTDisplay;
