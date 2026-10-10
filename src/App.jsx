import { useEffect, useSyncExternalStore } from 'react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';

const subscribe = (cb) => {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
};

const isDashboard = () => window.location.hash.startsWith('#/dashboard');

function App() {
  const onDashboard = useSyncExternalStore(subscribe, isDashboard);

  useEffect(() => {
    if (onDashboard) window.scrollTo(0, 0);
  }, [onDashboard]);

  return onDashboard ? <Dashboard /> : <Landing />;
}

export default App;
