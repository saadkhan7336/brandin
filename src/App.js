// import React, { useEffect } from 'react'
// import AppRoutes from './routes/AppRoutes'
// import { useAuth } from './hooks/useAuth'

// function App() {
//   const { fetchUser } = useAuth();

//   useEffect(() => {
//     fetchUser();
//   }, [location.pathname, fetchUser]);

//   return <AppRoutes/>
// }

// export default App

import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { useAuth } from './hooks/useAuth';

function App() {
  const { fetchUser } = useAuth();

  useEffect(() => {
    fetchUser(); // 🔥 auto login on refresh
  }, []);

  return <AppRoutes />;
}

export default App;