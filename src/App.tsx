import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import ScheduleAppointmentsPage from './pages/ScheduleAppointmentsPage';
import Navbar from './components/Navbar';
import DoctorList from './components/DoctorList';
import type { RootState } from './store/store';

function App() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              user?.role === 'patient' ? (
                <div className="p-8">
                  <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-2">
                        Find a Doctor
                      </h1>
                      <p className="text-gray-600 text-base">
                        Browse our list of qualified healthcare professionals
                      </p>
                    </div>
                    <DoctorList />
                  </div>
                </div>
              ) : (
                <DoctorDashboardPage />
              )
            }
          />
          <Route path="/book-appointment/:doctorId" element={<BookAppointmentPage />} />
          <Route path="/my-appointments" element={<MyAppointmentsPage />} />
          <Route path="/schedule-appointments/:scheduleId" element={<ScheduleAppointmentsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

