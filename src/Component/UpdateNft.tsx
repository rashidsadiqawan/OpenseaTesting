'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ListingPopupProps {
  address: string;
  name: string;
  tokenId: string;
  onConfirm: (price: string) => Promise<void>;
  onCancel: () => void;
  isOwner: boolean;
  isListed: boolean;
}

const ListingPopup: React.FC<ListingPopupProps> = ({
  address,
  name,
  tokenId,
  onConfirm,
  onCancel,
  isOwner,
  isListed,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [price, setPrice] = useState<string>('');

  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async () => {
    if (typeof window === 'undefined') return;

    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError('Please enter a valid price');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      await onConfirm(price);
    } catch (error) {
      console.error('Error during listing:', error);
      setError('Failed to list NFT. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  console.log(isOwner,isListed,"From update.tsx")
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>List NFT for Sale</h2>

        {!isOwner || isListed ? (
          <div className="mt-4 p-3 bg-yellow-50 text-yellow-600 rounded-md text-sm" style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:"30px"}}>
          <div>
          {!isOwner
              ? 'You are not the owner of this NFT and cannot list it for sale.'
              : 'This NFT is already listed for sale.'
           
              }
                  </div>  
               <button
                  type="button"
                  onClick={onCancel}
                  className="cancel-button"
                >
                  Ok
                </button>
          </div>
        ) : (
          <>
            <div>
              <strong>Name:</strong> {name}
            </div>

            <div className="address-container">
              <strong>Address:</strong>
              <code className="address-text">{shortenAddress(address)}</code>
              <button
                onClick={copyToClipboard}
                className="copy-button"
                title={copied ? 'Copied!' : 'Copy address'}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>

            <div>
              <strong>Token ID:</strong> {tokenId}
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-4" style={{ marginTop: '20px' }}>
                <label htmlFor="price">
                  <strong>Listing Price (ETH)</strong>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    step="0.000001"
                    min="0"
                    className="price-input"
                    disabled={isProcessing}
                    style={{ marginTop: '10px', width: '70%', padding: '10px' }}
                  />
                  <span className="absolute right-3 top-2.5 text-gray-500">ETH</span>
                </div>
              </div>

              {error && (
                <div className="mt-2 p-3 bg-red-50 text-red-500 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="popup-buttons">
                <button
                  type="submit"
                  disabled={isProcessing || !price}
                  className={`confirm-button ${
                    isProcessing || !price ? 'btn-disabled' : 'btn-active'
                  }`}
                >
                  {isProcessing ? 'Processing...' : 'List NFT'}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isProcessing}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ListingPopup;
