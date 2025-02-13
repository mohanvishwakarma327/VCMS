import React, { useState } from 'react';

const User = () => {
    const [appointments, setAppointments] = useState([]);

    const bookAppointment = (appointment) => {
        setAppointments([...appointments, appointment]);
    };

    const rescheduleAppointment = (index, newAppointment) => {
        const updatedAppointments = [...appointments];
        updatedAppointments[index] = newAppointment;
        setAppointments(updatedAppointments);
    };

    return (
        <div>
            <h1>User Page</h1>
            <p>Welcome to the user page!</p>
            <button onClick={() => bookAppointment('New Appointment')}>Book Appointment</button>
            <button onClick={() => rescheduleAppointment(0, 'Rescheduled Appointment')}>Reschedule Appointment</button>
            <ul>
                {appointments.map((appointment, index) => (
                    <li key={index}>{appointment}</li>
                ))}
            </ul>
        </div>
    );
};

export default User;