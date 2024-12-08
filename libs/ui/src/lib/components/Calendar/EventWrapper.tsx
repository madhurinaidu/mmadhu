import dayjs from 'dayjs';
import { EventWrapperProps } from 'react-big-calendar';
import { CalendarEvent } from './types';

const EventWrapper: React.FC<EventWrapperProps<CalendarEvent>> = ({
  event,
  onClick,
  onDoubleClick,
  style,
  className,
}) => { 
  // Map statuses to colors
  const getBackgroundColor = (event: CalendarEvent): string => {
    const now = dayjs();
    const eventStart = dayjs(event.start);

    if (
      now.isAfter(eventStart) &&
      !event.AppointmentStatus?.CheckedIn?.Doctor?.Joined &&
      !event.AppointmentStatus?.CheckedIn?.Patient?.Joined
    ) {
      return 'gray'; // Grayed out
    }
    if (event.AppointmentStatus?.NoShow) {
      return 'orange';
    }
    if (event.AppointmentStatus?.Rescheduled) {
      return 'lightblue';
    }
    if (event.AppointmentStatus?.Completed?.PaymentDone) {
      return 'lightgray';
    }
    if (event.AppointmentStatus?.MeetingCompleted) {
      return 'gray';
    }
    if (
      event.AppointmentStatus?.CheckedIn?.Doctor?.Joined ||
      event.AppointmentStatus?.CheckedIn?.Patient?.Joined
    ) {
      return 'green';
    }
    if (
      event.AppointmentStatus?.checkedOut?.Doctor?.Ended ||
      event.AppointmentStatus?.checkedOut?.Patient?.Ended
    ) {
      return 'purple';
    }
    if (event.AppointmentStatus?.Booked) {
      return 'blue';
    }
    return 'transparent'; // Default fallback
  };

  const backgroundColor = getBackgroundColor(event);
  const textColor =
    backgroundColor === 'green' || backgroundColor === 'blue' || backgroundColor === 'purple'
      ? 'white'
      : 'black';

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor,
        color: textColor,
        height: `${style?.height}%`,
        top: `${style?.top}%`,
        width: `${style?.width}%`,
        left: `${style?.left}%`,
      }}
      className={`p-0.5 rbc-event whitespace-nowrap overflow-hidden text-ellipsis ${className}`}
    >
      {dayjs(event.start).format('hh:mm a')} - {event.title}
    </div>
  );
};

export default EventWrapper;