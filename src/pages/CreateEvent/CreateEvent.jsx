import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import styles from './CreateEvent.module.css';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addEvent } = useEvents();

  const [formData, setFormData] = useState({
    name: '',
    organizer: '',
    date: '',
    time: '',
    venue: '',
    type: 'Technical',
    description: '',
    department: '',
    maxParticipants: 50,
    registrationDeadline: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?next=/create');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      const eventData = {
        ...formData,
        createdBy: user.id,
        registeredCount: 0,
        image: imagePreview || undefined,
        speakers: [],
        agenda: []
      };

      addEvent(eventData);
      navigate('/profile');
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.createEvent}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create New Event</h1>
          <p className={styles.subtitle}>
            Share your amazing event with the community
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Event Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={styles.input}
                placeholder="Enter event name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="organizer" className={styles.label}>
                Organizer *
              </label>
              <input
                type="text"
                id="organizer"
                name="organizer"
                value={formData.organizer}
                onChange={handleInputChange}
                required
                className={styles.input}
                placeholder="Organization or person organizing"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="date" className={styles.label}>
                Event Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className={styles.input}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="time" className={styles.label}>
                Start Time *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="venue" className={styles.label}>
                Venue *
              </label>
              <input
                type="text"
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                required
                className={styles.input}
                placeholder="Event location"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="type" className={styles.label}>
                Event Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className={styles.select}
              >
                <option value="Cultural">Cultural</option>
                <option value="Technical">Technical</option>
                <option value="Sports">Sports</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="department" className={styles.label}>
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Associated department (optional)"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="maxParticipants" className={styles.label}>
                Max Participants *
              </label>
              <input
                type="number"
                id="maxParticipants"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleInputChange}
                required
                min="1"
                max="1000"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="registrationDeadline" className={styles.label}>
                Registration Deadline *
              </label>
              <input
                type="date"
                id="registrationDeadline"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleInputChange}
                required
                className={styles.input}
                min={new Date().toISOString().split('T')[0]}
                max={formData.date}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Event Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={5}
              className={styles.textarea}
              placeholder="Describe your event in detail..."
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image" className={styles.label}>
              Event Poster/Image
            </label>
            <div className={styles.imageUpload}>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.imageInput}
              />
              <div className={styles.imageUploadArea}>
                {imagePreview ? (
                  <div className={styles.imagePreview}>
                    <img src={imagePreview} alt="Event preview" />
                    <div className={styles.imageOverlay}>
                      <span>Click to change</span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <div>
                      <strong>Upload Event Image</strong>
                      <p>Drag and drop or click to select</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => navigate('/events')}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitBtn}
            >
              {isSubmitting ? (
                <>
                  <div className={styles.spinner}></div>
                  Creating Event...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
