'use client';

import { useState, use, useEffect } from 'react';
import { HOSPITALS, Booking } from '@/app/data';
import styles from './book.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BookAppointment({ params }: { params: Promise<{ hospitalId: string, doctorId: string }> }) {
    const unwrappedParams = use(params);
    const router = useRouter();
    const hospital = HOSPITALS.find(h => h.id === parseInt(unwrappedParams.hospitalId));
    const doctor = hospital?.doctors.find(d => d.id === parseInt(unwrappedParams.doctorId));

    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [patientName, setPatientName] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);

    useEffect(() => {
        if (date && hospital && doctor) {
            fetch(`/api/bookings/slots?hospitalId=${hospital.id}&doctorId=${doctor.id}&date=${date}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setBookedSlots(data);
                    } else {
                        setBookedSlots([]);
                    }
                })
                .catch(err => {
                    console.error("Error fetching slots", err);
                    setBookedSlots([]);
                });
        } else {
            setBookedSlots([]);
        }
    }, [date, hospital, doctor]);

    if (!hospital || !doctor) {
        return (
            <div className={styles.bookContainer} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p>Hospital or Doctor not found. <Link href="/" style={{ color: 'var(--primary)' }}>Go back home</Link>.</p>
            </div>
        );
    }

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();

        if (bookedSlots.includes(time)) {
             alert('This slot is already booked by others. Please choose a different time.');
             return;
        }

        // Get logged in user
        const userStr = localStorage.getItem('medicare_user');

        if (!userStr) {
            alert('Please login first to book an appointment');
            router.push('/auth');
            return;
        }

        const user = JSON.parse(userStr);

        const newBooking = {
            hospitalId: hospital.id,
            hospitalName: hospital.name,
            doctorId: doctor.id,
            doctorName: doctor.name,
            doctorSpecialty: doctor.specialty,
            date,
            time,
            patientName,
            amountPaid: doctor.fee,
            status: 'Confirmed',
            userEmail: user.email
        };

        const confirmBooking = window.confirm(`Are you sure you want to book this appointment for ₹${doctor.fee}?`);

        if (!confirmBooking) return;

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBooking)
            });

            const data = await res.json();

            if (!res.ok) {
                 alert(data.error || 'Failed to book appointment');
                 return;
            }

            setIsSuccess(true);
        } catch (err) {
            alert('An error occurred during booking. Please try again.');
        }
    };

    return (
        <div className={styles.bookContainer}>
            <div className={styles.bookCard}>
                <div className={styles.header}>
                    <Link href="/" className={styles.backBtn}>← Back to Home</Link>
                    <h1 className={styles.title}>Book Appointment</h1>
                    <p className={styles.subtitle}>Fill in details to confirm your visit</p>
                </div>

                {isSuccess ? (
                    <div className={styles.successState}>
                        <div className={styles.checkIcon}>✓</div>
                        <h2 className={styles.successTitle}>Booking Confirmed!</h2>
                        <p className={styles.successDesc}>
                            Your appointment with {doctor.name} at {hospital.name} on {date} at {time} is confirmed.
                        </p>
                        <Link href="/bookings" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', marginTop: '15px' }}>
                            View My Bookings
                        </Link>
                    </div>
                ) : (
                    <form className={styles.formBody} onSubmit={handleBooking}>
                        <div className={styles.infoSection}>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Doctor:</span>
                                <span className={styles.infoValue}>{doctor.name} ({doctor.specialty})</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Hospital:</span>
                                <span className={styles.infoValue}>{hospital.name}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Location:</span>
                                <span className={styles.infoValue} style={{ fontSize: '0.9rem' }}>{hospital.location}</span>
                            </div>
                            <div className={styles.infoRow} style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                                <span className={styles.infoLabel}>Consultation Fee:</span>
                                <span className={styles.infoValue} style={{ color: '#10B981' }}>₹{doctor.fee || 200}</span>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Patient Full Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Mani"
                                required
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Select Date</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Select Time</label>
                            <select required value={time} onChange={(e) => setTime(e.target.value)}>
                                <option value="" disabled>Choose a time slot</option>
                                {["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:30 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"].map((t) => (
                                    <option key={t} value={t} disabled={bookedSlots.includes(t)}>
                                        {t} {bookedSlots.includes(t) ? '(Booked)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
                            Book Appointment (₹{doctor.fee})
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
