import { useEffect, useState } from 'react';
import api from '../api';
import EditExpense from './EditExpense';

export default function ExpenseList({ userId, onListUpdated }) {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const fetchExpenses = async () => {
    try {
      const res = await api.get(`/expenses?user_id=${userId}`);
      setExpenses(res.data);
    } catch (err) {
      console.error('Fetch expenses error:', err);
    }
  };

  useEffect(() => {
    if (userId) fetchExpenses();
  }, [userId]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
      if (onListUpdated) onListUpdated();
    } catch (err) {
      console.error('Delete expense error:', err);
    }
  };


  const filteredExpenses = expenses.filter(exp => {
    let match = true;

    if (filterCategory) match = match && exp.category === filterCategory;
    if (filterDate) match = match && exp.date.slice(0, 10) === filterDate;
    if (filterMonth) match = match && exp.date.slice(0, 7) === filterMonth;

    return match;
  });


  const totalAll = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

const totalDay = filterDate
  ? expenses
      .filter(exp => exp.date.slice(0, 10) === filterDate)
      .reduce((sum, exp) => sum + Number(exp.amount), 0)
  : 0;


const monthForTotal = filterMonth || (filterDate ? filterDate.slice(0, 7) : undefined);

const totalMonth = monthForTotal
  ? expenses
      .filter(exp => exp.date.slice(0, 7) === monthForTotal)
      .reduce((sum, exp) => sum + Number(exp.amount), 0)
  : 0;


  return (
    <div>
      <h2>Expenses</h2>

      {/* Totals */}
      <div style={{ marginBottom: '15px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px', width: 'fit-content' }}>
        <h3>Totals</h3>
        <p>Total of the day: {totalDay}</p>
        <p>Total of the month: {totalMonth}</p>
        <p>Grand total: {totalAll}</p>
      </div>

      {/* FILTER SECTION */}
      <div style={{ marginBottom: '15px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px', width: 'fit-content' }}>
        <h3>Filter</h3>

        <div style={{ marginBottom: '10px' }}>
          <label>Category:</label>
          <input
            placeholder="Filter category"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            style={{ marginLeft: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Filter by day:</label>
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            style={{ marginLeft: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Filter by month:</label>
          <input
            type="month"
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            style={{ marginLeft: '5px' }}
          />
        </div>

        <button onClick={() => { setFilterCategory(''); setFilterDate(''); setFilterMonth(''); }}>
          Reset Filters
        </button>
      </div>

      {/* Edit modal */}
      {editingExpense && (
        <EditExpense
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSaved={() => { fetchExpenses(); if(onListUpdated) onListUpdated(); }}
        />
      )}

      {/* Expense list */}
      {filteredExpenses.length === 0 ? (
        <p>No expenses to show.</p>
      ) : (
        filteredExpenses.map(exp => (
          <div key={exp.id} style={{ border: '1px solid black', padding: '8px', margin: '5px' }}>
            <p>Amount: {exp.amount}</p>
            <p>Category: {exp.category}</p>
            <p>Date: {exp.date}</p>
            <p>Description: {exp.description || '-'}</p>
            <button onClick={() => setEditingExpense(exp)}>Edit</button>
            <button onClick={() => handleDelete(exp.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}
