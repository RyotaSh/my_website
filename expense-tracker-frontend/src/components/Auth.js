import { useState } from 'react';
import api from '../api';

export default function Auth({ onAuthSuccess }) {
  const [username, setUsername] = useState('');
  const [mode, setMode] = useState('login'); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) return alert('Enter a username');

    try {
      const endpoint = mode === 'login' ? '/login' : '/users';
      const res = await api.post(endpoint, { username });
      console.log(res.data); 
      onAuthSuccess(res.data.userId);
      localStorage.setItem('userId', res.data.userId); 
      setUsername('');
      alert(`${mode === 'login' ? 'Logged in' : 'Registered'} successfully!`);
    } catch (err) {
      console.error('Axios error:', err.response ? err.response.data : err);
      alert(err.response?.data?.error || 'Error');
    }
  };

  return (
    <div style={{ border: '1px solid gray', padding: '20px', width: '300px', margin: '20px auto' }}>
      {/* Toggle buttons */}
      <div style={{ marginBottom: '10px' }}>
        <button
          style={{ marginRight: '5px', backgroundColor: mode === 'login' ? '#ccc' : '#fff' }}
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          style={{ backgroundColor: mode === 'register' ? '#ccc' : '#fff' }}
          onClick={() => setMode('register')}
        >
          Register
        </button>
      </div>

      <h3 style={{ textAlign: 'center' }}>{mode === 'login' ? 'Login' : 'Register'}</h3>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
      </form>
    </div>
  );
}
