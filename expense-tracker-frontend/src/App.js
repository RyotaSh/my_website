import { useState } from 'react';
import Auth from './components/Auth';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';

function App() {
  
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId') || null;
  });

  const handleLogout = () => {
    setUserId(null);
    localStorage.removeItem('userId');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Expense Tracker</h1>

      {/* Show Auth if not logged in */}
      {!userId && <Auth onAuthSuccess={setUserId} />}

      {/* Show main app if logged in */}
      {userId && (
        <>
          <button onClick={handleLogout} style={{ marginBottom: '20px' }}>
            Logout
          </button>
          <AddExpense userId={userId} onExpenseAdded={() => {}} />
          <ExpenseList userId={userId} />
        </>
      )}
    </div>
  );
}

export default App;
