import dayjs from 'dayjs';

export const isSameHour = (time1: string | number, time2: string | number) => {
  const date1 = dayjs(time1);
  const date2 = dayjs(time2);

  return date1.startOf('hour').isSame(date2.startOf('hour'));
};
