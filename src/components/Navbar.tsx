// src/components/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3Auth } from '@/contexts/web3AuthContext';
import ConfirmationModal from './ConfirmationModal';
import Link from 'next/link';

const Navbar: React.FC = () => {
    const { loggedIn, logout, getAccounts } = useWeb3Auth();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userAddress, setUserAddress] = useState<string | null>(null);

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Fetch user address when logged in
    useEffect(() => {
        const fetchAddress = async () => {
            if (loggedIn) {
                const address = await getAccounts();
                setUserAddress(address);
            } else {
                setUserAddress(null);
            }
        };

        fetchAddress();
    }, [loggedIn, getAccounts]);

    return (
        <nav style={navStyle}>
            <div style={navContentStyle}>
                <Link href="/collections" style={brandStyle}>
                    Logo
                </Link>
                <Link href="/collections" style={brandStyle}>
                    Opensea
                </Link>
                <Link href="/magic-eden" style={brandStyle}>
                    Magic Eden
                </Link>
                <div style={userSectionStyle}>
                    <span style={addressStyle}>
                        Connected Account: {userAddress ? userAddress : 'Loading...'}
                    </span>
                    <button onClick={() => setIsModalOpen(true)} style={logoutButtonStyle}>
                        Logout
                    </button>
                </div>
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                onConfirm={() => {
                    setIsModalOpen(false);
                    handleLogout();
                }}
                title="Confirm Logout"
                message="Are you sure you want to logout?"
            />
        </nav>
    );
};

const navStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px 20px',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 999,
};

const navContentStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
};

const brandStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fff',
    textDecoration: 'none',
};

const logoutButtonStyle: React.CSSProperties = {
    marginLeft: '15px',
    padding: '8px 16px',
    backgroundColor: '#ff4d4f',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
};

const userSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
};

const addressStyle: React.CSSProperties = {
    fontSize: '0.9rem',
    backgroundColor: '#444',
    padding: '5px 10px',
    borderRadius: '20px',
};

export default Navbar;
