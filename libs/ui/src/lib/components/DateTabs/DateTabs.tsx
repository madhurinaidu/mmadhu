'use client';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import Button from '../Button/Button';
import DaySlots from './DaySlots';

interface ITabs {
  label: string | React.ReactNode;
  key: string;
  subText: string | React.ReactNode;
  isSlotAvailable: boolean;
  date: string | Date;
}
export interface IDaySlot {
  label: string;
  key: string;
  isSlotAvailable: boolean;
  hour: number;
  minute: number;
}
interface IDaySlots {
  morning: IDaySlot[];
  afternoon: IDaySlot[];
  evening: IDaySlot[];
}

export interface IDateTabsProps {
  tabs: ITabs[];
  daySlots: IDaySlots;
  onSlotSelect: (startTime: string, endTime: string) => void;
}

const DateTabs = ({ tabs, daySlots, onSlotSelect }: IDateTabsProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const scrollContainer = useRef<HTMLDivElement | null>(null);

  const scrollToTab = (index: number) => {
    if (scrollContainer.current) {
      const tab = scrollContainer.current.children[index] as HTMLDivElement;
      if (tab) {
        scrollContainer.current.scrollTo({
          left:
            tab.offsetLeft -
            scrollContainer.current.offsetWidth / 2 +
            tab.offsetWidth / 2,
          behavior: 'smooth',
        });
      }
    }
    setActiveTab(index);
  };

  const handleNext = () => {
    if (activeTab < tabs.length - 1) {
      scrollToTab(activeTab + 1);
    }
  };

  const handlePrev = () => {
    if (activeTab > 0) {
      scrollToTab(activeTab - 1);
    }
  };

  const handleSlotSelect = (hour: number, minute: number) => {
    const { date } = tabs[activeTab];
    if (date) {
      const dateString = dayjs(date).format('YYYY-MM-DD');
      const startTime = `${dateString}T${hour}:${
        minute === 0 ? '00' : minute - 1
      }:00.000Z`;
      const endTime = `${dateString}T${hour}:${minute + 30 - 1}:00.000Z`;
      onSlotSelect(startTime, endTime);
    }
  };

  return (
    <div className="w-full dark:bg-gray-800 dark:text-gray-100 border-2 border-slate-200 dark:border-slate-700 text-gray-900 py-4 rounded-lg bg-slate-50">
      <div className="shadow-sm shadow-slate-300 dark:shadow-slate-700 px-4">
        <div className="relative flex items-center ">
          {/* Left Arrow */}
          <Button
            onClick={handlePrev}
            variant="filled"
            isIconButton
            rounded
            color="light"
            size="sm"
            className="absolute left-0 z-10 "
            disabled={activeTab === 0}
          >
            <CaretLeft size={20} />
          </Button>

          {/* Tabs */}
          <div
            ref={scrollContainer}
            style={{ scrollbarWidth: 'none' }}
            className="flex overflow-x-scroll gap-4  scrollbar-hide scroll-smooth mx-12"
          >
            {tabs.map((tab, index) => (
              <motion.div
                key={tab.key}
                onClick={() => scrollToTab(index)}
                className={`flex-shrink-0 cursor-pointer  text-gray-800 dark:text-slate-300 flex justify-center after:rounded-t-lg  relative after:content-[''] after:absolute after:bottom-0  after:h-[4px]  after:w-0 px-4 py-2 pb-3 text-center rounded-lg transition-colors ${
                  activeTab === index
                    ? 'after:bg-blue-500 dark:after:bg-slate-400 after:w-full font-bold dark:text-slate-50'
                    : ''
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-sm">{tab.label}</span>
                  <span
                    className={cn(
                      'text-xs mt-2 opacity-45 font-normal',
                      tab.isSlotAvailable &&
                        'text-green-600 dark:text-green-500 opacity-1'
                    )}
                  >
                    {tab.subText}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Arrow */}
          <Button
            onClick={handleNext}
            color="light"
            isIconButton
            variant="filled"
            size="sm"
            rounded
            className="absolute right-0 z-10"
            disabled={activeTab === tabs.length - 1}
          >
            <CaretRight size={20} />
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="mt-4 p-4 "
      >
        <DaySlots
          daySlots={daySlots.morning}
          title="Morning"
          onSlotSelect={handleSlotSelect}
          activeDate={dayjs(tabs[activeTab].date).toDate()} // Convert to Date

        />
        <DaySlots
          daySlots={daySlots.afternoon}
          title="Afternoon"
          onSlotSelect={handleSlotSelect}
          activeDate={dayjs(tabs[activeTab].date).toDate()} // Convert to Date

        />
        <DaySlots
          daySlots={daySlots.evening}
          title="Evening"
          onSlotSelect={handleSlotSelect}
          activeDate={dayjs(tabs[activeTab].date).toDate()} // Convert to Date

        />
      </motion.div>
    </div>
  );
};

export default DateTabs;
