import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMySchedulesQuery, useCreateScheduleMutation } from '../store/api/doctorScheduleApi';
import Toast from '../components/Toast';

export default function DoctorDashboardPage() {
  const navigate = useNavigate();
  const { data: schedules, isLoading, error } = useGetMySchedulesQuery();
  const [createSchedule, { isLoading: isCreating }] = useCreateScheduleMutation();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    totalSlot: 5,
    slot_duration_minutes: 30,
  });

  // Helper function to convert 24-hour time to 12-hour format with AM/PM
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createSchedule({
        date: formData.date,
        startTime: formData.startTime,
        totalSlot: formData.totalSlot,
        slot_duration_minutes: formData.slot_duration_minutes,
        isActive: true,
      }).unwrap();

      setToast({ message: 'Schedule created successfully!', type: 'success' });
      setShowCreateForm(false);
      setFormData({
        date: '',
        startTime: '',
        totalSlot: 5,
        slot_duration_minutes: 30,
      });
    } catch (error: any) {
      console.error('Failed to create schedule:', error);
      setToast({
        message: error?.data?.message || 'Failed to create schedule. Please try again.',
        type: 'error'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalSlot' || name === 'slot_duration_minutes' ? parseInt(value) : value,
    }));
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Schedules</h1>
              <p className="text-gray-600 mt-2">Manage your availability and appointments</p>
            </div>
            {!showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-md hover:shadow-lg flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Schedule
              </button>
            )}

          </div>
        </div>

        {/* Create Schedule Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Schedule</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={today}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Total Slots */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Slots <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalSlot"
                    value={formData.totalSlot}
                    onChange={handleInputChange}
                    min="1"
                    max="20"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Number of appointment slots (1-20)</p>
                </div>

                {/* Slot Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slot Duration (minutes) <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="slot_duration_minutes"
                    value={formData.slot_duration_minutes}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:bg-primary-400 disabled:cursor-not-allowed flex items-center"
                >
                  {isCreating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Schedule'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
            <span className="ml-4 text-gray-600 text-lg">Loading schedules...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 rounded-lg p-8 text-center border border-red-200">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Schedules</h3>
            <p className="text-red-600">Please try again later</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!schedules || schedules.length === 0) && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No Schedules Yet</h3>
            <p className="text-gray-600 mb-6">Create your first schedule to start accepting appointments.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-md hover:shadow-lg inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Schedule
            </button>
          </div>
        )}

        {/* Schedules List */}
        {!isLoading && !error && schedules && schedules.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.map((schedule) => {
              const scheduleDate = new Date(schedule.date);
              const endTime = new Date(`2000-01-01T${schedule.startTime}`);
              endTime.setMinutes(endTime.getMinutes() + (schedule.totalSlot * schedule.slot_duration_minutes));
              const endTimeStr = endTime.toTimeString().substring(0, 5);

              return (
                <div
                  key={schedule._id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-lg font-semibold">
                          {scheduleDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${schedule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {schedule.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 mr-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="font-medium">{formatTime(schedule.startTime)} - {formatTime(endTimeStr)}</p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 mr-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Total Slots</p>
                        <p className="font-medium">{schedule.totalSlot} slots</p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 mr-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Duration per Slot</p>
                        <p className="font-medium">{schedule.slot_duration_minutes} minutes</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Created {new Date(schedule.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <button
                      onClick={() => navigate(`/schedule-appointments/${schedule._id}`)}
                      className="flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Appointments
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


