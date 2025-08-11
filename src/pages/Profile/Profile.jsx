import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import EventCard from '../../components/EventCard/EventCard';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const { getEventsByCreator } = useEvents();

  if (!user) {
    return null;
  }

  const userEvents = getEventsByCreator(user.id);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.profile}>
      <div className={styles.container}>
        <div className={styles.profileHeader}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className={styles.userDetails}>
              <h1 className={styles.userName}>{user.name}</h1>
              <p className={styles.userEmail}>{user.email}</p>
              <div className={styles.userStats}>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{userEvents.length}</span>
                  <span className={styles.statLabel}>Events Created</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>
                    {userEvents.reduce((total, event) => total + event.registeredCount, 0)}
                  </span>
                  <span className={styles.statLabel}>Total Registrations</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.profileActions}>
            <Link to="/create" className={styles.createEventBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/>
                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Create New Event
            </Link>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2"/>
                <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2"/>
                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Logout
            </button>
          </div>
        </div>

        <div className={styles.eventsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>My Events</h2>
            {userEvents.length > 0 && (
              <p className={styles.sectionSubtitle}>
                Manage and track your created events
              </p>
            )}
          </div>

          {userEvents.length > 0 ? (
            <div className={styles.eventGrid}>
              {userEvents.map(event => (
                <div key={event.id} className={styles.eventCardWrapper}>
                  <EventCard event={event} />
                  <div className={styles.eventManagement}>
                    <div className={styles.eventStats}>
                      <div className={styles.eventStat}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>{event.registeredCount} registered</span>
                      </div>
                      <div className={styles.eventStat}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                          <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                          <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                          <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>
                          {new Date(event.registrationDeadline) < new Date() ? 'Closed' : 'Open'}
                        </span>
                      </div>
                    </div>
                    <Link to={`/events/${event.id}`} className={styles.manageBtn}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="14" x2="12" y2="18" stroke="currentColor" strokeWidth="2"/>
                  <line x1="10" y1="16" x2="14" y2="16" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>No Events Yet</h3>
              <p>You haven't created any events yet. Start by creating your first event!</p>
              <Link to="/create" className={styles.createFirstEventBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/>
                  <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Create Your First Event
              </Link>
            </div>
          )}
        </div>

        <div className={styles.profileFooter}>
          <div className={styles.quickActions}>
            <h3>Quick Actions</h3>
            <div className={styles.actionGrid}>
              <Link to="/events" className={styles.actionCard}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <div>
                  <h4>Browse Events</h4>
                  <p>Discover events to attend</p>
                </div>
              </Link>
              <Link to="/create" className={styles.actionCard}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/>
                  <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <div>
                  <h4>Create Event</h4>
                  <p>Start organizing your event</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
