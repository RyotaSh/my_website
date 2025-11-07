import { useState } from 'react';
import api from '../api';

export default function EditExpense({ expense, onClose, onSaved }) {
  const [amount, setAmount] = useState(expense.amount);
  const [category, setCategory] = useState(expense.category);
  const [date, setDate] = useState(expense.date);
  const [description, setDescription] = useState(expense.description || '');

  const handleSave = async () => {
    try {
      await api.put(`/expenses/${expense.id}`, { amount, category, date, description });
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error updating expense');
    }
  };

  return (
    <div style={{ border: '2px solid blue', padding: '10px', margin: '10px' }}>
      <h3>Edit Expense</h3>
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
      <input type="text" value={category} onChange={e => setCategory(e.target.value)} />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
