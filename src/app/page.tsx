'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { isAuthenticated, isLoading, selectedBoothId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        if (selectedBoothId) {
          router.push('/dashboard');
        } else {
          router.push('/select-booth');
        }
      } else {
        router.push('/auth/login');
      }
    }
  }, [isAuthenticated, isLoading, selectedBoothId, router]);

  // Muestra un estado de carga mientras se determina la ruta
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary-600 mb-4">MiCaseta</h1>
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
      </div>
    </div>
  );
}
