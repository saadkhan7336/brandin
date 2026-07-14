import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { useAuth } from './hooks/useAuth';
import GlobalLoader from './components/common/GlobalLoader';

function App() {
  const { fetchUser } = useAuth();

  useEffect(() => {
    fetchUser(); // 🔥 auto login on refresh
  }, [fetchUser]);

  return (
    <>
      <GlobalLoader />
      <AppRoutes />
    </>
  );
}

export default App;