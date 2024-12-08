import {
  GpsFix,
  HandGrabbing,
  PhoneTransfer,
  ThumbsDown,
  ThumbsUp,
  Users,
} from '@phosphor-icons/react';
import dayjs from 'dayjs';
import { getTimeFormat } from '../../utils/common';
import Button from '../Button/Button';
import { Event } from './schema';

export default function EventDetail({
  event,
  callUrl,
  token
}: {
  event: Event;
  callUrl: string;
  token:string
}) {
  const adjustedStartTime = dayjs(event.StartTime).subtract(5, 'hour').subtract(30, 'minute');
  const adjustedEndTime = dayjs(event.EndTime).subtract(5, 'hour').subtract(30, 'minute');
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleJoinConsultation = async () => {
    const apiUrl = `${API_BASE_URL}/veeapp/meeting/updateMeeting`;
console.log("event._id",event.MeetingID)
    const requestBody = {
      meeting_id: event._id,
      AppointmentStatus: {
        CheckedIn: {
          Doctor: {
            Joined: true,
            Time: new Date().toISOString(),
          },
        },
      },
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log('Meeting updated successfully.');
        // Navigate to the consultation page
        window.location.href = `${window.location.origin}/${callUrl}/${event.MeetingRoomID}/${event.Participants.Doctor.name}`;
      } else {
        console.error('Failed to update meeting:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating meeting:', error);
    }
  };


  return (
    <div className="bg-white dark:bg-gray-800 ">
      {/* Title */}
      <h1 className="text-2xl font-normal text-gray-800 dark:text-white mb-2 mt-2">
        {event.Title}
      </h1>

      {/* Date and Time */}
      <div className="text-gray-500 dark:text-gray-300 mb-4 font-light text-sm">
        <p>
           {adjustedStartTime.format('dddd, MMMM D')} •{' '}
          {adjustedStartTime.format('hh:mm a')} –{' '}
          {adjustedEndTime.format('hh:mm a')}
        </p>
        {/* <p>{event.recurrence}</p> */}
      </div>

      {/* Google Meet Button */}
      <Button
        variant="filled"
        leftIcon={<PhoneTransfer />}
               onClick={handleJoinConsultation}
      >
        {' '}
        Join Consultation
      </Button>

      {/* Meeting Link */}
      <p className="text-gray-500 dark:text-gray-300 mb-4 mt-1 text-xs">
        {`${window.location.origin}/${callUrl}/${event.MeetingRoomID}`}
      </p>

      {/* Phone Details */}
      {/* <div className="mb-4">
        <h2 className="text-blue-500 dark:text-blue-400 mb-1">Join by phone</h2>
        <p className="text-gray-600 dark:text-gray-300">{'+91 234 89 03242'}</p>
      </div> */}

      {/* Attendees */}
      
      {/* <div className="mb-4"> */}
        {/* <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <Users />
          <span>{2} guests</span>
        </div> */}
        {/* <p className="text-gray-600 dark:text-gray-300 ml-7">
          {event.responses}
        </p> */}
      {/* </div> */}

      <div className="mb-4">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <GpsFix />
          <span>
            {event.Location}{' '}
            <span className="text-gray-400 text-xs">(Patient Location)</span>
          </span>
        </div>
        {/* <p className="text-gray-600 dark:text-gray-300 ml-7">
          {event.responses}
        </p> */}
      </div>

      {/* Action Buttons */}
      {/* <div className="flex gap-2 mt-6">
        <Button
          fullWidth
          variant="outlined"
          color="success"
          leftIcon={<ThumbsUp />}
        >
          Yes
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          leftIcon={<ThumbsDown />}
        >
          No
        </Button>
        <Button fullWidth variant="outlined" leftIcon={<HandGrabbing />}>
          Maybe
        </Button>
      </div> */}
    </div>
  );
}
