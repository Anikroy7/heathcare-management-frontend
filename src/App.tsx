import { useSelector } from 'react-redux';
import AuthPage from './pages/AuthPage';
import Navbar from './components/Navbar';
import type { RootState } from './store/store';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to Healthcare Portal
            </h1>
            <p className="text-gray-600">
              You are now logged in. This is your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
