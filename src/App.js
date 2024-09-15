import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import ProfileCreation from './ProfileCreation'; // Import ProfileCreation component
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false); // Set loading to false when auth check is complete
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while checking auth
  }

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Aura</h1>
        </header>
        <main className="profile-content">
          <Routes>
            {user ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-profile" element={<ProfileCreation />} />
              </>
            ) : (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                {/* Redirect any unknown route to /login */}
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
