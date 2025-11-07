import { useState } from 'react';
import api from '../api';

export default function AddExpense({ userId }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const categories = [
    'Food',
    'Transportation',
    'Housing / Rent',
    'Utilities',
    'Entertainment',
    'Health / Medical',
    'Education',
    'Shopping / Clothing',
    'Travel',
    'Miscellaneous'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !category || !date) return;

    try {
      await api.post('/expenses', {
        user_id: userId,
        amount,
        category,
        date,
        description,
      });

      setAmount('');
      setCategory('');
      setDate('');
      setDescription('');

      
      window.location.reload();
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Expense</h3>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {/* Dropdown for category */}
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select category</option>
        {categories.map((cat, idx) => (
          <option key={idx} value={cat}>{cat}</option>
        ))}
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Add Expense</button>
    </form>
  );
}
