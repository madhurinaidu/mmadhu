'use client';

import { API } from '@app/config';
import { Button, DateTabs, Modal, useToast } from '@libs/ui';
import { PersonSimpleWalk, VideoCamera } from '@phosphor-icons/react/dist/ssr';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


const daySlots = {
  morning: [
    {
      label: '10:00 AM',
      key: '10:00 AM',
      hour: 10,
      minute: 0,
      isSlotAvailable: true,
    },
    {
      label: '10:30 AM',
      key: '10:30 AM',
      hour: 10,
      minute: 30,
      isSlotAvailable: true,
    },
    {
      label: '11:00 AM',
      key: '11:00 AM',
      hour: 11,
      minute: 0,
      isSlotAvailable: true,
    },
    {
      label: '11:30 AM',
      key: '11:30 AM',
      hour: 11,
      minute: 30,
      isSlotAvailable: true,
    },
  ],
  afternoon: [
    {
      label: '12:00 PM',
      key: '12:00 PM',
      hour: 12,
      minute: 0,
      isSlotAvailable: true,
    },
    {
      label: '12:30 PM',
      key: '12:30 PM',
      hour: 12,
      minute: 30,
      isSlotAvailable: true,
    },
    {
      label: '1:00 PM',
      key: '1:00 PM',
      hour: 13,
      minute: 0,
      isSlotAvailable: true,
    },
  ],
  evening: [
    {
      label: '5:00 PM',
      key: '5:00 PM',
      hour: 17,
      minute: 0,
      isSlotAvailable: true,
    },
    {
      label: '5:30 PM',
      key: '5:30 PM',
      hour: 17,
      minute: 30,
      isSlotAvailable: true,
    },
    {
      label: '6:00 PM',
      key: '6:00 PM',
      hour: 18,
      minute: 0,
      isSlotAvailable: true,
    },
    {
      label: '6:30 PM',
      key: '6:30 PM',
      hour: 18,
      minute: 30,
      isSlotAvailable: true,
    },
  ],
};

const weekSlots = [
  {
    label: 'Today',
    key: 'today',
    date: dayjs().toDate(),
    isSlotAvailable: true,
    subText: '5 Available',
  },
  {
    label: 'Tomorrow',
    key: 'tomorrow',
    date: dayjs().add(1, 'day').toDate(),
    isSlotAvailable: true,
    subText: '12 Available',
  },
  {
    label: `${dayjs().add(2, 'day').format('ddd, D MMM')}`,
    key: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    date: dayjs().add(2, 'day').toDate(),
    isSlotAvailable: true,
    subText: '12 Available',
  },
  {
    label: `${dayjs().add(3, 'day').format('ddd, D MMM')}`,
    key: dayjs().add(3, 'day').format('YYYY-MM-DD'),
    date: dayjs().add(3, 'day').toDate(),
    isSlotAvailable: true,
    subText: '12 Available',
  },
  {
    label: `${dayjs().add(4, 'day').format('ddd, D MMM')}`,
    key: dayjs().add(4, 'day').format('YYYY-MM-DD'),
    date: dayjs().add(4, 'day').toDate(),
    isSlotAvailable: true,
    subText: '12 Available',
  },
];


export default function BookAppointment({
  doctorName,
  doctorId,
  address
}: {
  doctorName: string;
  doctorId:number,
  address:string

}) {


  const [isOpen, setIsOpen] = useState(false);
  const [consultType, setConsultType] = useState<'in-clinic' | 'video-consult'>(
    'video-consult'
  );
  const [selectedSlot, setSelectedSlot] = useState<{
    startTime: string;
    endTime: string;
  } | null>(null);
  const toast = useToast();
  const session = useSession();
  const router = useRouter();
  const token = session.data?.user?.accessToken;
  console.log('Token:', token);
  const [doctorDetails, setDoctorDetails] = useState({
    name: '',
    clinicSpotsId: '',
    userId: '',
    emailId: '',
  }); // Initial state for doctor details

  const fetchAppointments = async () => {
    try {
      console.log('Fetching appointments...');
      const response = await fetch(API.doctorList, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.data?.user?.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error details:', errorData);
        throw new Error(`Error: ${response.status}`);
      }
  
      const doctorListData = await response.json();
  
      // Find the matching doctor by clinicSpotsId
      const doctorListArray = doctorListData.data || doctorListData; // Adjust this based on actual response structure
    if (!Array.isArray(doctorListArray)) {
      console.error('Expected an array, but got:', doctorListData);
      throw new Error('Invalid API response format.');
    }
    console.log("doctorListArray",doctorListArray)
    console.log("doctorId",doctorId)

    // Find the matching doctor by clinicSpotsId
    const matchingDoctor = doctorListArray.find(
      (doctor: any) => doctor.clinicSpotsId === doctorId.toString()
    );
  
      if (!matchingDoctor) {
        toast?.open({
          message: 'No matching doctor found for the clinic spot ID.',
          variant: 'error',
        });
        return;
      }
  
      // Set the Doctor object dynamically
      setDoctorDetails({
        name: doctorName,
        clinicSpotsId: doctorId.toString(),
        userId: matchingDoctor._id,
        emailId: matchingDoctor.email,
      });

      console.log('Updated Doctor Details:', {
        name: doctorName,
        clinicSpotsId: doctorId.toString(),
        userId: matchingDoctor._id,
        emailId: matchingDoctor.email,
      });
      const appointmentsResponse = await fetch(`${API.allAppointents}?doctorId=${matchingDoctor._id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.data?.user?.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!appointmentsResponse.ok) {
        const appointmentsErrorData = await appointmentsResponse.json();
        console.error('Error fetching appointments:', appointmentsErrorData);
        throw new Error(`Error: ${appointmentsResponse.status}`);
      }
  
      const appointmentsData = await appointmentsResponse.json();
      console.log('Appointments for Doctor:', appointmentsData);
  
      // Store the appointments in state or process them as needed
      // Assuming there's a state for appointments
      setDoctorAppointments(appointmentsData.data || []);
   
      console.log('Appointments Filter Response:', matchingDoctor);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };
  

  const bookAppointment = async(type: 'in-clinic' | 'video-consult') => {
    if (session.status === 'unauthenticated') {
      router.push('/login');
    } else {
      await fetchAppointments();
      setConsultType(type); // Set the consultation type
      setIsOpen(true); // Open the modal
    }
  };
  const handleSlotSelect = (startTime: string, endTime: string) => {
    // Ensure valid date strings are set
    const adjustedStartTime = dayjs(startTime).subtract(5, 'hour').subtract(30, 'minute');
  const adjustedEndTime = dayjs(endTime).subtract(5, 'hour').subtract(30, 'minute');
  setSelectedSlot({
    startTime: adjustedStartTime.toISOString(),
    endTime: adjustedEndTime.toISOString(),
    });
  };

  const confirmAppointment = () => {
    if (selectedSlot) {
      const { startTime, endTime } = selectedSlot;
      const visitType = consultType === 'in-clinic' ? 'offline' : 'online';
      fetch(API.bookAppointment, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.data?.user?.accessToken}`,
        },
        body: JSON.stringify({
          repeats: '',
          location: 'vijayawada',
          meetingToBeVerified: true,
          title: 'Demo11',
          startTime: startTime,
          endTime: endTime,
          visit: visitType,
          participants: {
            Patients: {
              name: session.data?.user?.name,
              statusId: 1,
              userId: session.data?.user?.id,
            },
            Doctor: doctorDetails,
          },
        }),
      }).then(async (res) => {
        if (res.status === 200) {
          const data = await res.json();
          const json = {
            MeetingID: data.data[0].MeetingID,
            MeetingRoomID: data.data[0].MeetingRoomID,
            MeetingStatusID: data.data[0].MeetingStatusID,
            MeetingToBeVerified: data.data[0].MeetingToBeVerified,
            endTime: endTime,
            patientName: session.data?.user?.name,
            startTime: startTime,
          };
          setIsOpen(false);
          router.push('/dashboard/appointments');
          toast?.open({
            message: 'Appointment booked successfully',
            variant: 'success',
          });
        }
      });
    }
  };
  return (
    <>
      <Button
        variant="filled"
        color="primary"
        fullWidth
        leftIcon={<PersonSimpleWalk />}
        onClick={() => bookAppointment('in-clinic')}
      >
        Book Clinic Visit
      </Button>
      <Button
        variant="outlined"
        className="border-2 whitespace-nowrap px-4 py-2 text-sm flex items-center gap-2"
        color="warning"
        fullWidth
        leftIcon={<VideoCamera weight="fill" />}
        onClick={() => bookAppointment('video-consult')}
      >
        Book Video Consultation
      </Button>

      <Modal
        maxWidth="sm:max-w-2xl"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        // title={`Book an appointment for Consultation`}
      >
        <div className="p-2 mb-2">
          <h2 className="text-lg font-bold mb-2">
            Book an appointment for Consultation
          </h2>
          <p className="text-md font-semibold text-gray-700">
            Doctor: {doctorName}
          </p>
          {selectedSlot && (
            <p className="text-md font-semibold text-gray-700">
              Selected Slot: {dayjs(selectedSlot.startTime).format('hh:mm A')} -{' '}
              {dayjs(selectedSlot.endTime).format('hh:mm A')}
            </p>
          )}
        </div>

        <div className="flex flex-row justify-center">
          <ul className="grid w-full gap-6 md:grid-cols-2 max-w-md mb-4">
            <li>
              <input
                type="radio"
                id="in-clinic"
                name="consult-type"
                value="in-clinic"
                checked={consultType === 'in-clinic'}
                onChange={() => setConsultType('in-clinic')}
                className="hidden peer"
              />
              <label
                htmlFor="hosting-small"
                className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div className="block">
                  <div className="w-full text-lg font-semibold">In Clinic</div>
                  <div className="w-full text-xs">Visit the clinic</div>
                </div>
                <PersonSimpleWalk weight="fill" size={30} />
              </label>
            </li>
            <li>
              <input
                type="radio"
                id="video-consult"
                name="consult-type"
                value="video-consult"
                checked={consultType === 'video-consult'}
                onChange={() => setConsultType('video-consult')}
                className="hidden peer"
              />
              <label
                htmlFor="hosting-big"
                className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div className="block">
                  <div className="w-full text-lg font-semibold">
                    Video Consult
                  </div>
                  <div className="w-full text-xs">Consult from home</div>
                </div>
                <VideoCamera weight="fill" size={30} />
              </label>
            </li>
          </ul>
        </div>
        <div>
          <DateTabs
            tabs={weekSlots}
            daySlots={daySlots}
            onSlotSelect={handleSlotSelect}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            variant="filled"
            color="primary"
            disabled={!selectedSlot}
            onClick={confirmAppointment}
          >
            Confirm Appointment
          </Button>
        </div>
      </Modal>
    </>
  );
}
