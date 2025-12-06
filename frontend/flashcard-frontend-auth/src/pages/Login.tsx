import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
    const { login } = useAuthContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            if (rememberMe) {
                localStorage.setItem('rememberEmail', email);
            } else {
                localStorage.removeItem('rememberEmail');
            }
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberEmail');
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Sign in to continue to your flashcard collection</p>
                </div>
                
                {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">
                            <span className="label-text">Email Address</span>
                        </label>
                        <div className="input-wrapper">
                            <span className="input-icon">📧</span>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            <span className="label-text">Password</span>
                        </label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <div className="form-options">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span>Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="forgot-link">
                            Forgot password?
                        </Link>
                    </div>

                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register" className="auth-link">
                            Sign up here
                        </Link>
                    </p>
                </div>

                <div className="auth-divider">
                    <span>Or continue with</span>
                </div>

                <div className="social-login">
                    <button type="button" className="social-button">
                        <span>🔵</span>
                        <span>Google</span>
                    </button>
                    <button type="button" className="social-button">
                        <span>⚫</span>
                        <span>GitHub</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;