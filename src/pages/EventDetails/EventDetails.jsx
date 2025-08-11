import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import EventRegistrationForm from '../../components/EventRegistrationForm/EventRegistrationForm';
import EventRegistrations from '../../components/EventRegistrations/EventRegistrations';
import styles from './EventDetails.module.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, registerForEvent, unregisterFromEvent, getEventRegistrations } = useEvents();
  const { user } = useAuth();
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [currentRegistration, setCurrentRegistration] = useState(null);

  const event = id ? getEventById(id) : null;

  useEffect(() => {
    if (event) {
      const eventRegistrations = getEventRegistrations(event.id);
      setRegistrations(eventRegistrations);
      
      // Check if current user is registered
      if (user) {
        const userRegistration = eventRegistrations.find(reg => reg.userId === user.id);
        setIsRegistered(!!userRegistration);
        setCurrentRegistration(userRegistration);
      }
    }
  }, [event, user, getEventRegistrations]);

  if (!event) {
    return (
      <div className={styles.notFound}>
        <h2>Event Not Found</h2>
        <p>The event you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/events')} className={styles.backBtn}>
          Back to Events
        </button>
      </div>
    );
  }

  const handleRegister = (registrationData = null) => {
    if (registerForEvent(event.id, registrationData)) {
      if (registrationData) {
        // Registering another person
        setShowRegistrationForm(false);
      } else {
        // Self-registration
        setIsRegistered(true);
        setCurrentRegistration({
          id: Date.now().toString(),
          userId: user?.id || 'anonymous',
          name: user?.name || 'Anonymous User',
          email: user?.email || '',
          location: '',
          registeredAt: new Date().toISOString()
        });
      }
      
      // Refresh registrations
      const updatedRegistrations = getEventRegistrations(event.id);
      setRegistrations(updatedRegistrations);
    }
  };

  const handleUnregister = () => {
    if (currentRegistration && unregisterFromEvent(event.id, currentRegistration.id)) {
      setIsRegistered(false);
      setCurrentRegistration(null);
      
      // Refresh registrations
      const updatedRegistrations = getEventRegistrations(event.id);
      setRegistrations(updatedRegistrations);
    }
  };

  const handleDeleteRegistration = async (eventId, registrationId) => {
    if (unregisterFromEvent(eventId, registrationId)) {
      // Refresh registrations
      const updatedRegistrations = getEventRegistrations(event.id);
      setRegistrations(updatedRegistrations);
      return Promise.resolve();
    }
    return Promise.reject(new Error('Failed to delete registration'));
  };

  const handleRefreshRegistrations = () => {
    const updatedRegistrations = getEventRegistrations(event.id);
    setRegistrations(updatedRegistrations);
  };

  const isDeadlinePassed = new Date(event.registrationDeadline) < new Date();
  const isFull = event.registeredCount >= event.maxParticipants;
  const spotsLeft = event.maxParticipants - event.registeredCount;
  const isEventCreator = user && event.createdBy === user.id;

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
    <div className={styles.eventDetails}>
      <div className={styles.container}>
        <button onClick={() => navigate('/events')} className={styles.backButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Events
        </button>

        <div className={styles.eventHeader}>
          <div className={styles.eventMeta}>
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
          
          <h1 className={styles.eventTitle}>{event.name}</h1>
          
          <div className={styles.basicInfo}>
            <div className={styles.infoItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div>
                <strong>{new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</strong>
                <div>{event.time}</div>
              </div>
            </div>
            
            <div className={styles.infoItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div>
                <strong>{event.venue}</strong>
              </div>
            </div>
            
            <div className={styles.infoItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div>
                <strong>Organized by</strong>
                <div>{event.organizer}</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.mainContent}>
            <section className={styles.section}>
              <h2>Description</h2>
              <p>{event.description}</p>
            </section>

            {event.speakers && event.speakers.length > 0 && (
              <section className={styles.section}>
                <h2>Speakers</h2>
                <div className={styles.speakersList}>
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className={styles.speaker}>
                      <div className={styles.speakerAvatar}>
                        {speaker.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span>{speaker}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {event.agenda && event.agenda.length > 0 && (
              <section className={styles.section}>
                <h2>Agenda</h2>
                <ul className={styles.agendaList}>
                  {event.agenda.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Registrations Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Registrations</h2>
                <div className={styles.registrationActions}>
                  {!isRegistered && !isDeadlinePassed && !isFull && (
                    <>
                      <button
                        className={styles.registerAnotherButton}
                        onClick={() => setShowRegistrationForm(true)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                          <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" strokeWidth="2"/>
                          <line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Register Another Person
                      </button>
                      <button
                        className={styles.viewRegistrationsButton}
                        onClick={() => setShowRegistrations(!showRegistrations)}
                      >
                        {showRegistrations ? 'Hide' : 'View'} Registrations ({registrations.length})
                      </button>
                    </>
                  )}
                  {isRegistered && (
                    <button
                      className={styles.viewRegistrationsButton}
                      onClick={() => setShowRegistrations(!showRegistrations)}
                    >
                      {showRegistrations ? 'Hide' : 'View'} Registrations ({registrations.length})
                    </button>
                  )}
                  {isEventCreator && (
                    <button
                      className={styles.viewRegistrationsButton}
                      onClick={() => setShowRegistrations(!showRegistrations)}
                    >
                      {showRegistrations ? 'Hide' : 'View'} Registrations ({registrations.length})
                    </button>
                  )}
                </div>
              </div>

              {showRegistrations && (
                <EventRegistrations
                  event={event}
                  registrations={registrations}
                  onDeleteRegistration={handleDeleteRegistration}
                  onRefresh={handleRefreshRegistrations}
                />
              )}
            </section>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.registrationCard}>
              <div className={styles.registrationHeader}>
                <h3>Registration</h3>
                <div className={styles.deadline}>
                  Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
                </div>
              </div>

              <div className={styles.registrationStats}>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>{event.registeredCount}</div>
                  <div className={styles.statLabel}>Registered</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>{spotsLeft}</div>
                  <div className={styles.statLabel}>Spots Left</div>
                </div>
              </div>

              <div className={styles.progressBar}>
                <div 
                  className={styles.progress} 
                  style={{ 
                    width: `${(event.registeredCount / event.maxParticipants) * 100}%` 
                  }}
                />
              </div>

              {isRegistered ? (
                <div className={styles.registeredActions}>
                  <button 
                    className={`${styles.registerButton} ${styles.registered}`}
                    disabled
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Registered!
                  </button>
                  <button 
                    className={styles.unregisterButton}
                    onClick={handleUnregister}
                  >
                    Unregister
                  </button>
                </div>
              ) : (
                <button 
                  className={`${styles.registerButton} ${(isDeadlinePassed || isFull) ? styles.disabled : ''}`}
                  onClick={() => handleRegister()}
                  disabled={isDeadlinePassed || isFull}
                >
                  {isDeadlinePassed ? 'Registration Closed' :
                   isFull ? 'Event Full' : 'Register Now'}
                </button>
              )}

              {isDeadlinePassed && (
                <div className={styles.deadlineWarning}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Registration deadline has passed
                </div>
              )}
            </div>

            {event.department && (
              <div className={styles.infoCard}>
                <h3>Event Details</h3>
                <div className={styles.detailItem}>
                  <span>Department:</span>
                  <span>{event.department}</span>
                </div>
                <div className={styles.detailItem}>
                  <span>Type:</span>
                  <span>{event.type}</span>
                </div>
                <div className={styles.detailItem}>
                  <span>Max Participants:</span>
                  <span>{event.maxParticipants}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registration Form Modal */}
      <EventRegistrationForm
        event={event}
        onRegister={handleRegister}
        onCancel={() => setShowRegistrationForm(false)}
        isOpen={showRegistrationForm}
      />
    </div>
  );
};

export default EventDetails;
