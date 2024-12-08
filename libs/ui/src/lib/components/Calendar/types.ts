type CalendarEvent = {
  AppointmentStatus: any;
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  desc?: string;
  Completed?:boolean;
};

export type { CalendarEvent };
