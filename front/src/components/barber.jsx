import React, { useState, useEffect, useCallback } from 'react';

const AppointmentSlots = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phoneNumber: ''
  });

  // Generate next 7 days
  const getNextSevenDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Format date for display
  const formatDate = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()]
    };
  };

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        id: `${hour}-00`
      });
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:30`,
        id: `${hour}-30`
      });
    }
    return slots;
  };

  const fetchAvailableSlots = useCallback(async (date) => {
    setLoading(true);
    try {
      // const response = await fetch(`http://localhost:9000/api/slots?date=${date.toISOString()}`);
      const response = await fetch(`https://barbershop-webapp.onrender.com/api/slots?date=${date.toISOString()}`);
      const data = await response.json();
      
      // Filter out booked slots
      const allSlots = generateTimeSlots();
      const availableSlots = allSlots.filter(slot => !data.bookedSlots.includes(slot.id));
      
      setAvailableSlots(availableSlots);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setAvailableSlots([]);
    }
    setLoading(false);
  }, []);

  const bookAppointment = async () => {
    if (!selectedSlot || !customerInfo.fullName || !customerInfo.phoneNumber) {
      return;
    }

    try {
      const response = await fetch('https://barbershop-webapp.onrender.com/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
          slotId: selectedSlot,
          customerName: customerInfo.fullName,
          phoneNumber: customerInfo.phoneNumber
        }),
      });
      
      if (response.ok) {
        // Reset form and refresh available slots
        setSelectedSlot(null);
        setCustomerInfo({ fullName: '', phoneNumber: '' });
        fetchAvailableSlots(selectedDate);
        // alert('Appointment booked successfully!');
        // setMessage({ type: "success", text: "Booking successful!" });
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  useEffect(() => {
    fetchAvailableSlots(selectedDate);
  }, [selectedDate, fetchAvailableSlots]);

  return (
    
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      
      <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f8f9fa" }}>
        <h1 style={{ fontSize: "3rem", color: "#343a40", margin: "0" }}>Barbershop</h1>
        <p style={{ fontSize: "1.2rem", color: "#6c757d", marginTop: "10px" }}>
          Book Your Appointment Easily and Quickly
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Book Your Appointment</h2>
        
        {/* Date Selection */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {getNextSevenDays().map((date) => {
            const formattedDate = formatDate(date);
            const isSelected = date.toDateString() === selectedDate.toDateString();
            
            return (
              <button
                key={date.toISOString()}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedSlot(null);
                }}
                className={`
                  p-2 rounded-lg text-center transition-colors
                  ${isSelected 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white border border-gray-200 hover:bg-blue-50'}
                `}
              >
                <div className="text-sm font-medium">{formattedDate.day}</div>
                <div className="text-lg font-bold">{formattedDate.date}</div>
                <div className="text-xs">{formattedDate.month}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Date Display */}
        <div className="text-lg text-gray-600 mb-4">
          Selected Date: {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading available slots...
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No available slots for this date. Please select another date.
          </div>
        ) : (
          /* Time slots grid - only showing available slots */
          <div className="grid grid-cols-4 gap-4">
            {availableSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot.id)}
                className={`
                  p-4 rounded-md transition-colors
                  ${selectedSlot === slot.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white border border-gray-200 hover:bg-blue-50'}
                `}
              >
                {slot.time}
              </button>
            ))}
          </div>
        )}

        {/* Customer information form */}
        {selectedSlot && (
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="fullName" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={customerInfo.fullName}
                onChange={(e) => setCustomerInfo(prev => ({
                  ...prev,
                  fullName: e.target.value
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label 
                htmlFor="phoneNumber" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                value={customerInfo.phoneNumber}
                onChange={(e) => setCustomerInfo(prev => ({
                  ...prev,
                  phoneNumber: e.target.value
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
              />
            </div>

            <button 
              onClick={bookAppointment}
              disabled={!customerInfo.fullName || !customerInfo.phoneNumber}
              className={`
                w-full py-2 px-4 rounded-md text-white
                ${(!customerInfo.fullName || !customerInfo.phoneNumber) 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'}
              `}
            >
              Book Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentSlots;