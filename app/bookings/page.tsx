'use client';

import { useState, useEffect } from 'react';
import styles from './bookings.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Booking } from '../data';

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchBookings = async () => {
            const userStr = localStorage.getItem('medicare_user');
            if (!userStr) {
                setIsLoading(false);
                return;
            }
            const user = JSON.parse(userStr);

            try {
                const res = await fetch(`/api/bookings?email=${user.email}`);
                if (res.ok) {
                    const fetchedBookings: Booking[] = await res.json();
                    
                    let hasChanges = false;
                    const updatedBookings = fetchedBookings.map((b: Booking) => {
                        if (b.status === 'Confirmed') {
                            try {
                                const [timeStr, modifier] = b.time.split(' ');
                                let [hours, minutes] = timeStr.split(':').map(Number);
                                if (modifier === 'PM' && hours < 12) hours += 12;
                                if (modifier === 'AM' && hours === 12) hours = 0;

                                const appointmentDate = new Date(`${b.date}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
                                appointmentDate.setHours(appointmentDate.getHours() + 1);

                                if (new Date() > appointmentDate) {
                                    hasChanges = true;
                                    return { ...b, status: 'Expired' as const };
                                }
                            } catch (e) {
                                console.error('Error parsing date/time for booking:', b.id);
                            }
                        }
                        return b;
                    });

                    setBookings(updatedBookings);

                    // Optional: Sync expired status back to DB if there are changes
                    if (hasChanges) {
                        for (let b of updatedBookings) {
                            if (b.status === 'Expired') {
                                await fetch(`/api/bookings/${b.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: 'Expired' })
                                });
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching bookings', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('medicare_user');
        alert('Logged out successfully.');
        router.push('/');
    };

    const handleCancel = async (bookingId: string) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                const res = await fetch(`/api/bookings/${bookingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'Cancelled' })
                });

                if (res.ok) {
                    const updatedBookings = bookings.map(b =>
                        b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b
                    );
                    setBookings(updatedBookings);
                    alert('Appointment cancelled successfully.');
                } else {
                    alert('Failed to cancel appointment.');
                }
            } catch (error) {
                console.error("Error cancelling appointment", error);
                alert("An error occurred");
            }
        }
    };

    const handleReschedule = async (bookingId: string) => {
        const newDate = window.prompt('Enter new date in YYYY-MM-DD format:');
        if (newDate) {
            const newTime = window.prompt('Enter new time (e.g. 10:00 AM):');
            if (newTime) {
                try {
                    const res = await fetch(`/api/bookings/${bookingId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ date: newDate, time: newTime })
                    });

                    if (res.ok) {
                        const updatedBookings = bookings.map(b =>
                            b.id === bookingId ? { ...b, date: newDate, time: newTime } : b
                        );
                        setBookings(updatedBookings);
                        alert('Appointment rescheduled successfully.');
                    } else {
                        alert('Failed to reschedule appointment.');
                    }
                } catch (error) {
                    console.error("Error rescheduling appointment", error);
                    alert("An error occurred");
                }
            }
        }
    };

    return (
        <div className={styles.bookingsContainer}>
            <header className={styles.header}>
                <Link href="/" className={styles.backBtn}>← Back</Link>
                <h1 className={styles.title}>My Bookings</h1>
                <button
                    onClick={handleLogout}
                    className="btn-outline"
                    style={{ padding: '6px 16px', fontSize: '0.9rem', borderColor: '#DC2626', color: '#DC2626' }}
                >
                    Logout
                </button>
            </header>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading bookings...</div>
            ) : bookings.length === 0 ? (
                <div className={styles.emptyState}>
                    <h3>No bookings found</h3>
                    <p>You haven't scheduled any appointments yet.</p>
                    <Link href="/" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                        Find a Doctor
                    </Link>
                </div>
            ) : (
                <div className={styles.bookingsList}>
                    {bookings.map((booking, index) => (
                        <div key={index} className={styles.bookingCard}>
                            <div className={styles.bookingInfo}>
                                <span className={styles.doctorName}>{booking.doctorName}</span>
                                <span className={styles.specialty}>{booking.doctorSpecialty}</span>
                                <span className={styles.hospitalName}>📍 {booking.hospitalName}</span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-lighter)', marginTop: '5px' }}>
                                    Patient: <strong style={{ color: 'var(--text-main)' }}>{booking.patientName}</strong>
                                </span>
                                {booking.amountPaid && (
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-lighter)', marginTop: '2px' }}>
                                        Total Paid: <strong style={{ color: '#10B981' }}>₹{booking.amountPaid}</strong>
                                    </span>
                                )}
                            </div>

                            <div className={styles.bookingMeta}>
                                <div className={styles.dateTime}>
                                    📅 {booking.date} at 🕒 {booking.time}
                                </div>
                                <div className={`${styles.status} ${styles[booking.status]}`}>
                                    {booking.status}
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        className="btn-outline"
                                        style={{ padding: '6px 12px', fontSize: '0.8rem', marginTop: '5px' }}
                                        onClick={() => handleReschedule(booking.id)}
                                        disabled={booking.status === 'Cancelled' || booking.status === 'Expired'}
                                    >
                                        Reschedule
                                    </button>
                                    {booking.status !== 'Cancelled' && booking.status !== 'Expired' && (
                                        <button
                                            className="btn-outline"
                                            style={{ padding: '6px 12px', fontSize: '0.8rem', marginTop: '5px', borderColor: '#DC2626', color: '#DC2626' }}
                                            onClick={() => handleCancel(booking.id)}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
