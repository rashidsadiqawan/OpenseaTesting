import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import './Popup.css';

interface PopupProps {
  address: string;
  name: string;
  tokenId: string;
  price: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

const Popup: React.FC<PopupProps> = ({
  address,
  name,
  tokenId,
  price,
  onConfirm,
  onCancel
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const confirmHandler = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      await onConfirm();
    } catch (error) {
      console.error('Error during purchase:', error);
      setError('Failed to complete purchase. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>NFT Purchase Confirmation</h2>
        <p><strong>Name:</strong> {name}</p>
        <div className="address-container">
          <strong>Address:</strong>
          <span className="address-text">{shortenAddress(address)}</span>
          <button 
            className="copy-button" 
            onClick={copyToClipboard}
            title={copied ? "Copied!" : "Copy address"}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
        <p><strong>Token ID:</strong> {tokenId}</p>
        {price ? (
          <p><strong>Price:</strong> {price}</p>
        ) : (
          <p><strong>Price:</strong> Not Listed</p>
        )}
        {error && <p className="error-message">{error}</p>}
        <div className="popup-buttons">
          <button 
            className="confirm-button" 
            onClick={confirmHandler}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Confirm'}
          </button>
          <button 
            className="cancel-button" 
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;

