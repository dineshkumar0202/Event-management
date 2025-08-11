import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import EventsListing from './pages/EventsListing/EventsListing';
import EventDetails from './pages/EventDetails/EventDetails';
import CreateEvent from './pages/CreateEvent/CreateEvent';
import Auth from './pages/Auth/Auth';
import Profile from './pages/Profile/Profile';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { EventProvider } from './context/EventContext';
import styles from './App.module.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventProvider>
          <Router>
            <div className={styles.app}>
              <Header />
              <main className={styles.main}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/events" element={<EventsListing />} />
                  <Route path="/events/:id" element={<EventDetails />} />
                  <Route path="/create" element={<CreateEvent />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </Router>
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
