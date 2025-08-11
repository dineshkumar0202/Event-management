import React, { useState, useMemo } from 'react';
import { useEvents } from '../../context/EventContext';
import EventCard from '../../components/EventCard/EventCard';
import styles from './EventsListing.module.css';

const EventsListing = () => {
  const { events } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const eventTypes = ['Cultural', 'Technical', 'Sports', 'Workshop', 'Seminar'];
  const departments = [...new Set(events.map(e => e.department).filter(Boolean))];

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === '' || event.type === selectedType;
      const matchesDepartment = selectedDepartment === '' || event.department === selectedDepartment;
      
      const matchesDate = dateFilter === '' || event.date >= dateFilter;

      return matchesSearch && matchesType && matchesDepartment && matchesDate;
    });
  }, [events, searchTerm, selectedType, selectedDepartment, dateFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedDepartment('');
    setDateFilter('');
  };

  return (
    <div className={styles.eventsListing}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>All Events</h1>
          <p className={styles.subtitle}>
            Discover and join amazing events happening around you
          </p>
        </div>

        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterRow}>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Types</option>
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={styles.dateFilter}
            />

            <button onClick={clearFilters} className={styles.clearBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Clear
            </button>
          </div>
        </div>

        <div className={styles.results}>
          <div className={styles.resultCount}>
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
          </div>
        </div>

        <div className={styles.eventGrid}>
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className={styles.noResults}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className={styles.noResultsIcon}>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <h3>No events found</h3>
            <p>Try adjusting your search criteria or filters</p>
            <button onClick={clearFilters} className={styles.resetBtn}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsListing;
