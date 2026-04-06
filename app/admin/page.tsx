'use client';

import { useState, useEffect } from 'react';
import styles from './admin.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Booking } from '../data';

export default function AdminPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if admin
        const fetchAdminData = async () => {
            const userStr = localStorage.getItem('medicare_user');
            const user = userStr ? JSON.parse(userStr) : null;

            if (user && user.role === 'admin') {
                setIsAdmin(true);
                
                try {
                    // Fetch bookings
                    const bookingsRes = await fetch(`/api/bookings?role=admin`);
                    if (bookingsRes.ok) {
                        const allBookings: Booking[] = await bookingsRes.json();
                        let hasChanges = false;

                        const updatedBookings = allBookings.map((b: Booking) => {
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

                    // Fetch users
                    const usersRes = await fetch(`/api/admin/users?role=admin`);
                    if (usersRes.ok) {
                        const fetchedUsers = await usersRes.json();
                        setUsers(fetchedUsers);
                    }
                } catch (error) {
                    console.error('Error fetching admin data', error);
                }
            }
            setIsLoading(false);
        };
        
        fetchAdminData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('medicare_user');
        alert('Admin logged out successfully.');
        router.push('/');
    };

    const handleCancel = async (bookingId: string) => {
        if (window.confirm('Are you sure you want to cancel this appointment for the user?')) {
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

    if (isLoading) {
        return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
    }

    if (!isAdmin) {
        return (
            <div className={styles.adminContainer}>
                <header className={styles.header}>
                    <Link href="/" className={styles.backBtn}>← Back to Home</Link>
                </header>
                <div className={styles.emptyState}>
                    <h3 style={{ color: '#DC2626' }}>Access Denied</h3>
                    <p>You are not a Admin. Only administrators can view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
            <header className={styles.header} style={{ backgroundColor: 'var(--card-bg)', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-md)', marginBottom: '30px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link href="/" className={styles.backBtn}>← Back to Home</Link>
                    <h1 className={styles.title} style={{ margin: 0 }}>Admin Dashboard</h1>
                </div>
                <button
                    onClick={handleLogout}
                    className="btn-outline"
                    style={{ padding: '8px 20px', fontSize: '0.9rem', borderColor: '#DC2626', color: '#DC2626' }}
                >
                    Logout
                </button>
            </header>

            <div className={styles.adminWrapper}>
                <div className={styles.bookingsSection}>
                    <h2 style={{ marginBottom: '20px', fontSize: '1.4rem', color: 'var(--text-main)' }}>All Users Bookings</h2>
                    {bookings.length === 0 ? (
                        <div className={styles.emptyState}>
                            <h3>No bookings found</h3>
                            <p>There are currently no appointments booked by any user.</p>
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
                                            Patient Name: <strong style={{ color: 'var(--text-main)' }}>{booking.patientName}</strong>
                                        </span>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-lighter)', marginTop: '2px' }}>
                                            Booked by User: <strong style={{ color: 'var(--primary)' }}>{booking.userEmail}</strong>
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
                                        {booking.status !== 'Cancelled' && booking.status !== 'Expired' && (
                                            <button
                                                className="btn-outline"
                                                style={{ padding: '6px 12px', fontSize: '0.8rem', marginTop: '10px', borderColor: '#DC2626', color: '#DC2626' }}
                                                onClick={() => handleCancel(booking.id)}
                                            >
                                                Cancel Booking
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.usersSection}>
                    <h2 style={{ marginBottom: '20px', fontSize: '1.4rem', color: 'var(--text-main)' }}>Registered Users</h2>
                    {users.length === 0 ? (
                        <div className={styles.emptyState} style={{ padding: '30px 10px' }}>
                            <p style={{ margin: 0 }}>No users registered yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {users.map((u, i) => (
                                <div key={i} className={styles.userCard} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <span className={styles.userName} style={{ fontSize: '1.1rem', marginBottom: 0 }}>👤 {u.name}</span>
                                    <span className={styles.userEmail} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>📧 Email: {u.email}</span>
                                    {u.mobile && (
                                        <span className={styles.userEmail} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>📱 Mobile: {u.mobile}</span>
                                    )}
                                    <span className={styles.userEmail} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🔑 Password: {u.password}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
