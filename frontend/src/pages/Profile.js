import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../api/axios';
import { FiUser, FiMail, FiPhone, FiCalendar, FiSave, FiCamera, FiAlertCircle } from 'react-icons/fi';

const Profile = () => {
    // Initial State
    const [userData, setUserData] = useState({
        first_name: '', last_name: '', email: '', phone: '', avatar_url: '', date_joined: null
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    // Fetch Profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axiosInstance.get('/api/profile/');
                const data = res.data;
                setUserData({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    email: data.email || '',
                    phone: data.profile?.phone || '',
                    avatar_url: data.profile?.avatar_url || '',
                    date_joined: data.date_joined || null // Logic fix for date
                });
            } catch (err) {
                console.error("Failed to fetch profile", err);
                setError("Could not load profile data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Handle Text Changes
    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    // Handle File Upload (Client-side Preview + Base64)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5242880) { // 5MB limit
                alert("File size should be less than 5MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserData(prev => ({ ...prev, avatar_url: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Submit Changes
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        // Simple Validation
        if (!userData.first_name || !userData.last_name) {
            setError("First Name and Last Name are required.");
            setIsSaving(false);
            return;
        }

        try {
            await axiosInstance.put('/api/profile/', userData);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Failed to update profile", err);
            setError("Failed to save changes. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    // Date Helper
    const formattedDate = userData.date_joined
        ? new Date(userData.date_joined).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : '—';

    return (
        <div className="dashboard-container">
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>

                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #E2E8F0' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-surface)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'var(--primary)', overflow: 'hidden', border: '2px solid var(--glass-border)'
                        }}>
                            {userData.avatar_url ? (
                                <img src={userData.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <FiUser />
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={() => fileInputRef.current.click()}
                            style={{
                                position: 'absolute', bottom: '0', right: '0', background: '#4F46E5', color: 'white',
                                border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                            }}
                            title="Upload Photo"
                        >
                            <FiCamera size={16} />
                        </button>
                    </div>
                    <div>
                        {isLoading ? (
                            <div style={{ height: '24px', width: '200px', background: '#F1F5F9', borderRadius: '4px' }}></div>
                        ) : (
                            <h2 style={{ margin: '0 0 8px 0' }}>{userData.first_name} {userData.last_name}</h2>
                        )}
                        <p style={{ margin: 0, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FiCalendar size={14} /> Member since {formattedDate}
                        </p>
                    </div>
                </div>

                {/* Validation Error */}
                {error && (
                    <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '12px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiAlertCircle /> {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>First Name <span style={{ color: 'red' }}>*</span></label>
                            <div style={{ position: 'relative' }}>
                                <FiUser style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input type="text" name="first_name" className="styled-input" style={{ width: '100%', padding: '12px 12px 12px 36px', boxSizing: 'border-box' }}
                                    value={userData.first_name} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Last Name <span style={{ color: 'red' }}>*</span></label>
                            <input type="text" name="last_name" className="styled-input" style={{ width: '100%', padding: '12px', boxSizing: 'border-box' }}
                                value={userData.last_name} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <FiMail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input type="email" name="email" className="styled-input" style={{ width: '100%', padding: '12px 12px 12px 36px', cursor: 'not-allowed', opacity: 0.7 }}
                                value={userData.email} readOnly />
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Email cannot be changed.</p>
                    </div>

                    <div className="form-group" style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Phone Number</label>
                        <div style={{ position: 'relative' }}>
                            <FiPhone style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input type="tel" name="phone" className="styled-input" style={{ width: '100%', padding: '12px 12px 12px 36px' }}
                                value={userData.phone} onChange={handleChange} placeholder="+91 98765 43210" pattern="[0-9\+\-\s]+" />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={isSaving} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: isSaving ? 0.7 : 1 }}>
                        <FiSave /> {isSaving ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
