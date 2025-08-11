import React, { createContext, useContext, useState } from 'react';

const EventContext = createContext(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within EventProvider');
  }
  return context;
};

const initialEvents = [
  {
    id: '1',
    name: 'Tech Innovation Summit 2024',
    organizer: 'Tech Society',
    date: '2024-02-15',
    time: '10:00',
    venue: 'Main Auditorium',
    type: 'Technical',
    description: 'Join us for an exciting day of innovation, networking, and learning. Discover the latest trends in technology and connect with industry leaders.',
    speakers: ['Dr. Sarah Johnson', 'Mark Thompson', 'Lisa Chen'],
    agenda: ['Opening Keynote', 'Panel Discussion', 'Networking Lunch', 'Workshop Sessions'],
    registrationDeadline: '2024-02-10',
    maxParticipants: 200,
    registeredCount: 150,
    createdBy: '1',
    department: 'Computer Science',
    registrations: []
  },
  {
    id: '2',
    name: 'Cultural Fest 2024',
    organizer: 'Cultural Committee',
    date: '2024-02-20',
    time: '18:00',
    venue: 'Open Ground',
    type: 'Cultural',
    description: 'Celebrate diversity and creativity at our annual cultural festival. Enjoy music, dance, food, and art from around the world.',
    speakers: ['Artist Collective', 'Music Band'],
    agenda: ['Cultural Performances', 'Food Stalls', 'Art Exhibition', 'DJ Night'],
    registrationDeadline: '2024-02-18',
    maxParticipants: 500,
    registeredCount: 320,
    createdBy: '2',
    department: 'Student Affairs',
    registrations: []
  },
  {
    id: '3',
    name: 'AI Workshop Series',
    organizer: 'AI Research Lab',
    date: '2024-02-25',
    time: '14:00',
    venue: 'Lab Complex',
    type: 'Workshop',
    description: 'Hands-on workshop series covering machine learning, deep learning, and practical AI applications.',
    speakers: ['Prof. Michael Davis', 'Research Team'],
    agenda: ['Introduction to AI', 'Hands-on Coding', 'Project Showcase', 'Q&A Session'],
    registrationDeadline: '2024-02-22',
    maxParticipants: 50,
    registeredCount: 35,
    createdBy: '1',
    department: 'Computer Science',
    registrations: []
  },
  {
    id: '4',
    name: 'Sports Tournament',
    organizer: 'Sports Club',
    date: '2024-03-01',
    time: '09:00',
    venue: 'Sports Complex',
    type: 'Sports',
    description: 'Annual inter-department sports tournament featuring basketball, football, and athletics.',
    registrationDeadline: '2024-02-26',
    maxParticipants: 300,
    registeredCount: 180,
    createdBy: '3',
    department: 'Physical Education',
    registrations: []
  }
];

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(initialEvents);

  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now().toString(),
      registrations: []
    };
    setEvents(prevEvents => [...prevEvents, newEvent]);
  };

  const getEventById = (id) => {
    return events.find(event => event.id === id);
  };

  const getEventsByCreator = (creatorId) => {
    return events.filter(event => event.createdBy === creatorId);
  };

  const registerForEvent = (eventId, registrationData = null) => {
    setEvents(prevEvents =>
      prevEvents.map(event => {
        if (event.id === eventId && event.registeredCount < event.maxParticipants) {
          const newRegistration = {
            id: Date.now().toString(),
            userId: registrationData?.userId || 'anonymous',
            name: registrationData?.name || 'Anonymous User',
            email: registrationData?.email || '',
            location: registrationData?.location || '',
            registeredAt: new Date().toISOString(),
            ...registrationData
          };
          
          return { 
            ...event, 
            registeredCount: event.registeredCount + 1,
            registrations: [...(event.registrations || []), newRegistration]
          };
        }
        return event;
      })
    );
    return true;
  };

  const unregisterFromEvent = (eventId, registrationId) => {
    setEvents(prevEvents =>
      prevEvents.map(event => {
        if (event.id === eventId) {
          const updatedRegistrations = (event.registrations || []).filter(
            reg => reg.id !== registrationId
          );
          return { 
            ...event, 
            registeredCount: Math.max(0, event.registeredCount - 1),
            registrations: updatedRegistrations
          };
        }
        return event;
      })
    );
    return true;
  };

  const getEventRegistrations = (eventId) => {
    const event = getEventById(eventId);
    return event?.registrations || [];
  };

  return (
    <EventContext.Provider value={{
      events,
      addEvent,
      getEventById,
      getEventsByCreator,
      registerForEvent,
      unregisterFromEvent,
      getEventRegistrations
    }}>
      {children}
    </EventContext.Provider>
  );
};
