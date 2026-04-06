'use client';

import { useState } from 'react';
import styles from './auth.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isLogin) {
            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (!res.ok) {
                    alert(data.error || 'Login failed');
                    return;
                }

                localStorage.setItem('medicare_user', JSON.stringify({ email: data.user.email, name: data.user.name, mobile: data.user.mobile, role: data.user.role }));
                alert(data.user.role === 'admin' ? "Admin logged in successfully!" : "Logged in successfully!");
                router.push(data.user.role === 'admin' ? '/admin' : '/');
            } catch (err) {
                alert("Network error occurred");
            }
        } else {
            // Registration Logic
            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password, mobile })
                });

                const data = await res.json();

                if (!res.ok) {
                    alert(data.error || 'Registration failed');
                    return;
                }

                localStorage.setItem('medicare_user', JSON.stringify({ email: data.user.email, name: data.user.name, mobile: data.user.mobile, role: data.user.role }));
                alert("Registered successfully!");
                router.push('/');
            } catch (err) {
                alert("Network error occurred");
            }
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <Link href="/" className={styles.backHome}>← Back to Home</Link>
                    <h2 className={styles.authTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p className={styles.authSubtitle}>
                        {isLogin
                            ? 'Enter your credentials to access your account'
                            : 'Join MediCare Plus to manage your appointments'}
                    </p>
                </div>

                <form className={styles.authBody} onSubmit={handleAuth}>
                    {!isLogin && (
                        <>
                            <div className={styles.formGroup}>
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Venkatesh"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Mobile Number</label>
                                <input
                                    type="tel"
                                    placeholder="e.g. 9876543210"
                                    required
                                    pattern="[0-9]{10}"
                                    title="Please enter a valid 10-digit mobile number"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>

                    <p className={styles.toggleAuth}>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <span
                            className={styles.toggleLink}
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Register now.' : 'Log in here.'}
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}
