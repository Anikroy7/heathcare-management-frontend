import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetAvailableSlotsQuery } from '../store/api/scheduleApi';
import { useCreateAppointmentMutation } from '../store/api/appointmentApi';
import Toast from '../components/Toast';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export default function BookAppointmentPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [createAppointment, { isLoading: isCreating }] = useCreateAppointmentMutation();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const { data: slotsData, isLoading, error, refetch } = useGetAvailableSlotsQuery(
    { doctorId: doctorId!, date: selectedDate },
    { skip: !doctorId || !selectedDate }
  );

  useEffect(() => {
    if (slotsData) {
      const formattedSlots: TimeSlot[] = slotsData.map((slot) => ({
        id: slot._id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        available: slot.status !== 'booked',
      }));
      setSlots(formattedSlots);
    } else {
      setSlots([]);
    }
  }, [slotsData]);

  const doctor = {
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    avatar: 'SJ',
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot('');
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedSlot) {
      setToast({ message: 'Please select both date and time slot', type: 'error' });
      return;
    }

    if (!doctorId) {
      setToast({ message: 'Doctor information not found', type: 'error' });
      return;
    }

    try {
      await createAppointment({
        doctor: doctorId,
        schedule: selectedSlot,
        scheduleSlot: selectedSlot,
        status: 'pending',
      }).unwrap();

      refetch();

      const selectedSlotData = slots.find(s => s.id === selectedSlot);
      setToast({ 
        message: `Appointment successfully booked for ${selectedDate} at ${selectedSlotData?.startTime}!`, 
        type: 'success' 
      });
      
      navigate('/my-appointments');
    } catch (error: any) {
      console.error('Failed to create appointment:', error);
      setToast({ 
        message: error?.data?.message || 'Failed to book appointment. Please try again.', 
        type: 'error' 
      });
    }
  };

  const today = new Date().toISOString().split('T')[0];
  
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4 transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Doctors
          </button>
          
          <h1 className="text-base font-bold text-gray-900">Book Appointment</h1>
          <p className="text-gray-600 mt-2">Select a date and time slot for your appointment</p>
        </div>

        {/* Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Doctor Info & Booking Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Doctor Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky top-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Doctor Information
              </h3>
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-base mb-3">
                  {doctor.avatar}
                </div>
                <h2 className="text-base font-semibold text-gray-900">{doctor.name}</h2>
                <p className="text-primary-600 font-medium mt-1">{doctor.specialization}</p>
              </div>

              {/* Booking Summary */}
              {selectedDate && selectedSlot ? (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    Booking Summary
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 text-primary-600 mr-3 mt-0.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                        <p className="font-medium text-gray-900 mt-1">
                          {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 text-primary-600 mr-3 mt-0.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
                        <p className="font-medium text-gray-900 mt-1">
                          {(() => {
                            const slot = slots.find(s => s.id === selectedSlot);
                            return slot ? `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}` : '';
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleBookAppointment}
                    disabled={isCreating}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isCreating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Booking...
                      </>
                    ) : (
                      'Confirm Appointment'
                    )}
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-6">
                  <div className="bg-primary-50 rounded-lg p-4 text-center">
                    <svg
                      className="w-10 h-10 text-primary-400 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      Select a date and time to see your booking summary
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Date & Time Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Selection */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Select Date
              </h3>
              
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                min={today}
                max={maxDateStr}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 text-lg"
              />
              
              {selectedDate && (
                <div className="mt-4 bg-primary-50 rounded-lg p-3 flex items-center">
                  <svg
                    className="w-5 h-5 text-primary-600 mr-2 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm text-gray-700">
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Available Time Slots
                </h3>
                
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <span className="ml-3 text-gray-600">Loading available slots...</span>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <svg
                      className="w-12 h-12 text-red-400 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-red-600 font-medium">Failed to load available slots</p>
                    <p className="text-sm text-red-500 mt-1">Please try again later</p>
                  </div>
                ) : slots.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {slots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => slot.available && handleSlotSelect(slot.id)}
                          disabled={!slot.available}
                          className={`
                            py-2 px-3 rounded-lg font-medium text-sm transition-all
                            ${
                              slot.available
                                ? selectedSlot === slot.id
                                  ? 'bg-primary-600 text-white shadow-md transform scale-105'
                                  : 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                            }
                          `}
                        >
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                         
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex items-start text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                      <svg
                        className="w-5 h-5 mr-2 text-primary-500 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Click on an available time slot to continue with your booking</span>
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-gray-500">No available slots for this date</p>
                  </div>
                )}
              </div>
            )}
            
            {!selectedDate && (
              <div className="bg-white rounded-lg shadow-md p-12 border border-gray-200 text-center">
                <svg
                  className="w-20 h-20 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Date</h3>
                <p className="text-gray-500">Choose a date above to view available time slots</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


