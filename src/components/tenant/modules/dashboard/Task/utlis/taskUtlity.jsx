import { format, isToday, isTomorrow, differenceInCalendarDays } from 'date-fns';

export const getDueDateLabel = (dateString, status) => {
  if (!dateString) {
    return { label: "No Due Date", color: "text-gray-400" };
  }

  const dueDate = new Date(dateString);
  const today = new Date();

  if (isNaN(dueDate)) {
    return { label: "Invalid Date", color: "text-red-500" };
  }

  if (status?.toLowerCase() === 'completed') {
    return { label: "Completed", color: "text-green-600" };
  }

  const diff = differenceInCalendarDays(dueDate, today);

  if (isToday(dueDate)) return { label: "Due Today", color: "text-orange-500" };
  if (isTomorrow(dueDate)) return { label: "Due Tomorrow", color: "text-yellow-500" };
  if (diff > 1) return { label: `Due in ${diff} days`, color: "text-blue-500" };
  if (diff < 0) return { label: `Overdue by ${Math.abs(diff)} days`, color: "text-red-500" };

  return { label: format(dueDate, 'MMM dd, yyyy'), color: "text-gray-600" };
};
