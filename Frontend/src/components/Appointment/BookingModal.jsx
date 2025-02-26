import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, CalendarCheck, UserPlus, X } from 'lucide-react';
import { useDispatch } from "react-redux"
import { createAppointment, clearErrors } from '../../actions/appointmentActions';

const BookingModal = ({ doctor, isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [day, setDay] = useState('');
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');
    const [online, setOnline] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(doctor._id, day, time, description);
        dispatch(createAppointment(doctor._id, day, time, description));
        if (online) {
            alert(`Appointment is scheduld at ${time} of ${time}\nLog onto telemedicine at ${time}`)
        } else {
            alert(`Appointment is scheduld at ${time} of ${time}`)
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X className="h-6 w-6" />
                </button>

                <h2 className="text-xl font-semibold mb-4">Book Appointment with {doctor.name}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Time
                        </label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                            placeholder="Please describe your reason for visit..."
                            required
                        />
                    </div>

                    <div className='flex flex-row justify-between'>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mode Online
                        </label>
                        <input
                            type='checkbox'
                            value={online}
                            onChange={(e) => setOnline(e.target.value)}
                            className="w-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Please describe your reason for visit..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
                    >
                        Confirm Booking
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;