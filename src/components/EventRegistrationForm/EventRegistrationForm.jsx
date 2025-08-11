import React, { useState } from 'react';
import styles from './EventRegistrationForm.module.css';

const EventRegistrationForm = ({ event, onRegister, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onRegister(formData);
      setFormData({ name: '', email: '', location: '' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Register for {event.name}</h3>
          <button 
            className={styles.closeButton}
            onClick={onCancel}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.name ? styles.error : ''}`}
              placeholder="Enter full name"
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.email ? styles.error : ''}`}
              placeholder="Enter email address"
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location" className={styles.label}>
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.location ? styles.error : ''}`}
              placeholder="Enter city, state, or country"
            />
            {errors.location && <span className={styles.errorText}>{errors.location}</span>}
          </div>

          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
            >
              Register
            </button>
          </div>
        </form>

        <div className={styles.eventInfo}>
          <div className={styles.infoItem}>
            <span>Date:</span>
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className={styles.infoItem}>
            <span>Time:</span>
            <span>{event.time}</span>
          </div>
          <div className={styles.infoItem}>
            <span>Venue:</span>
            <span>{event.venue}</span>
          </div>
          <div className={styles.infoItem}>
            <span>Available Spots:</span>
            <span>{event.maxParticipants - event.registeredCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationForm;
