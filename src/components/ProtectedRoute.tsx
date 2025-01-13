// src/components/ProtectedRoute.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';


interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();



  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      router.push('/');
    }
  }, [router]);

  const token = Cookies.get('token');
  console.log("route", token);


  if (!token) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
