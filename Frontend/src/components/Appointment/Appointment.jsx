import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, CalendarCheck, UserPlus, Mail } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, allDoctors } from '../../actions/appointmentActions';
import BookingModal from './BookingModal'


const Appointment = () => {
    const [activeTab, setActiveTab] = useState('book');
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.user);
    const { loading, error, doctors } = useSelector((state) => state.allDoctors);

    useEffect(() => {
        if (error) {
            dispatch(clearErrors())
        }
        dispatch(allDoctors());

    }, [dispatch, error])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                        </div>
                        <div className="flex space-x-4">
                            <a href="/myappointments" className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium `}
                            >
                                <CalendarCheck className="h-5 w-5 mr-2" />
                                My Appointments
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'book' ? (
                    <>
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Doctors</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {doctors.map((doctor) => (
                                <div key={doctor._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex items-center p-4">
                                        <img
                                            src={"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300"}
                                            alt={doctor.name}
                                            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                                        />
                                        <div className="ml-4 flex-grow">
                                            <h2 className="text-lg font-semibold text-gray-900">{doctor.name}</h2>
                                            <div className="mt-2 space-y-1">
                                                <div className="flex items-center text-gray-600 text-sm">
                                                    <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                                                    <span className="truncate">{doctor.email}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600 text-sm">
                                                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                                                    <span>{doctor.speciality}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <a href="#" onClick={(e) => { e.preventDefault(); setSelectedDoctor(doctor); }}>
                                            <button className="ml-4 bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition-colors duration-300 flex-shrink-0">
                                                Book
                                            </button>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Appointments</h1>
                        <p className="text-gray-600 text-center">No appointments scheduled yet.</p>
                    </div>
                )}
            </main>

      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          isOpen={true}
          onClose={() => setSelectedDoctor(null)}
        />
      )}
        </div>
    );
};

export default Appointment;