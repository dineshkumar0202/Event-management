import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import EventCard from '../../components/EventCard/EventCard';
import styles from './Home.module.css';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { events } = useEvents();

  const featuredEvents = events.slice(0, 3);

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Discover Amazing Events
          </h1>
          <p className={styles.heroSubtitle}>
            Join thousands of people attending incredible events. Create, discover, and participate in events that matter to you.
          </p>
          <Link 
            to={isAuthenticated ? "/profile" : "/auth"} 
            className={styles.ctaButton}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            </svg>
            {isAuthenticated ? "View Profile" : "Add User Profile"}
          </Link>
        </div>
      </section>

      <section className={styles.featured}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Featured Events</h2>
          <div className={styles.eventGrid}>
            {featuredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <div className={styles.viewAll}>
            <Link to="/events" className={styles.viewAllBtn}>
              View All Events
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
