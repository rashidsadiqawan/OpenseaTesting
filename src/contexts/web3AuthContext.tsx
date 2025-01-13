'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { IProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { web3auth } from "@/utils/chainConfig";
import RPC from "@/Libs/Web3Auth/ethersRPC";
import Cookies from 'js-cookie';


interface Web3AuthContextType {
  web3Provider: IProvider | null;
  loggedIn: boolean;
  login: (provider: string) => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<unknown>;
  getAccounts: () => Promise<string | null>;
}

const Web3AuthContext = createContext<Web3AuthContextType | null>(null);

export function Web3AuthProvider({ children }: { children: React.ReactNode }) {
  const [web3Provider, setWeb3Provider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [accountAddress, setAccountAddress] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      console.log(accountAddress)
      try {
        await web3auth.init();
        setWeb3Provider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
          await fetchAccount(); // Fetch account when initialized
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async (loginProvider: string) => {
    try {
      const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
        loginProvider,
      });
      setWeb3Provider(web3authProvider);
      if (web3auth.connected) {
        setLoggedIn(true);
        await fetchAccount();
      }
      const userInfo = await getUserInfo();
      const token = userInfo?.idToken || '';
      if (token) {
        Cookies.set('token', token, { 
          expires: 1,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict', 
        });
      }
  
      window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  

  const fetchAccount = async () => {
    try {
      const address = await getAccounts();
      setAccountAddress(address); // Store the account address in the state
    } catch (error) {
      console.error("Error fetching account:", error);
    }
  };

  const getUserInfo = async () => {
    try {
      const user = await web3auth.getUserInfo();
      return user;
    } catch (error) {
      console.error("Error getting user info:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await web3auth.logout();
      setWeb3Provider(null);
      setLoggedIn(false);
      setAccountAddress(null); 
      Cookies.remove('token'); 
      localStorage.setItem("walletAddress", "");
  
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  

  const getAccounts = async (): Promise<string | null> => {
    if (!web3Provider) {
      console.warn("Provider not initialized yet");
      return null;
    }
    try {
      const address = await RPC.getAccounts(web3Provider);
      localStorage.setItem("walletAddress", address);
      return address;
    } catch (error) {
      console.error("Error getting accounts:", error);
      return null;
    }
  };

  return (
    <Web3AuthContext.Provider
      value={{
        web3Provider,
        loggedIn,
        login,
        logout,
        getUserInfo,
        getAccounts,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
}

// Custom hook to use Web3Auth context
export function useWeb3Auth() {
  const context = useContext(Web3AuthContext);
  if (!context) {
    throw new Error("useWeb3Auth must be used within a Web3AuthProvider");
  }
  return context;
}
