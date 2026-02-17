import { useNavigate } from 'react-router-dom';
import { useGetAllDoctorsQuery } from '../store/api/doctorApi';

export default function DoctorList() {
  const navigate = useNavigate();
  const { data: doctors, isLoading, error } = useGetAllDoctorsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
        Failed to load doctors. Please try again later.
      </div>
    );
  }

  if (!doctors || doctors.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No doctors available at the moment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
        <div
          key={doctor._id}
          className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border-1 border-primary-100  transform"
        >
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
              {doctor.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-gray-900">
                Dr. {doctor.user.name}
              </h3>
              <p className="text-sm text-primary-600 font-semibold">
                {doctor.specialization}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-primary-500 mr-2 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-gray-600">{doctor.user.email}</span>
            </div>

            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-primary-500 mr-2 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="text-gray-600">{doctor.user.phone}</span>
            </div>

            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-primary-500 mr-2 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-gray-600">{doctor.address}</span>
            </div>

            <div className="pt-2 border-t border-primary-100 mt-3">
              <p className="text-xs text-gray-500">
                License: {doctor.license_number}
              </p>
            </div>
          </div>

          <button 
            onClick={() => navigate(`/book-appointment/${doctor._id}`)}
            className="w-full mt-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2 px-3 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 text-xs font-semibold cursor-pointer shadow-md hover:shadow-lg"
          >
            Book Appointment
          </button>
        </div>
      ))}
    </div>
  );
}

