import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { AuthAdapter } from "@web3auth/auth-adapter";

// IMP START - Chain Config
 const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaa36a7",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    displayName: "Ethereum Sepolia Testnet",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  };
   const clientId = "BKruFzwW1MziuExIa-F9UF1EknlpTqjqyqujvHJYsJtP2yC_JedFmP-Nm7NnGfSJ5Y-f77jKybowksGhydMP_aU";
   const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

  export const web3auth = new Web3AuthNoModal({
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider,
  });
  
   const authAdapter = new AuthAdapter();
  web3auth.configureAdapter(authAdapter);
  