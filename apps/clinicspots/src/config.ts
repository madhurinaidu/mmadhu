export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const API = {
  login: `${API_BASE_URL}/veeapp/auth/login`,
  appointmentsFilter: `${API_BASE_URL}/veeapp/meeting/getMeetingList`,
  // bookAppointment: `${API_BASE_URL}/veeapp/meeting/meetingRequest`,
  doctorList: `${API_BASE_URL}/veeapp/user/getDoctorsList`,
  allAppointents: `${API_BASE_URL}/veeapp/meeting/getAllMeetings`,

};
