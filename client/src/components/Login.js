import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import userContext from './context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser, setToken } = useContext(userContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        const credentials = { username, password };

        try {
            const response = await axios.post('http://localhost:3000/login', credentials, {
                headers: { 'Content-Type': 'application/json' },
            });
            
            // Set user and token in context
            setUser({ username });
            setToken(response.data.token);
            console.log('Token received:', response.data.token);

            navigate('/dashboard'); // Navigate to Home.js
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Login failed. Please try again.');
        }
    };

    return (

        <>
            <div className='container'>
            <div className='login-card'>
                <h2 className='card-title'>Login</h2>
                <form onSubmit={handleLogin}>
                    <div>
                        <label className='form-label' htmlFor="username">Username:</label>
                        <input
                            className='form-input'
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className='form-label' htmlFor="password">Password:</label>
                        <input
                            className='form-input'
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className='error-message'>{error}</p>}
                    <button type="submit" className='login-button'>Login</button>
                </form>
            </div>
        </div>
        </>
        
    );
};

export default Login;