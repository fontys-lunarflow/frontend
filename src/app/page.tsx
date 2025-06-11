'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the content page which has the proper UI
    router.push('/content');
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🚀 LunarFlow</h1>
      <p>Redirecting to application...</p>
    </div>
  );
}
