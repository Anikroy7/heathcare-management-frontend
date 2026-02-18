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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in border border-primary-100">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl mb-3 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-10h2v6h-2zm0-4h2v2h-2z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-1">
            Healthcare 
          </h1>
          <p className="text-gray-600 text-sm font-medium">
            {mode === 'login' && 'Sign in to your account'}
            {mode === 'register-patient' && 'Register as a Patient'}
            {mode === 'register-doctor' && 'Register as a Doctor'}
          </p>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-xs border border-green-200 animate-fade-in font-medium">
            {successMessage}
          </div>
        )}

        <div className="mb-4">
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('register-patient')}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                mode === 'register-patient'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Patient
            </button>
            <button
              onClick={() => setMode('register-doctor')}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                mode === 'register-doctor'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Doctor
            </button>
          </div>
        </div>

        {mode === 'login' && <LoginForm onSuccess={handleLoginSuccess} />}
        {mode === 'register-patient' && <RegisterPatientForm onSuccess={handleRegisterSuccess} />}
        {mode === 'register-doctor' && <RegisterDoctorForm onSuccess={handleRegisterSuccess} />}

        <div className="mt-4 text-center text-xs text-gray-600">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('register-patient')}
                className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
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
