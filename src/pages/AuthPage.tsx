import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterPatientForm from '../components/RegisterPatientForm';
import RegisterDoctorForm from '../components/RegisterDoctorForm';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register-patient' | 'register-doctor'>('login');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLoginSuccess = (token: string) => {
    console.log('Login successful, token:', token);
    // Redirect to dashboard or home page
    window.location.href = '/dashboard';
  };

  const handleRegisterSuccess = () => {
    setSuccessMessage('Registration successful! Please login.');
    setMode('login');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Healthcare Portal
          </h1>
          <p className="text-gray-600">
            {mode === 'login' && 'Sign in to your account'}
            {mode === 'register-patient' && 'Register as a Patient'}
            {mode === 'register-doctor' && 'Register as a Doctor'}
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        <div className="mb-6">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'login'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('register-patient')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'register-patient'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Patient
            </button>
            <button
              onClick={() => setMode('register-doctor')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'register-doctor'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Doctor
            </button>
          </div>
        </div>

        {mode === 'login' && <LoginForm onSuccess={handleLoginSuccess} />}
        {mode === 'register-patient' && <RegisterPatientForm onSuccess={handleRegisterSuccess} />}
        {mode === 'register-doctor' && <RegisterDoctorForm onSuccess={handleRegisterSuccess} />}

        <div className="mt-6 text-center text-sm text-gray-600">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('register-patient')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
