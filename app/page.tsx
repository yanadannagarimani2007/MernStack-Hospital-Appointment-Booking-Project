'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

import { HOSPITALS } from './data';

export default function Home() {
    const [locationTarget, setLocationTarget] = useState('');
    const [problemTarget, setProblemTarget] = useState('');
    const [filteredHospitals, setFilteredHospitals] = useState(HOSPITALS);
    const [hasSearched, setHasSearched] = useState(false);
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('medicare_user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('medicare_user');
        setUser(null);
        alert('Logged out successfully.');
    };

    const handleSearch = () => {
        setHasSearched(true);
        const locLower = locationTarget.toLowerCase();
        const probLower = problemTarget.toLowerCase();

        const results = HOSPITALS.filter(hospital => {
            const matchLoc = hospital.location.toLowerCase().includes(locLower);
            const matchDoc = hospital.doctors.some(doc => doc.specialty.toLowerCase().includes(probLower) || hospital.tags.some(tag => tag.toLowerCase().includes(probLower)));

            return matchLoc && matchDoc;
        });

        setFilteredHospitals(results);
    };

    return (
        <main className={styles.home}>
            {/* Header */}
            <header className="header">
                <div className="container nav-container">
                    <div className="logo">MediCare Plus</div>
                    <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <Link href="/bookings" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                            My Bookings
                        </Link>
                        <Link href="/admin" style={{ fontWeight: 600, color: 'var(--text-main)', display: user?.email === 'admin@gmail.com' ? 'block' : 'none' }}>
                            Administrator
                        </Link>
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Hello, {user.name}</span>
                                <button onClick={handleLogout} className="btn-outline" style={{ cursor: 'pointer', padding: '8px 16px' }}>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link href="/auth" className="btn-outline" style={{ display: 'inline-block', textDecoration: 'none' }}>
                                Log In / Register
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.heroTitle}>Find the Right Doctor.<br />Book Your Appointment.</h1>
                    <p className={styles.heroSubtitle}>Search top hospitals and specialists based on your health issue, and schedule your visit instantly.</p>

                    <div className={styles.searchContainer}>
                        <div className={styles.searchBox}>
                            <div className={styles.inputGroup}>
                                <input
                                    type="text"
                                    placeholder="Where? (e.g. Tirupathi)"
                                    value={locationTarget}
                                    onChange={(e) => setLocationTarget(e.target.value)}
                                />
                                <div className={styles.inputDivider}></div>
                                <input
                                    type="text"
                                    placeholder="Speciality? (e.g. General Physician)"
                                    value={problemTarget}
                                    onChange={(e) => setProblemTarget(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <button onClick={handleSearch} className={`btn-primary ${styles.searchBtn}`}>
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Results Section */}
            <section className={styles.resultsSection}>
                <h2 className={styles.sectionTitle}>
                    {hasSearched ? `Found ${filteredHospitals.length} Result${filteredHospitals.length === 1 ? '' : 's'}` : 'Top Hospitals Near You'}
                </h2>

                <div className={styles.hospitalList}>
                    {filteredHospitals.map(hospital => (
                        <div key={hospital.id} className={styles.hospitalCard}>
                            <img src={hospital.image} alt={hospital.name} className={styles.hospitalImage} />

                            <div className={styles.hospitalInfo}>
                                <div className={styles.badges}>
                                    {hospital.tags.map(tag => (
                                        <span key={tag} className={styles.badge}>{tag}</span>
                                    ))}
                                </div>

                                <h3 className={styles.hospitalName}>{hospital.name}</h3>
                                <p className={styles.hospitalLocation}>📍 {hospital.location}</p>

                                <div className={styles.doctorList}>
                                    <p className={styles.doctorTitle}>Available Specialists:</p>
                                    {hospital.doctors.map(doc => (
                                        <div key={doc.id} className={styles.doctorItem}>
                                            <div className={styles.docInfo}>
                                                <span className={styles.docName}>{doc.name}</span>
                                                <span className={styles.docSpecialty}>{doc.specialty}</span>
                                            </div>
                                            <Link href={`/book/${hospital.id}/${doc.id}`} className={`btn-outline ${styles.bookBtn}`} style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>
                                                Book
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredHospitals.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-lighter)' }}>
                        <h3>No hospitals or doctors match your search.</h3>
                        <p>Try modifying your location or problem keywords.</p>
                    </div>
                )}
            </section>
        </main>
    );
}
