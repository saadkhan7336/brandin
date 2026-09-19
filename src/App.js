import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { useAuth } from './hooks/useAuth';
import GlobalLoader from './components/common/GlobalLoader';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const { fetchUser } = useAuth();

  useEffect(() => {
    fetchUser(); // 🔥 auto login on refresh
  }, [fetchUser]);

  return (
    <>
      <GlobalLoader />
      <AppRoutes />
      <Analytics />
    </>
  );
}

export default App;