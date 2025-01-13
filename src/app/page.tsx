// src/app/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useWeb3Auth } from '@/contexts/web3AuthContext';
import styles from './page.module.css';
import Loader from '@/Component/Loader';

export default function Home() {
  const { login } = useWeb3Auth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      router.push('/');
    } else {
      router.push('/collections');
    }
  }, [router]);

  const handleLogin = async (provider: string) => {
    setLoading(true);
    try {
      await login(provider);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <button
        onClick={() => handleLogin('google')}
        className={`${styles.button} ${styles.loginButton}`}
      >
        Login with Google
      </button>
      <button
        onClick={() => handleLogin('twitter')}
        className={`${styles.button} ${styles.loginButton}`}
      >
        Login with Twitter
      </button>
    </div>
  );
}
