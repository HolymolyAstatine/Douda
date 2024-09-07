import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';

moment.locale('ko');
const localizer = momentLocalizer(moment);

const CalendarContainer = styled.div`
  height: 500px;
`;

const EventForm = styled.form`
  margin-top: 20px;
`;

const Input = styled.input`
  margin-right: 10px;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<Event>({
    id: 0,
    title: '',
    start: new Date(),
    end: new Date(),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: new Date(value) }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEvents(prev => [...prev, { ...newEvent, id: Date.now() }]);
    setNewEvent({
      id: 0,
      title: '',
      start: new Date(),
      end: new Date(),
    });
  };

  return (
    <div>
      <CalendarContainer>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
        />
      </CalendarContainer>
      <EventForm onSubmit={handleSubmit}>
        <Input
          type="text"
          name="title"
          value={newEvent.title}
          onChange={handleInputChange}
          placeholder="일정 제목"
          required
        />
        <Input
          type="datetime-local"
          name="start"
          value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')}
          onChange={handleDateChange}
          required
        />
        <Input
          type="datetime-local"
          name="end"
          value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')}
          onChange={handleDateChange}
          required
        />
        <Button type="submit">일정 추가</Button>
      </EventForm>
    </div>
  );
};

export default Calendar;