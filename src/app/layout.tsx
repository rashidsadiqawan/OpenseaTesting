// src/app/layout.tsx
'use client';

import React from 'react';
import { Web3AuthProvider } from '@/contexts/web3AuthContext';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>OpenSea Implementation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Web3AuthProvider>
          <main style={{ paddingTop: '60px' }}>{children}</main>
        </Web3AuthProvider>
      </body>
    </html>
  );
}
