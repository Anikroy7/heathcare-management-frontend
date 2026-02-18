import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../store/slices/authSlices';
import type { RootState } from '../store/store';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/';
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-md border-b-2 border-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center gap-8">
            <h1 
              className="text-lg font-bold text-primary-600 cursor-pointer hover:text-primary-700 transition-all duration-200 flex items-center gap-2"
              onClick={() => navigate('/')}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-10h2v6h-2zm0-4h2v2h-2z"/>
              </svg>
              Healthcare
            </h1>
            
            {user.role === 'patient' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                    location.pathname === '/' 
                      ? 'bg-primary-500 text-white shadow-md' 
                      : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                >
                  Find Doctors
                </button>
                <button
                  onClick={() => navigate('/my-appointments')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                    location.pathname === '/my-appointments' 
                      ? 'bg-primary-500 text-white shadow-md' 
                      : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  My Appointments
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg border border-primary-200">
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-900">{user.email}</p>
                <p className="text-[10px] text-primary-600 capitalize font-medium">{user.role}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
