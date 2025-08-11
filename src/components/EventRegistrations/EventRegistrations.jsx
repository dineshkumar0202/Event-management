import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './EventRegistrations.module.css';

const EventRegistrations = ({ event, registrations, onDeleteRegistration, onRefresh }) => {
  const { user } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if current user is the event creator
  const isEventCreator = user && event.createdBy === user.id;

  const handleDeleteClick = (registrationId) => {
    setShowDeleteConfirm(registrationId);
  };

  const handleDeleteConfirm = async (registrationId) => {
    setIsDeleting(true);
    try {
      await onDeleteRegistration(event.id, registrationId);
      setShowDeleteConfirm(null);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting registration:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  if (!registrations || registrations.length === 0) {
    return (
      <div className={styles.emptyState}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className={styles.emptyIcon}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
        <h3>No Registrations Yet</h3>
        <p>Be the first to register for this event!</p>
      </div>
    );
  }

  return (
    <div className={styles.registrationsContainer}>
      <div className={styles.header}>
        <h3>Event Registrations ({registrations.length})</h3>
        {isEventCreator && (
          <span className={styles.creatorBadge}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
            </svg>
            Event Organizer
          </span>
        )}
      </div>

      <div className={styles.registrationsList}>
        {registrations.map((registration) => (
          <div key={registration.id} className={styles.registrationItem}>
            <div className={styles.registrationInfo}>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  {registration.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className={styles.userDetails}>
                  <div className={styles.userName}>{registration.name}</div>
                  <div className={styles.userEmail}>{registration.email}</div>
                  {registration.location && (
                    <div className={styles.userLocation}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      {registration.location}
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.registrationMeta}>
                <div className={styles.registrationDate}>
                  Registered: {new Date(registration.registeredAt).toLocaleDateString()}
                </div>
                {isEventCreator && (
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteClick(registration.id)}
                    title="Delete registration"
                    disabled={isDeleting}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm === registration.id && (
              <div className={styles.deleteConfirm}>
                <div className={styles.deleteConfirmContent}>
                  <div className={styles.deleteConfirmHeader}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={styles.warningIcon}>
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2"/>
                      <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2"/>
                      <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <h4>Delete Registration</h4>
                  </div>
                  <p>Are you sure you want to delete the registration for <strong>{registration.name}</strong>? This action cannot be undone.</p>
                  <div className={styles.deleteConfirmActions}>
                    <button
                      className={styles.cancelButton}
                      onClick={handleDeleteCancel}
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.confirmDeleteButton}
                      onClick={() => handleDeleteConfirm(registration.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventRegistrations;
