import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiArrowRight, FiGithub, FiTwitter } from 'react-icons/fi';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await axios.post('http://127.0.0.1:8000/auth/register/', formData);
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Username or Email may already be taken.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page-split">
            {/* Left Section: Branding */}
            <div className="auth-branding-section">
                <div className="branding-content">
                    <div className="brand-logo-large">FinTrack.</div>
                    <div className="brand-tagline">
                        Master your finances with<br />
                        intelligence and style.
                    </div>
                </div>

                <div className="branding-visuals">
                    <div className="glass-card-mockup">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></div>
                            <div style={{ width: '60px', height: '20px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)' }}></div>
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>$12,450.00</div>
                        <div style={{ fontSize: '14px', opacity: 0.7 }}>Total Balance</div>
                    </div>
                </div>
            </div>

            {/* Right Section: Form */}
            <div className="auth-form-section">
                <div className="auth-form-container">
                    <div className="auth-header-split">
                        <h2>Create account</h2>
                        <p>Start your financial journey today</p>
                    </div>

                    {error && (
                        <div className="error-message" style={{ marginBottom: '24px' }}>
                            <FiAlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="social-auth">
                        <button className="social-btn">
                            <FiGithub size={20} />
                            <span>Github</span>
                        </button>
                        <button className="social-btn">
                            <FiTwitter size={20} />
                            <span>Twitter</span>
                        </button>
                    </div>

                    <div className="divider">Or register with email</div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <label>Username</label>
                            <div className="input-with-icon">
                                <FiUser size={18} />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="johndoe"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Email Address</label>
                            <div className="input-with-icon">
                                <FiMail size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <div className="input-with-icon">
                                <FiLock size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength="8"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isLoading}
                            style={{ width: '100%', marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                        >
                            {isLoading ? 'Creating Account...' : (
                                <>
                                    <span>Sign Up</span>
                                    <FiArrowRight />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
