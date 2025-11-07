import { useState, useEffect } from 'react';
import api from '../api';

export default function RegisterUser({ onUserRegistered }) {
  const [username, setUsername] = useState('');


  useEffect(() => {
    api.get('/')
      .then(res => console.log('Backend response (GET /):', res.data))
      .catch(err => console.error('Backend error (GET /):', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) return alert('Enter a username');

    try {
      const res = await api.post('/users', { username });
      console.log('POST /users response:', res.data);
      onUserRegistered(res.data.userId);
      setUsername('');
      alert('User registered successfully!');
    } catch (err) {
      console.error('Axios error:', err.response ? err.response.data : err);
      alert('Error registering user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  );
}
