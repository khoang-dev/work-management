import { HOUR_TO_MINUTE } from './constant';
import { HmTime } from './type';

export function hmTimeToMinute(time: HmTime): number {
  return time.hours * HOUR_TO_MINUTE + time.minutes;
}

export function minuteToHmTime(minutes: number): HmTime {
  return {
    hours: Math.floor(minutes / HOUR_TO_MINUTE),
    minutes: minutes % HOUR_TO_MINUTE,
  };
}
