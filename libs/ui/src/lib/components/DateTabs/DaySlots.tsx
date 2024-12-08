import Button from '../Button/Button';
import { IDaySlot } from './DateTabs';
import dayjs from 'dayjs';
import { useState } from 'react';



export default function DaySlots({
  daySlots,
  title,
  onSlotSelect,
  activeDate, // New prop for active date
}: {
  daySlots: IDaySlot[];
  title: string;
  onSlotSelect: (hour: number, minute: number) => void;
  activeDate: Date; // Active date passed from DateTabs
}) {
  const now = dayjs(); // Get the current time
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null); // Track selected slot

  const handleSlotSelect = (hour: number, minute: number, slotKey: string) => {
    setSelectedSlot(slotKey); // Set the selected slot
    onSlotSelect(hour, minute); // Trigger parent function
  };

  return (
    <div className="flex flex-row gap-7 items-center py-4 last:mb-0 pl-2 border-b border-gray-200 dark:border-gray-800 last:border-b-0">
      <div className="flex flex-col gap-2 min-w-[100px]">
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <div className="flex flex-row gap-3 flex-wrap">
        {daySlots.map((slot) => {
          const slotTime = dayjs(activeDate)
            .hour(slot.hour)
            .minute(slot.minute)
            .second(0);

            const isPast = dayjs(activeDate).isSame(now, 'day') && now.isAfter(slotTime);
            const isAvailable = slot.isSlotAvailable && !isPast;  
          const isSelected = selectedSlot === slot.key;

          return (
            <Button
              size="sm"
              variant="outlined"
              key={slot.key}
              onClick={() =>
                isAvailable && handleSlotSelect(slot.hour, slot.minute, slot.key)
              }
              disabled={!isAvailable} // Disable if not available
              className={`${
                isSelected
                  ? 'bg-blue-500 text-white' // Blue for selected slot
                  : !isAvailable
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : ''
              }`}
            >
              <p>{slot.label}</p>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
