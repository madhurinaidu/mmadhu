'use client';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {
  ComponentType,
  Fragment,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Calendar as BigCalendar,
  DateCellWrapperProps,
  DateLocalizer,
  momentLocalizer,
  SlotInfo,
  View,
  Views,
} from 'react-big-calendar';

import { Modal } from '../index';
import DateCellWrapper from './DateCellWrapper';
import DateHeader from './DateHeader';
// import events from './events';
import EventDetail from './EventDetail';
import EventWrapper from './EventWrapper';
import { Event } from './schema';
import './style.css';
import TimeGutterWrapper from './TimeGutterWrapper';
import Toolbar from './Toolbar';
import { CalendarEvent } from './types';
import WeekHeader from './WeekHeader';

const mLocalizer = momentLocalizer(moment);

export function Calendar({
  localizer = mLocalizer,
  showDemoLink = true,
  events = [],
  callUrl = '',
  ...props
}: {
  localizer?: DateLocalizer;
  showDemoLink?: boolean;
  events?: CalendarEvent[];
  callUrl?: string;
} & Record<string, any>) {
  const [view, setView] = useState<View>(Views.DAY);
  const ref = useRef<HTMLButtonElement>(null);
  const [date, setDate] = useState(new Date());
  const [eventDetail, setEventDetail] = useState<CalendarEvent | null>(null);
  const [popUpData, setPopUpData] = useState<{
    clientX?: number;
    clientY?: number;
    ref?: React.RefObject<HTMLButtonElement> | null;
    visible?: boolean;
  }>({ clientX: 0, clientY: 0, ref: null, visible: false });

  const { views } = useMemo(
    () => ({
      defaultDate: new Date(2015, 3, 1),
      views: Object.keys(Views).map((k) => Views[k as keyof typeof Views]),
    }),
    []
  );

  const onSelectSlot = useCallback((slotInfo: SlotInfo) => {
    console.log('ddd', slotInfo);
    openPopup(undefined, {
      clientX: slotInfo.box?.clientX,
      clientY: slotInfo.box?.clientY,
    });
  }, []);

  const closePopup = () => {
    setPopUpData({ ...popUpData, visible: false });
  };

  const openPopup = (
    ref?: React.RefObject<HTMLButtonElement>,
    box?: { clientX?: number; clientY?: number }
  ) => {
    setPopUpData({
      ...popUpData,
      visible: true,
      ref,
      clientX: box?.clientX,
      clientY: box?.clientY,
    });
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    console.log('Selected event:', event);
    setEventDetail(event);
    // Add any additional handling here
  };

  return (
    <Fragment>
      <Modal
        isOpen={eventDetail ? true : false}
        onClose={() => setEventDetail(null)}
      >
        {eventDetail && (
          <EventDetail
            event={eventDetail as unknown as Event}
            callUrl={callUrl}
            token={props.token}
          />
        )}
      </Modal>
      <div className="height600" {...props}>
        <BigCalendar
          style={{ minHeight: 600 }}
          className={`cal-view-${view}`}
          components={{
            week: { header: WeekHeader },
            eventWrapper: (props) => (
              <EventWrapper
                {...props}
                onClick={() => handleSelectEvent(props.event)}
              />
            ),
            timeGutterWrapper: TimeGutterWrapper,
            toolbar: Toolbar,
            month: { dateHeader: DateHeader },
            dateCellWrapper:
              DateCellWrapper as ComponentType<DateCellWrapperProps>,
          }}
          //   onSelectSlot={onSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable={true}
          date={date}
          onNavigate={setDate}
          events={events}
          localizer={localizer}
          onView={(view) => setView(view)}
          showMultiDayTimes
          view={view}
          step={60}
          views={views}
          onShowMore={(a) => console.log('show more', a)}
        />
      </div>
    </Fragment>
  );
}
Calendar.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
  showDemoLink: PropTypes.bool,
};
