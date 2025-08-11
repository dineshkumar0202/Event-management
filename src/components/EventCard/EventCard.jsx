import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import styles from './EventCard.module.css';

const EventCard = ({ event }) => {
  const { registerForEvent } = useEvents();
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (registerForEvent(event.id)) {
      setIsRegistered(true);
    }
  };

  const isDeadlinePassed = new Date(event.registrationDeadline) < new Date();
  const isFull = event.registeredCount >= event.maxParticipants;
  const spotsLeft = event.maxParticipants - event.registeredCount;

  const getTypeColor = (type) => {
    const colors = {
      Cultural: '#ff6b6b',
      Technical: '#4ecdc4',
      Sports: '#45b7d1',
      Workshop: '#96ceb4',
      Seminar: '#feca57'
    };
    return colors[type] || '#6c757d';
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div 
          className={styles.typeTag}
          style={{ backgroundColor: getTypeColor(event.type) }}
        >
          {event.type}
        </div>
        {spotsLeft <= 10 && spotsLeft > 0 && (
          <div className={styles.urgentTag}>
            Only {spotsLeft} spots left!
          </div>
        )}
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.eventTitle}>{event.name}</h3>
        
        <div className={styles.eventMeta}>
          <div className={styles.metaItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
            {new Date(event.date).toLocaleDateString()} at {event.time}
          </div>
          
          <div className={styles.metaItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
            {event.venue}
          </div>
          
          <div className={styles.metaItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            </svg>
            {event.organizer}
          </div>
        </div>

        <p className={styles.description}>
          {event.description.length > 120 
            ? `${event.description.slice(0, 120)}...` 
            : event.description
          }
        </p>

        <div className={styles.registrationInfo}>
          <div className={styles.participantCount}>
            {event.registeredCount}/{event.maxParticipants} registered
          </div>
          <div className={styles.deadline}>
            Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className={styles.cardActions}>
        <Link to={`/events/${event.id}`} className={styles.detailsBtn}>
          View Details
        </Link>
        
        <button 
          className={`${styles.registerBtn} ${isRegistered ? styles.registered : ''} ${(isDeadlinePassed || isFull) ? styles.disabled : ''}`}
          onClick={handleRegister}
          disabled={isDeadlinePassed || isFull || isRegistered}
        >
          {isRegistered ? 'Registered!' : 
           isDeadlinePassed ? 'Deadline Passed' :
           isFull ? 'Event Full' : 'Register'}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
